const teamModel = require("../models/teamModel");

// Criar equipa
exports.createTeam = (req, res) => {
    const { projectId, teamName, members, tasks } = req.body;

    teamModel.createTeam(projectId, teamName, members, tasks, (err, result) => {
        if (err) {
            console.error("createTeam error:", err);
            return res.status(500).json({ message: "Erro ao criar equipa" });
        }
        res.json(result);
    });
};

// Listar equipas
exports.getTeams = (req, res) => {
    teamModel.getTeams((err, teams) => {
        if (err) return res.status(500).json({ message: "Erro ao buscar equipas" });
        res.json(teams);
    });
};

// Apagar equipa
exports.deleteTeam = (req, res) => {
    teamModel.deleteTeam(req.params.id, (err, result) => {
        if (err) return res.status(500).json({ message: "Erro ao eliminar equipa" });
        res.json(result);
    });
};

// Buscar estudantes
exports.getStudents = (req, res) => {
    teamModel.getStudents((err, rows) => {
        if (err) return res.status(500).json({ message: "Erro ao buscar estudantes" });
        res.json(rows);
    });
};

// Marcar/desmarcar tarefa
exports.toggleTask = (req, res) => {
    teamModel.toggleTaskCompleted(req.params.taskId, req.body.completed, (err, result) => {
        if (err) return res.status(500).json({ message: "Erro ao atualizar tarefa" });
        res.json({ message: "Tarefa atualizada" });
    });
};

// Buscar tarefas de equipa
exports.getTasksByTeam = (req, res) => {
    teamModel.getTasksByTeam(req.params.teamId, (err, rows) => {
        if (err) return res.status(500).json({ message: "Erro ao buscar tarefas" });
        res.json(rows);
    });
};
