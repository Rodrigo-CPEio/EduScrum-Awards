// backend/models/teamModel.js
const db = require("../config/db");

// =========================
//   CRIAR EQUIPA
// =========================
exports.createTeam = (projectId, teamName, totalTasks, members, callback) => {
    db.beginTransaction((err) => {
        if (err) return callback(err);

        // Inserir equipa
        db.query(
            "INSERT INTO team (TE_P_ID, TE_Name, TE_Total_Tasks) VALUES (?, ?, ?)",
            [projectId, teamName, totalTasks],
            (err, teamResult) => {
                if (err) {
                    return db.rollback(() => callback(err));
                }

                const teamId = teamResult.insertId;
                let insertedMembers = 0;

                // Inserir membros
                members.forEach((m, index) => {
                    db.query(
                        "INSERT INTO team_member (TM_TE_ID, TM_S_ID, TM_Role) VALUES (?, ?, ?)",
                        [teamId, m.studentId, m.role],
                        (err) => {
                            if (err) {
                                return db.rollback(() => callback(err));
                            }

                            insertedMembers++;

                            // Se todos os membros foram inseridos
                            if (insertedMembers === members.length) {
                                db.commit((err) => {
                                    if (err) {
                                        return db.rollback(() => callback(err));
                                    }
                                    callback(null, { message: "Equipa criada com sucesso!" });
                                });
                            }
                        }
                    );
                });
            }
        );
    });
};

// =========================
//   LISTAR EQUIPAS
// =========================
exports.getTeams = (callback) => {
    db.query("SELECT TE_ID, TE_Name, TE_Total_Tasks FROM team", (err, teams) => {
        if (err) return callback(err);

        if (teams.length === 0) {
            return callback(null, []);
        }

        const finalTeams = [];
        let processedTeams = 0;

        teams.forEach((t) => {
            db.query(
                `SELECT u.U_Name, tm.TM_Role 
                 FROM team_member tm
                 JOIN student s ON s.S_ID = tm.TM_S_ID
                 JOIN user u ON u.U_ID = s.S_U_ID
                 WHERE tm.TM_TE_ID = ?`,
                [t.TE_ID],
                (err, members) => {
                    if (err) return callback(err);

                    finalTeams.push({
                        TE_ID: t.TE_ID,
                        TE_Name: t.TE_Name,
                        totalTasks: t.TE_Total_Tasks,
                        members: members.map(m => ({
                            name: m.U_Name,
                            role: m.TM_Role
                        }))
                    });

                    processedTeams++;

                    // Se todas as equipas foram processadas
                    if (processedTeams === teams.length) {
                        callback(null, finalTeams);
                    }
                }
            );
        });
    });
};

// =========================
//   ELIMINAR EQUIPA
// =========================
exports.deleteTeam = (id, callback) => {
    db.query("DELETE FROM team_member WHERE TM_TE_ID = ?", [id], (err) => {
        if (err) return callback(err);

        db.query("DELETE FROM team WHERE TE_ID = ?", [id], (err) => {
            if (err) return callback(err);

            callback(null, { message: "Equipa eliminada com sucesso!" });
        });
    });
};