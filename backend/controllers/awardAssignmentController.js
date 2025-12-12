// backend/controllers/awardAssignmentController.js
const Model = require('../models/awardAssignmentModel');

module.exports = {
  // Listar todos os estudantes
  listarEstudantes(req, res) {
    Model.getAllStudents((err, results) => {
      if (err) return res.status(500).json({ error: "Erro ao buscar estudantes" });
      res.json(results);
    });
  },

  // Listar todas as equipas
  listarEquipas(req, res) {
    Model.getAllTeams((err, results) => {
      if (err) return res.status(500).json({ error: "Erro ao buscar equipas" });
      res.json(results);
    });
  },

  // Obter atribuições de um prémio
  obterAtribuicoes(req, res) {
    const awardId = req.params.awardId;
    Model.getAssignmentsByAward(awardId, (err, results) => {
      if (err) return res.status(500).json({ error: "Erro ao buscar atribuições" });
      res.json(results);
    });
  },

  // Atribuir a um estudante
  atribuirEstudante(req, res) {
    const data = req.body;

    if (!data.awardId || !data.teacherId || !data.studentId) {
      return res.status(400).json({ error: "awardId, teacherId e studentId são obrigatórios" });
    }

    Model.assignToStudent(data, (err, result) => {
      if (err) {
        console.error('Erro ao atribuir prémio a estudante:', err);
        return res.status(500).json({ error: "Erro ao atribuir prémio", details: err.message });
      }
      res.status(201).json({ message: "Prémio atribuído ao estudante", id: result.insertId });
    });
  },

  // Atribuir a uma equipa
  atribuirEquipa(req, res) {
    const data = req.body;

    if (!data.awardId || !data.teacherId || !data.teamId) {
      return res.status(400).json({ error: "awardId, teacherId e teamId são obrigatórios" });
    }

    Model.assignToTeam(data, (err, result) => {
      if (err) {
        console.error('Erro ao atribuir prémio a equipa:', err);
        return res.status(500).json({ error: "Erro ao atribuir prémio", details: err.message });
      }
      res.status(201).json({ message: "Prémio atribuído à equipa", id: result.insertId });
    });
  },

  // Listar todas as atribuições
  listar(req, res) {
    Model.getAssignments((err, rows) => {
      if (err) return res.status(500).json({ error: "Erro ao buscar atribuições" });
      res.json(rows);
    });
  },

  // Eliminar atribuição
  eliminar(req, res) {
    const assignmentId = req.params.id;
    Model.deleteAssignment(assignmentId, (err, result) => {
      if (err) return res.status(500).json({ error: "Erro ao eliminar atribuição" });
      if (result.affectedRows === 0) return res.status(404).json({ error: "Atribuição não encontrada" });
      res.json({ message: "Atribuição eliminada com sucesso" });
    });
  }
};