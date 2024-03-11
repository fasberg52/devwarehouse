const express = require('express');
const excelHelper=require('../helper/uploadExcel');
const LocationController=require('../controllers/locationController');
const controller=new LocationController()
const router = express.Router();

router.post('/',excelHelper.single('file'),controller.insertLocationsByExcel);
router.put('/fillLocation',controller.fillLocation);
router.put('/setEmptyToLocation',controller.setLocationEqualEmpty);
router.post('/order',controller.orderBySituation);
router.post('/getone',controller.findOneLocation);
router.get('/freeCharacter',controller.findValidNumberAndCharacter);
router.post('/orderpallet',controller.orderPallet);
router.put('/fillpallet',controller.fillPallet);
router.post('/call',controller.call);
router.post('/free',controller.updateLocation);
router.post('/emptyPallet',controller.fillLocationsAndSetEqualEmptyPallet);
router.post('/newLocation',controller.newLocation);
router.put('deleteLocation')
router.put('/isBloced',controller.fillLocations)

module.exports=router