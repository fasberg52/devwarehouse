const express = require('express');
const router = express.Router();
const { createVehicle, getAllVehicles, getVehicleById, updateVehicle, deleteVehicle } = require('../controllers/vehicleController');
const adminMiddleware = require('./../middleware/adminMiddleware');
const authMiddleware = require('./../middleware/authMiddleware');

router.post('/',adminMiddleware,createVehicle);
  
router.get('/',getAllVehicles);
  
// router.get('/:id', getVehicleById);
  
router.put('/:id', adminMiddleware,updateVehicle);
  
router.delete('/:id',adminMiddleware , deleteVehicle);
  

module.exports = router;
