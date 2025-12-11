const express = require("express");
const router = express.Router();
const teamController = require("../controllers/teamController");

router.get("/", teamController.getTeams);
router.post("/create", teamController.createTeam);
router.delete("/:id", teamController.deleteTeam);

// Rota para estudantes
const db = require("../config/db");

router.get("/students", async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT student.S_ID, user.U_Name 
            FROM student
            JOIN user ON user.U_ID = student.S_U_ID
        `);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ message: "Erro ao buscar estudantes" });
    }
});

module.exports = router;
