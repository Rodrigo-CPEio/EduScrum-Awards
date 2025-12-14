const db = require("../config/db");

// ✅ Criar equipa (com tipo + capacity + membros + tarefas)
exports.createTeam = (projectId, teamName, teamType = "Aberta", capacity = 4, members = [], tasks = [], callback) => {
  const type = String(teamType || "Aberta").trim(); // Aberta / Manual
  const cap = Number(capacity) || 4;

  db.query(
    "INSERT INTO team (TE_P_ID, TE_Name, TE_Capacity, TE_Type) VALUES (?, ?, ?, ?)",
    [projectId, teamName, cap, type],
    (err, result) => {
      if (err) return callback(err);

      const teamId = result.insertId;

      members = Array.isArray(members) ? members : [];
      tasks = Array.isArray(tasks) ? tasks : [];

      let membersDone = 0;
      let tasksDone = 0;

      if (members.length === 0 && tasks.length === 0) {
        return callback(null, { message: "Equipa criada com sucesso!", teamId });
      }

      // Inserir membros
      if (members.length > 0) {
        members.forEach(m => {
          db.query(
            `INSERT INTO team_member (TM_TE_ID, TM_S_ID, TM_Role)
             VALUES (?, ?, ?)
             ON DUPLICATE KEY UPDATE TM_Role = VALUES(TM_Role)`,
            [teamId, m.studentId, m.role || "Membro"],
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

      // Inserir tarefas
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

// ✅ Buscar equipas + membros + tarefas (+ type/capacity)
exports.getTeams = (callback) => {
  db.query("SELECT * FROM team ORDER BY TE_ID DESC", (err, teams) => {
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
                type: team.TE_Type,
                capacity: team.TE_Capacity,
                points: 0,
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
  db.query("SELECT * FROM task WHERE T_TE_ID = ?", [teamId], callback);
};

// Adicionar membro
exports.addTeamMember = (teamId, studentId, role, callback) => {
  db.query(
    `INSERT INTO team_member (TM_TE_ID, TM_S_ID, TM_Role)
     VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE TM_Role = VALUES(TM_Role)`,
    [teamId, studentId, role || "Membro"],
    (err) => {
      if (err) return callback(err);
      callback(null, { message: "Membro adicionado/atualizado com sucesso!" });
    }
  );
};

// Remover membro
exports.removeTeamMember = (teamId, studentId, callback) => {
  db.query(
    "DELETE FROM team_member WHERE TM_TE_ID = ? AND TM_S_ID = ?",
    [teamId, studentId],
    (err, result) => {
      if (err) return callback(err);
      if (result.affectedRows === 0) return callback(new Error("Membro não encontrado"));
      callback(null, { message: "Membro removido com sucesso!" });
    }
  );
};

// Atualizar role
exports.updateTeamMemberRole = (teamId, studentId, role, callback) => {
  db.query(
    "UPDATE team_member SET TM_Role = ? WHERE TM_TE_ID = ? AND TM_S_ID = ?",
    [role, teamId, studentId],
    (err, result) => {
      if (err) return callback(err);
      if (result.affectedRows === 0) return callback(new Error("Membro não encontrado"));
      callback(null, { message: "Role atualizado com sucesso!" });
    }
  );
};

// Buscar membros de uma equipa
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

// ✅ Entrar numa equipa aberta
exports.joinOpenTeam = (teamId, studentId, role, callback) => {
  db.query(
    "SELECT TE_ID, TE_Type, TE_Capacity FROM team WHERE TE_ID = ?",
    [teamId],
    (err, rows) => {
      if (err) return callback(err);
      if (!rows || rows.length === 0) return callback(new Error("Equipa não existe"));

      const team = rows[0];
      const type = String(team.TE_Type || "").trim();

      if (type !== "Aberta") {
        return callback(new Error("Esta equipa não é aberta"));
      }

      db.query(
        "SELECT 1 FROM team_member WHERE TM_TE_ID = ? AND TM_S_ID = ? LIMIT 1",
        [teamId, studentId],
        (err, exists) => {
          if (err) return callback(err);
          if (exists.length > 0) return callback(new Error("Já fazes parte desta equipa"));

          db.query(
            "SELECT COUNT(*) AS total FROM team_member WHERE TM_TE_ID = ?",
            [teamId],
            (err, countRows) => {
              if (err) return callback(err);

              const total = countRows[0].total;
              const cap = Number(team.TE_Capacity) || 4;

              if (total >= cap) return callback(new Error("Equipa cheia"));

              db.query(
                "INSERT INTO team_member (TM_TE_ID, TM_S_ID, TM_Role) VALUES (?, ?, ?)",
                [teamId, studentId, role || "Membro"],
                (err) => {
                  if (err) return callback(err);
                  callback(null, { message: "Entraste na equipa com sucesso!" });
                }
              );
            }
          );
        }
      );
    }
  );
};
