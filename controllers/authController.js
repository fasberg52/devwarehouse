const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../config/config.json");
const { models } = require("../models/index");

module.exports = {
  async test(req, res) {
    res.status(200).json("is ok");
  },

  async register(req, res) {
    try {
      const { password, name, mobile } = req.body;

      if (!password || !name || !mobile) {
        return res.status(400).json({ message: "پارامترهای ارسالی صحیح نیست" });
      }
      console.log(mobile);
     
      const existingUser = await models.User.findOne({
        where: { mobile: mobile },
      });
      console.log(JSON.stringify(existingUser));
      if (existingUser) {
        return res
          .status(400)
          .json({ message: "شماره همراه شما قبل ثبت شده است" });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new user
      const newUser = await models.User.create({
        name: name,
        mobile: mobile,
        password: hashedPassword,
      });

      // Generate JWT token
      const token = jwt.sign({ mobile: mobile }, config.production.JWT_SECRET, {
        expiresIn: "1d",
      });

      // Update user with token
      newUser.token = token;
      await newUser.save();

      res.json({
        newUser: newUser,
      });
    } catch (err) {
      console.error(`Error in registration: ${err}`);
      res.status(500).json({ message: "خطای سرور" });
    }
  },
  async login(req, res) {
    try {
      const { mobile, password } = req.body;

      if (!mobile || !password) {
        return res
          .status(400)
          .json({ message: "لطفا نام کاربری و رمز عبور را وارد نمایید" });
      }

      const user = await models.User.findOne({ where: { mobile: mobile } });

      if (!user) {
        return res
          .status(400)
          .json({ message: "لطفا نام کاربری و رمز عبور را بررسی نمایید" });
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return res.status(400).json({ message: "پسورد درست نیست" });
      }

      const token = jwt.sign(
        { userId: user.id, mobile: mobile },
        config.production.JWT_SECRET,
        { expiresIn: "1d" }
      );

      user.token = token;
      await user.save();

      res.json({
        user: user,
      });
    } catch (err) {
      console.error(`error in login: ${err}`);
      res.status(500).json({ message: "خطای سرور" });
    }
  },

  // get user information
  async getUser(req, res) {
    try {
      // find user by id
      const user = await models.User.findByPk(req.params.id);
      // return all info but password
      // send info to client
      res.status(200).json(user);
    } catch (err) {
      console.log(err);
      res.status(500).json("internal server error");
    }
  },
  async getAllUsersByRole(req, res) {
    try {
      const getAllUsersByRole = await models.User.findAndCountAll({
        where: { role: req.body.role },
        limit: 20,
      });
      res.status(200).json(getAllUsersByRole);
    } catch (err) {
      res.status(500).json("internal sever error");
    }
  },

  async deleteUser(req, res) {
    try {
      await models.User.destroy({ where: { id: req.params.id } });
      const findAll = await models.User.findAndCountAll({
        where: { role: req.body.role },
        limit: 20,
      });
      res.status(200).json(findAll);
    } catch (err) {
      console.log(err);
      res.status(500).json("internal server error");
    }
  },

  async updateUser(req, res) {
    try {
      const { id, mobile, name } = req.body;
      const [updateUser] = await models.User.update(
        { mobile: mobile, name: name },
        {
          where: { id: id },
        }
      );
      if (updateUser === 1) {
        const findOne = await models.User.findByPk(id);
        res.status(200).json(findOne);
      } else {
        res.status(400).json("not update");
      }
    } catch (err) {
      res.status(500).json("internal");
    }
  },
};
