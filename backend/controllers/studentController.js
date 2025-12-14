// backend/controllers/studentController.js
const StudentModel = require("../models/studentModel");

// GET /cursos
exports.getCursos = (req, res) => {
  StudentModel.getCursos((err, rows) => {
    if (err) {
      console.error("getCursos error:", err);
      return res.status(500).json({ message: "Erro ao buscar cursos" });
    }
    res.json(rows);
  });
};

// GET /cursos/:courseId/cadeiras
exports.getCadeirasByCurso = (req, res) => {
  const courseId = Number(req.params.courseId);
  if (!courseId) return res.status(400).json({ message: "courseId inválido" });

  StudentModel.getCadeirasByCurso(courseId, (err, rows) => {
    if (err) {
      console.error("getCadeirasByCurso error:", err);
      return res.status(500).json({ message: "Erro ao buscar cadeiras do curso" });
    }
    res.json(rows);
  });
};

// POST /cadeiras/:disciplinaId/join  body: { studentId }
exports.joinCadeira = (req, res) => {
  const disciplinaId = Number(req.params.disciplinaId);
  const studentId = Number(req.body.studentId);

  if (!disciplinaId || !studentId) {
    return res.status(400).json({ message: "disciplinaId e studentId são obrigatórios" });
  }

  StudentModel.joinCadeira(studentId, disciplinaId, (err, result) => {
    if (err) {
      console.error("joinCadeira error:", err);
      return res.status(500).json({ message: "Erro ao entrar na cadeira" });
    }
    res.json(result);
  });
};

// POST /cursos/:courseId/join  body: { studentId }
exports.joinCursoAllCadeiras = (req, res) => {
  const courseId = Number(req.params.courseId);
  const studentId = Number(req.body.studentId);

  if (!courseId || !studentId) {
    return res.status(400).json({ message: "courseId e studentId são obrigatórios" });
  }

  StudentModel.joinCursoAllCadeiras(studentId, courseId, (err, result) => {
    if (err) {
      console.error("joinCursoAllCadeiras error:", err);
      return res.status(500).json({ message: "Erro ao entrar no curso" });
    }
    res.json(result);
  });
};

// GET /cadeiras/me?studentId=2
exports.getMyCadeiras = (req, res) => {
  const studentId = Number(req.query.studentId);
  if (!studentId) return res.status(400).json({ message: "studentId obrigatório" });

  StudentModel.getMyCadeiras(studentId, (err, rows) => {
    if (err) {
      console.error("getMyCadeiras error:", err);
      return res.status(500).json({ message: "Erro ao buscar minhas cadeiras" });
    }
    res.json(rows);
  });
};

// GET /cadeiras/:disciplinaId/projetos
exports.getProjetosByCadeira = (req, res) => {
  const disciplinaId = Number(req.params.disciplinaId);
  if (!disciplinaId) return res.status(400).json({ message: "disciplinaId inválido" });

  StudentModel.getProjetosByCadeira(disciplinaId, (err, rows) => {
    if (err) {
      console.error("getProjetosByCadeira error:", err);
      return res.status(500).json({ message: "Erro ao buscar projetos" });
    }
    res.json(rows);
  });
};
