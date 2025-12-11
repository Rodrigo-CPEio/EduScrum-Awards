const express = require("express");
const router = express.Router();
const teamController = require("../controllers/teamController");

router.get("/", teamController.getTeams);
router.post("/create", teamController.createTeam);
router.delete("/:id", teamController.deleteTeam);

router.get("/students", teamController.getStudents);
router.get("/tasks/:teamId", teamController.getTasksByTeam);

router.post("/tasks/:taskId/complete", teamController.toggleTask);

module.exports = router;
