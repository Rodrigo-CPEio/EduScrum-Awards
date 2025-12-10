const express = require('express');
const router = express.Router();
const cursoController = require('../controllers/cursoController');

// Listar cursos do professor
router.get('/professor/:teacherId', cursoController.listarCursosProfessor);

// Criar novo curso
router.post('/', cursoController.criarCurso);

// Obter detalhes de um curso
router.get('/:id', cursoController.obterCurso);

// Editar curso
router.put('/:id', cursoController.editarCurso);

// Apagar curso
router.delete('/:id', cursoController.apagarCurso);

module.exports = router;