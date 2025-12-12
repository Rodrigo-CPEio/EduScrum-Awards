const db = require("../config/db");

// Criar equipa (com membros + tarefas)
exports.createTeam = (projectId, teamName, members = [], tasks = [], callback) => {

    // Inserir equipa
    db.query(
        "INSERT INTO team (TE_P_ID, TE_Name) VALUES (?, ?)",
        [projectId, teamName],
        (err, result) => {
            if (err) return callback(err);

            const teamId = result.insertId;

            // ----------------------------
            // Inserção de Membros
            // ----------------------------
            members = Array.isArray(members) ? members : [];
            tasks = Array.isArray(tasks) ? tasks : [];

            let membersDone = 0;
            let tasksDone = 0;

            // Caso especial: sem membros e sem tarefas
            if (members.length === 0 && tasks.length === 0) {
                return callback(null, { message: "Equipa criada com sucesso!", teamId });
            }

            // Inserir membros
            if (members.length > 0) {
                members.forEach(m => {
                    // ✅ USAR ON DUPLICATE KEY UPDATE para evitar erro de duplicação
                    db.query(
                        `INSERT INTO team_member (TM_TE_ID, TM_S_ID, TM_Role) 
                         VALUES (?, ?, ?) 
                         ON DUPLICATE KEY UPDATE TM_Role = VALUES(TM_Role)`,
                        [teamId, m.studentId, m.role],
                        (err) => {
                            if (err) return callback(err);

                            membersDone++;
                            if (membersDone === members.length && tasks.length === 0) {
                                return callback(null, { message: "Equipa criada com sucesso!", teamId });
                            }

                            if (membersDone === members.length && tasksDone === tasks.length) {
                                return callback(null, { message: "Equipa criada com sucesso!", teamId });
                            }
                        }
                    );
                });
            }

            // ----------------------------
            // Inserção de Tarefas
            // ----------------------------
            if (tasks.length > 0) {
                tasks.forEach(t => {
                    db.query(
                        "INSERT INTO task (T_TE_ID, T_Name, T_Description, T_Completed) VALUES (?, ?, ?, 0)",
                        [teamId, t.name, t.description],
                        (err) => {
                            if (err) return callback(err);

                            tasksDone++;
                            if (tasksDone === tasks.length && members.length === 0) {
                                return callback(null, { message: "Equipa criada com sucesso!", teamId });
                            }

                            if (tasksDone === tasks.length && membersDone === members.length) {
                                return callback(null, { message: "Equipa criada com sucesso!", teamId });
                            }
                        }
                    );
                });
            }
        }
    );
};

// Buscar equipas + membros + tarefas
exports.getTeams = (callback) => {
    db.query("SELECT * FROM team", (err, teams) => {
        if (err) return callback(err);
        if (teams.length === 0) return callback(null, []);

        let result = [];
        let done = 0;

        teams.forEach(team => {
            db.query(
                `SELECT s.S_ID, u.U_Name as name, tm.TM_Role as role
                 FROM team_member tm
                 JOIN student s ON s.S_ID = tm.TM_S_ID
                 JOIN user u ON u.U_ID = s.S_U_ID
                 WHERE tm.TM_TE_ID = ?`,
                [team.TE_ID],
                (err, members) => {
                    if (err) return callback(err);

                    db.query(
                        "SELECT * FROM task WHERE T_TE_ID = ?",
                        [team.TE_ID],
                        (err, tasks) => {
                            if (err) return callback(err);

                            result.push({
                                id: team.TE_ID,
                                name: team.TE_Name,
                                projectId: team.TE_P_ID,
                                members: members.map(m => ({
                                    id: m.S_ID,
                                    name: m.name,
                                    role: m.role
                                })),
                                tasks: tasks.map(t => ({
                                    id: t.T_ID,
                                    name: t.T_Name,
                                    description: t.T_Description,
                                    completed: t.T_Completed === 1
                                }))
                            });

                            done++;
                            if (done === teams.length) callback(null, result);
                        }
                    );
                }
            );
        });
    });
};

// Apagar equipa
exports.deleteTeam = (id, callback) => {
    db.query("DELETE FROM task WHERE T_TE_ID = ?", [id], err => {
        if (err) return callback(err);

        db.query("DELETE FROM team_member WHERE TM_TE_ID = ?", [id], err => {
            if (err) return callback(err);

            db.query("DELETE FROM team WHERE TE_ID = ?", [id], err => {
                if (err) return callback(err);

                callback(null, { message: "Equipa eliminada com sucesso!" });
            });
        });
    });
};

// Buscar estudantes
exports.getStudents = (callback) => {
    db.query(
        `SELECT student.S_ID as id, user.U_Name as name
         FROM student
         JOIN user ON user.U_ID = student.S_U_ID`,
        (err, students) => {
            if (err) return callback(err);
            callback(null, students);
        }
    );
};

// Atualizar tarefa
exports.toggleTaskCompleted = (taskId, completed, callback) => {
    db.query(
        "UPDATE task SET T_Completed = ? WHERE T_ID = ?",
        [completed ? 1 : 0, taskId],
        callback
    );
};

// Buscar tarefas por equipa
exports.getTasksByTeam = (teamId, callback) => {
    db.query(
        "SELECT * FROM task WHERE T_TE_ID = ?",
        [teamId],
        callback
    );
};

// ✅ NOVA FUNÇÃO: Adicionar membro a uma equipa existente
exports.addTeamMember = (teamId, studentId, role, callback) => {
    db.query(
        `INSERT INTO team_member (TM_TE_ID, TM_S_ID, TM_Role) 
         VALUES (?, ?, ?) 
         ON DUPLICATE KEY UPDATE TM_Role = VALUES(TM_Role)`,
        [teamId, studentId, role || 'Membro'],
        (err, result) => {
            if (err) return callback(err);
            callback(null, { message: "Membro adicionado/atualizado com sucesso!" });
        }
    );
};

// ✅ NOVA FUNÇÃO: Remover membro de uma equipa
exports.removeTeamMember = (teamId, studentId, callback) => {
    db.query(
        "DELETE FROM team_member WHERE TM_TE_ID = ? AND TM_S_ID = ?",
        [teamId, studentId],
        (err, result) => {
            if (err) return callback(err);
            if (result.affectedRows === 0) {
                return callback(new Error("Membro não encontrado"));
            }
            callback(null, { message: "Membro removido com sucesso!" });
        }
    );
};

// ✅ NOVA FUNÇÃO: Atualizar role de um membro
exports.updateTeamMemberRole = (teamId, studentId, role, callback) => {
    db.query(
        "UPDATE team_member SET TM_Role = ? WHERE TM_TE_ID = ? AND TM_S_ID = ?",
        [role, teamId, studentId],
        (err, result) => {
            if (err) return callback(err);
            if (result.affectedRows === 0) {
                return callback(new Error("Membro não encontrado"));
            }
            callback(null, { message: "Role atualizado com sucesso!" });
        }
    );
};

// ✅ NOVA FUNÇÃO: Buscar membros de uma equipa específica
exports.getTeamMembers = (teamId, callback) => {
    db.query(
        `SELECT s.S_ID as id, u.U_Name as name, tm.TM_Role as role
         FROM team_member tm
         JOIN student s ON s.S_ID = tm.TM_S_ID
         JOIN user u ON u.U_ID = s.S_U_ID
         WHERE tm.TM_TE_ID = ?`,
        [teamId],
        (err, members) => {
            if (err) return callback(err);
            callback(null, members);
        }
    );
};