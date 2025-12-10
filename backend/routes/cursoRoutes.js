const express = require('express');
const router = express.Router();
const cursoController = require('../controllers/cursoController');

router.get('/professor/:teacherId', cursoController.listarCursosProfessor);
router.post('/', cursoController.criarCurso);
router.get('/:id', cursoController.obterCurso);
router.put('/:id', cursoController.editarCurso);
router.delete('/:id', cursoController.apagarCurso);

module.exports = router;
