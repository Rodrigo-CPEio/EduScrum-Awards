const teamModel = require("../models/teamModel");

// Criar equipa
exports.createTeam = async (req, res) => {
    try {
        const { projectId, teamName, totalTasks, members } = req.body;

        const result = await teamModel.createTeam(projectId, teamName, totalTasks, members);
        res.json(result);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Erro ao criar equipa", error: err });
    }
};

// Listar equipas
exports.getTeams = async (req, res) => {
    try {
        const teams = await teamModel.getTeams();
        res.json(teams);
    } catch (err) {
        res.status(500).json({ message: "Erro ao buscar equipas" });
    }
};

// Eliminar equipa
exports.deleteTeam = async (req, res) => {
    try {
        const result = await teamModel.deleteTeam(req.params.id);
        res.json(result);
    } catch (err) {
        res.status(500).json({ message: "Erro ao eliminar equipa" });
    }
};
