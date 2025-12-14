const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/studentProfileController");

// GET /api/students/me?studentId=5
router.get("/me", ctrl.getMyProfile);

// PUT /api/students/me?studentId=5
router.put("/me", ctrl.updateMyProfile);

module.exports = router;
