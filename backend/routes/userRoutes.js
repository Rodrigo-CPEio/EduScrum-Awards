//UserRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Registrar
router.post('/register', userController.register);

// Login
router.post('/login', userController.login);

// Obter perfil
router.get('/profile/:userId', userController.getProfile);

// Atualizar perfil
router.put('/profile/:userId', userController.updateProfile);

// Alterar senha
router.put('/password/:userId', userController.changePassword);

module.exports = router;
