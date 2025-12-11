// backend/controllers/teamController.js
const teamModel = require("../models/teamModel");

// =========================
//   CRIAR EQUIPA
// =========================
exports.createTeam = (req, res) => {
    const { projectId, teamName, totalTasks, members } = req.body;
    
    teamModel.createTeam(projectId, teamName, totalTasks, members, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Erro ao criar equipa", error: err });
        }
        res.json(result);
    });
};

// =========================
//   LISTAR EQUIPAS
// =========================
exports.getTeams = (req, res) => {
    teamModel.getTeams((err, teams) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Erro ao buscar equipas" });
        }
        res.json(teams);
    });
};

// =========================
//   ELIMINAR EQUIPA
// =========================
exports.deleteTeam = (req, res) => {
    teamModel.deleteTeam(req.params.id, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Erro ao eliminar equipa" });
        }
        res.json(result);
    });
};