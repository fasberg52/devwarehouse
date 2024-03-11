const { models } = require('../models/index.js');
const bcrypt = require("bcrypt");


exports.createUser = async (req, res) => {
  try {
    const { name, mobile, email, password,is_admin } = req.body;
    bcrypt.genSalt(10, function(err, salt) {
      bcrypt.hash(password, salt, async (err, hash) => {
        if (err) throw err;
        const user = await models.User.create({ is_admin,name, mobile, email, password:hash});
        res.json(user);
      })
    }) 
  } catch (error) {
    console.error(error); 
    res.status(500).json({ error: 'Unable to create user' });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const { id, page } = req.query;

    if(id){
      const user = await models.User.findOne({
        where:{
          id:Number(id)
        }
      });
      return res.json(user);
    }
    const users = await models.User.findAndCountAll({
      limit: 20,
      offset: page ? (Number(page) - 1) * 20 : 0,
      order: [['id', 'DESC']],
    });
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to fetch users' });
  }
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await models.User.destroy({
      where: { id },
    });
    if (deleted) {
      res.status(200).json({ message: 'کاربر حذف شد' });
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

