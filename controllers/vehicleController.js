const { models } = require('../models/index.js');

const createVehicle = async (req, res) => {
  try {
    const {name}=req.body;
    const vehicle = await models.Vehicles.create({name:name});
    res.status(201).json(vehicle);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getAllVehicles = async (req, res) => {
  try {
    const { id, page } = req.query;
    if(id){
      const vehicle = await models.Vehicles.findOne({
       where:{id:Number(id)}
      });
      res.status(200).json(vehicle);
    }else{
      const vehicles = await models.Vehicles.findAndCountAll({
        limit: 20,
        offset: page ? (Number(page) - 1) * 20 : 0,
        order: [['updatedAt', 'DESC']],
      });
      res.status(200).json(vehicles);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Internal Server Error', error });
    
  }
};

const getVehicleById = async (req, res) => {
  const { id } = req.params;
  try {
    const vehicle = await models.Vehicles.findByPk(id);
    if (!vehicle) {
      res.status(404).json({ error: 'Vehicle not found' });
      return;
    }
    res.status(200).json(vehicle);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const updateVehicle = async (req, res) => {
  const { id } = req.params;
  const { code, name , name2,box_count,bottom_box_count } = req.body;
  try {
    const [updated] = await models.Vehicles.update({ box_count,bottom_box_count,code, name, name2 }, {
      where: { id },
    });
    if (updated) {
      const updatedVehicle = await models.Vehicles.findByPk(id);
      res.status(200).json(updatedVehicle);
    } else {
      res.status(404).json({ error: 'Vehicle not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const deleteVehicle = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await models.Vehicles.destroy({
      where: { id },
    });
    if (deleted) {
      res.status(200).json({ message: 'نوع وسیله نقلیه حذف شد' });
    } else {
      res.status(404).json({ error: 'Vehicle not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  createVehicle,
  getAllVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
};
