// backend/routes/projectRoutes.js
const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const sprintController = require('../controllers/sprintController');

// ==================== ROTAS DE PROJETOS ====================
// Criar novo projeto
router.post('/', projectController.createProject);

// Buscar projetos por disciplina
router.get('/disciplina/:disciplineId', projectController.getProjectsByDiscipline);

// Buscar projetos do professor
router.get('/professor/:teacherId', projectController.getProjectsByTeacher);

// Buscar projeto por ID
router.get('/:projectId', projectController.getProjectById);

// Atualizar projeto
router.put('/:projectId', projectController.updateProject);

// Deletar projeto
router.delete('/:projectId', projectController.deleteProject);

// ==================== ROTAS DE SPRINTS ====================
// Criar novo sprint
router.post('/:projectId/sprints', sprintController.createSprint);

// Buscar sprints por projeto
router.get('/:projectId/sprints', sprintController.getSprintsByProject);

// Buscar sprint por ID
router.get('/sprints/:sprintId', sprintController.getSprintById);

// Atualizar sprint
router.put('/sprints/:sprintId', sprintController.updateSprint);

// Deletar sprint
router.delete('/sprints/:sprintId', sprintController.deleteSprint);

module.exports = router;