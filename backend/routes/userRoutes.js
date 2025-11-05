const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// POST /usuarios/register
router.post('/register', userController.register);

// POST /usuarios/login
router.post('/login', userController.login);

module.exports = router;
