// backend/routes/teamRoutes.js
const express = require("express");
const router = express.Router();
const teamController = require("../controllers/teamController");
const db = require("../config/db");

// Rotas de equipas
router.get("/", teamController.getTeams);
router.post("/create", teamController.createTeam);
router.delete("/:id", teamController.deleteTeam);

// Rota para buscar estudantes
router.get("/students", (req, res) => {
    db.query(
        `SELECT student.S_ID, user.U_Name 
         FROM student
         JOIN user ON user.U_ID = student.S_U_ID`,
        (err, rows) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: "Erro ao buscar estudantes" });
            }
            res.json(rows);
        }
    );
});

module.exports = router;