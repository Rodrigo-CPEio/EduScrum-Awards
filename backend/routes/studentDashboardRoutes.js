const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/studentDashboardController");

// GET /api/dashboard/me?studentId=5
router.get("/me", ctrl.getMyDashboard);

module.exports = router;
