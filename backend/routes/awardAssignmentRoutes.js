// backend/routes/awardAssignmentRoutes.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/awardAssignmentController');

// Listar dados
router.get('/', controller.listar);
router.get('/estudantes/lista', controller.listarEstudantes);
router.get('/equipas/lista', controller.listarEquipas);
router.get('/premio/:awardId', controller.obterAtribuicoes);

// Atribuir prémios
router.post('/estudante', controller.atribuirEstudante);
router.post('/equipa', controller.atribuirEquipa);

// Eliminar atribuição
router.delete('/:id', controller.eliminar);

module.exports = router;