const { models } = require('../models/index.js');

const createDriver = async (req, res) => {
  try {
    const { code, name , name2,box_count,bottom_box_count } = req.body;
    let publicUrl = null;    
    const driver = await models.Driver.create({ box_count,bottom_box_count,code, name, image : publicUrl, name2 });
    res.status(201).json(driver);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getAllDrivers = async (req, res) => {
  try {
    const { id, page } = req.query;
    if(id){
      const driver = await models.Driver.findOne({
       where:{id:Number(id)}
      });
      res.status(200).json(driver);
    }else{
      const drivers = await models.Driver.findAndCountAll({
        limit: 20,
        offset: page ? (Number(page) - 1) * 20 : 0,
        order: [['id', 'DESC']],
      });
      res.status(200).json(drivers);
    }
  } catch (error) {
    console.error(error);
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE').
    res.status(500).json({ msg: 'Internal Server Error', error });
  }
};

const getDriverById = async (req, res) => {
  const { id } = req.params;
  try {
    const driver = await models.Driver.findByPk(id);
    if (!driver) {
      res.status(404).json({ error: 'Driver not found' });
      return;
    }
    res.status(200).json(driver);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const updateDriver = async (req, res) => {
  const { id } = req.params;
  try {
    const updated = await models.User.update(req.body, {
      where: { id },
    });
    if (updated) {
      const updatedDriver = await models.User.findByPk(id);
      res.status(200).json(updatedDriver);
    } else {
      res.status(404).json({ error: 'Driver not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const deleteDriver = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await models.Driver.destroy({
      where: { id },
    });
    if (deleted) {
      res.status(200).json({ message: 'راننده حذف شد' });
    } else {
      res.status(404).json({ error: 'Driver not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  createDriver,
  getAllDrivers,
  getDriverById,
  updateDriver,
  deleteDriver,
};
