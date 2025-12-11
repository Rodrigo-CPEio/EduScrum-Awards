const db = require("../config/db");

// =========================
//   CRIAR EQUIPA
// =========================
exports.createTeam = async (projectId, teamName, totalTasks, members) => {
    const conn = await db.getConnection();
    try {
        await conn.beginTransaction();

        // Criar equipa
        const [teamResult] = await conn.query(
            "INSERT INTO team (TE_P_ID, TE_Name, TE_Total_Tasks) VALUES (?, ?, ?)",
            [projectId, teamName, totalTasks]
        );

        const teamId = teamResult.insertId;

        // Inserir membros
        for (const m of members) {
            await conn.query(
                "INSERT INTO team_member (TM_TE_ID, TM_S_ID, TM_Role) VALUES (?, ?, ?)",
                [teamId, m.studentId, m.role]
            );
        }

        await conn.commit();
        return { message: "Equipa criada com sucesso!" };

    } catch (err) {
        await conn.rollback();
        throw err;
    } finally {
        conn.release();
    }
};


// =========================
//   LISTAR EQUIPAS
// =========================
exports.getTeams = async () => {
    const [teams] = await db.query(
        "SELECT TE_ID, TE_Name, TE_Total_Tasks FROM team"
    );

    const finalTeams = [];

    for (const t of teams) {
        const [members] = await db.query(
            `SELECT u.U_Name, tm.TM_Role 
             FROM team_member tm
             JOIN student s ON s.S_ID = tm.TM_S_ID
             JOIN user u ON u.U_ID = s.S_U_ID
             WHERE tm.TM_TE_ID = ?`,
            [t.TE_ID]
        );

        finalTeams.push({
            TE_ID: t.TE_ID,
            TE_Name: t.TE_Name,
            totalTasks: t.TE_Total_Tasks,
            members: members.map(m => ({
                name: m.U_Name,
                role: m.TM_Role
            }))
        });
    }

    return finalTeams;
};


// =========================
//   ELIMINAR EQUIPA
// =========================
exports.deleteTeam = async (id) => {
    await db.query("DELETE FROM team_member WHERE TM_TE_ID = ?", [id]);
    await db.query("DELETE FROM team WHERE TE_ID = ?", [id]);

    return { message: "Equipa eliminada com sucesso!" };
};
