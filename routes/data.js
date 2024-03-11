const express = require('express');
const router = express.Router();
const multer = require('multer');

const { stockItemExcel, importData } = require('../controllers/dataController');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const adminMiddleware = require('./../middleware/adminMiddleware');

router.post('/import',upload.single("file") ,adminMiddleware,importData);

router.get('/export', stockItemExcel);

module.exports = router;
