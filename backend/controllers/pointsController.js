const pointsModel = require("../models/pointsModel");

module.exports = {
  getMyPoints(req, res) {
    const studentId = Number(req.query.studentId);
    if (!studentId) return res.status(400).json({ error: "studentId obrigatório" });

    pointsModel.getMyPoints(studentId, (err, points) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ points });
    });
  },

  getStudentsRanking(req, res) {
    pointsModel.getStudentsRanking((err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    });
  },

  getTeamsRanking(req, res) {
    pointsModel.getTeamsRanking((err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    });
  }
};
