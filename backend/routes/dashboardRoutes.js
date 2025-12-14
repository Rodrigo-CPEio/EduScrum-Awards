const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboardController");

// GET /api/dashboard/me?studentId=5
router.get("/me", dashboardController.getStudentDashboard);

module.exports = router;
