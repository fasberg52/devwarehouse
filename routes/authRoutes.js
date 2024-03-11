const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { login,register,test,getAllUsersByRole,getUser ,deleteUser,updateUser} = require('../controllers/authController');

// User login
router.get('/',test);
router.post('/login', login);
router.post('/signup',register);
router.post('/getusers',getAllUsersByRole);
router.get('/getoneuser/:id',getUser);
router.delete('/deleteuser/:id',deleteUser);
router.put('/updateuser',updateUser)

// Refresh access token
// router.post('/refresh-token', refreshToken);

module.exports = router;
