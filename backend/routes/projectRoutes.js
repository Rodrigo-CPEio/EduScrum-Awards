// backend/routes/projectRoutes.js
const express = require("express");
const router = express.Router();
const projectController = require("../controllers/projectController");

// LISTAR TODOS (opcional)
router.get("/", projectController.getProjects);

// ✅ MIS PROYECTOS (IMPORTANTE: antes de "/:projectId")
router.get("/me", projectController.getMyProjects);

// crear
router.post("/", projectController.createProject);

// por disciplina
router.get("/disciplina/:disciplineId", projectController.getProjectsByDiscipline);

// por profesor
router.get("/professor/:teacherId", projectController.getProjectsByTeacher);

// por id (último)
router.get("/:projectId", projectController.getProjectById);

// update / delete
router.put("/:projectId", projectController.updateProject);
router.delete("/:projectId", projectController.deleteProject);

module.exports = router;
