const dashboardModel = require("../models/dashboardModel.js");

module.exports = {
  async getStudentDashboard(req, res) {
    try {
      const studentId = Number(req.query.studentId);
      if (!studentId) return res.status(400).json({ message: "studentId inválido" });

      const data = await dashboardModel.getStudentDashboard(studentId);
      return res.json(data);
    } catch (err) {
      console.error("❌ dashboard error:", err);
      return res.status(500).json({ message: "Erro ao carregar dashboard" });
    }
  }
};
