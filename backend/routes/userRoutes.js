const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// GET /usuarios
router.get('/', userController.getAllUsers);

module.exports = router;
