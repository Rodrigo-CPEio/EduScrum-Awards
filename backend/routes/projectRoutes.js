// backend/routes/projectRoutes.js
const express = require("express");
const router = express.Router();
const projectController = require("../controllers/projectController");
const sprintController = require("../controllers/sprintController");

// ==================== ROTAS DE PROJETOS ====================
// LISTAR TODOS
router.get("/", projectController.getProjects);

// ✅ MEUS PROJETOS (antes de "/:projectId")
router.get("/me", projectController.getMyProjects);

// CRIAR PROJETO
router.post("/", projectController.createProject);

// POR DISCIPLINA
router.get("/disciplina/:disciplineId", projectController.getProjectsByDiscipline);

// POR PROFESSOR
router.get("/professor/:teacherId", projectController.getProjectsByTeacher);

// ==================== ROTAS DE SPRINTS ====================
// ✅ CRIAR SPRINT (POST /projetos/:projectId/sprints)
router.post("/:projectId/sprints", sprintController.createSprint);

// ✅ LISTAR SPRINTS DE UM PROJETO (GET /projetos/:projectId/sprints)
router.get("/:projectId/sprints", sprintController.getSprintsByProject);

// ✅ DELETAR SPRINT (DELETE /projetos/sprints/:sprintId)
router.delete("/sprints/:sprintId", sprintController.deleteSprint);

// ✅ ATUALIZAR SPRINT (PUT /projetos/sprints/:sprintId)
router.put("/sprints/:sprintId", sprintController.updateSprint);

// ✅ BUSCAR SPRINT POR ID (GET /projetos/sprints/:sprintId)
router.get("/sprints/:sprintId", sprintController.getSprintById);

// ==================== ROTAS DE PROJETO POR ID ====================
// POR ID (DEVE VIR POR ÚLTIMO!)
router.get("/:projectId", projectController.getProjectById);

// ATUALIZAR PROJETO
router.put("/:projectId", projectController.updateProject);

// DELETAR PROJETO
router.delete("/:projectId", projectController.deleteProject);

module.exports = router;