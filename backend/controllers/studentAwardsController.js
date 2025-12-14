// backend/controllers/studentAwardsController.js
const Model = require("../models/studentAwardsModel");

module.exports = {
  getMyIndividualAwards(req, res) {
    const studentId = Number(req.query.studentId);
    if (!studentId) return res.status(400).json({ error: "studentId é obrigatório" });

    Model.getMyIndividualAwards(studentId, (err, rows) => {
      if (err) {
        console.error("❌ getMyIndividualAwards ERROR:", err);
        return res.status(500).json({ error: "Erro ao buscar prémios individuais" });
      }
      res.json(rows);
    });
  },

  getMyTeamAwards(req, res) {
    const studentId = Number(req.query.studentId);
    if (!studentId) return res.status(400).json({ error: "studentId é obrigatório" });

    Model.getMyTeamAwards(studentId, (err, rows) => {
      if (err) {
        console.error("❌ getMyTeamAwards ERROR:", err);
        return res.status(500).json({ error: "Erro ao buscar prémios de equipa" });
      }
      res.json(rows);
    });
  },
};
