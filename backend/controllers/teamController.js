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

// ✅ NOVO: Adicionar membro a uma equipa
exports.addTeamMember = (req, res) => {
    const { teamId, studentId, role } = req.body;
    
    if (!teamId || !studentId) {
        return res.status(400).json({ message: "TeamId e StudentId são obrigatórios" });
    }

    teamModel.addTeamMember(teamId, studentId, role, (err, result) => {
        if (err) {
            console.error("addTeamMember error:", err);
            return res.status(500).json({ message: "Erro ao adicionar membro" });
        }
        res.json(result);
    });
};

// ✅ NOVO: Remover membro de uma equipa
exports.removeTeamMember = (req, res) => {
    const { teamId, studentId } = req.body;
    
    if (!teamId || !studentId) {
        return res.status(400).json({ message: "TeamId e StudentId são obrigatórios" });
    }

    teamModel.removeTeamMember(teamId, studentId, (err, result) => {
        if (err) {
            console.error("removeTeamMember error:", err);
            return res.status(500).json({ message: err.message || "Erro ao remover membro" });
        }
        res.json(result);
    });
};

// ✅ NOVO: Atualizar role de um membro
exports.updateTeamMemberRole = (req, res) => {
    const { teamId, studentId, role } = req.body;
    
    if (!teamId || !studentId || !role) {
        return res.status(400).json({ message: "TeamId, StudentId e Role são obrigatórios" });
    }

    teamModel.updateTeamMemberRole(teamId, studentId, role, (err, result) => {
        if (err) {
            console.error("updateTeamMemberRole error:", err);
            return res.status(500).json({ message: err.message || "Erro ao atualizar role" });
        }
        res.json(result);
    });
};

// ✅ NOVO: Buscar membros de uma equipa
exports.getTeamMembers = (req, res) => {
    const { teamId } = req.params;
    
    teamModel.getTeamMembers(teamId, (err, members) => {
        if (err) {
            console.error("getTeamMembers error:", err);
            return res.status(500).json({ message: "Erro ao buscar membros da equipa" });
        }
        res.json(members);
    });
};