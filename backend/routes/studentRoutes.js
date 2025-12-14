// backend/routes/studentRoutes.js
const express = require("express");
const router = express.Router();
const studentController = require("../controllers/studentController");

// CURSOS
router.get("/cursos", studentController.getCursos);
router.get("/cursos/:courseId/cadeiras", studentController.getCadeirasByCurso);
router.post("/cursos/:courseId/join", studentController.joinCursoAllCadeiras);

// CADEIRAS
router.get("/cadeiras/me", studentController.getMyCadeiras);
router.post("/cadeiras/:disciplinaId/join", studentController.joinCadeira);
router.get("/cadeiras/:disciplinaId/projetos", studentController.getProjetosByCadeira);

module.exports = router;
