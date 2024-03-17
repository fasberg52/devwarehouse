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
      // Check user enters all fields
      if (!password)
        return res
          .status(400)
          .json({ message: "Please provide email and password" });
      // Check the user enters the right formatted email
      const reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
      // if (reg.test(email) === false) return res.status(400).json({ message: "Incorrect email format" });
      // Check user password length is more than 8 character

      // create new User object to be saved in Database

      // Check if user already exist
      const user = await models.User.findOne({ where: { name: name } });
      if (user)
        return res
          .status(400)
          .json({ message: "Email already registered. Please Login" });
      const newUser = await models.User.create({
        password: password,
        name: name,
        mobile: mobile,
      });

      let { role } = newUser;
      // Generate Password Hash
      bcrypt.genSalt(10, (err, salt) => {
        if (err) throw err;
        bcrypt.hash(password, salt, async (err, hash) => {
          if (err) throw err;
          // Add hashed password to new user object
          newUser.password = hash;
          //Save user to DB
          req.body.role
            ? (newUser.role = req.body.role)
            : (newUser.role = role);
          // create json web token and send it back to client side
          const token = jwt.sign(
            { mobile: mobile },
            config.production.JWT_SECRET,
            { expiresIn: "1d" }
          );
          newUser.token = token;
          await newUser.save();
          res.json({
            newUser: newUser,
          });
        });
      });
    } catch (err) {
      throw err;
    }
  },

  async login(req, res) {
    try {
      const { mobile, password } = req.body;

      // Check user enters all fields
      if (!mobile || !password)
        res
          .status(400)
          .json({ message: "لطفا نام کاربری و رمز عبور را وارد نمایید" });
      // Check for correct mobile
      const user = await models.User.findOne({ where: { mobile: mobile } });
      console.log(user);
      // if mobile not found
      if (!user)
        res
          .status(400)
          .json({ message: "لطفا نام کاربری و رمز عبور را بررسی نمایید" });
      // if mobile found compare hashed password with incoming password

      // console.log({mobile})

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        res.status(400).json("پسورد درست نیست");
      }

      const token = jwt.sign(
        { userId: user.id, mobile: mobile },
        config.production.JWT_SECRET,
        { expiresIn: "1d" }
      );
      user.token = token;
      user.save();
      res.send({
        user: user,
      });
    } catch (err) {
      console.log(err);
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
