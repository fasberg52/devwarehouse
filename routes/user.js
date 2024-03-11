const express = require('express');
const router = express.Router();
const { createUser, getAllUsers , deleteUser } = require('../controllers/userController');

router.post('/',createUser);
  
router.get('/', getAllUsers);

router.delete('/:id',deleteUser);

module.exports = router;
