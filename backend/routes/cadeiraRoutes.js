const express = require('express');
const router = express.Router();
const cadeiraController = require('../controllers/cadeiraController');

// Rotas específicas primeiro
router.get('/curso/:cursoId', cadeiraController.listarPorCurso); // listar por curso
router.get('/professor/:professorId', cadeiraController.listarPorProfessor); // fallback
router.get('/:id/estudantes', cadeiraController.listarEstudantes); // listar estudantes de uma cadeira
router.get('/:id', cadeiraController.obterPorId);
router.post('/', cadeiraController.criar);
router.put('/:id', cadeiraController.atualizar);
router.delete('/:id', cadeiraController.apagar);

module.exports = router;
