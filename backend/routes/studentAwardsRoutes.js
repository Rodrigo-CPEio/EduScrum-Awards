// backend/routes/studentAwardsRoutes.js
const express = require("express");
const router = express.Router();

const ctrl = require("../controllers/studentAwardsController");

// Debug rápido (podes apagar depois)
console.log("studentAwardsController keys:", Object.keys(ctrl));

router.get("/me", ctrl.getMyIndividualAwards);
router.get("/teams/me", ctrl.getMyTeamAwards);

module.exports = router;
