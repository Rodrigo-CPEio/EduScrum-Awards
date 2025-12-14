const express = require("express");
const router = express.Router();
const pointsController = require("../controllers/pointsController");

router.get("/me", pointsController.getMyPoints);
router.get("/students", pointsController.getStudentsRanking);
router.get("/teams", pointsController.getTeamsRanking);

module.exports = router;
