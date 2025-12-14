const db = require("../config/db");

function query(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, rows) => (err ? reject(err) : resolve(rows)));
  });
}

module.exports = {
  async getStudentDashboard(studentId) {

    // 1) PERFIL (a tua query, só corrigi com GROUP BY)
    const perfilSql = `
      SELECT
        s.S_ID AS Estudiante_ID,
        u.U_Name AS Nombre_Estudiante,
        u.U_Email AS Email_Estudiante,
        s.S_Year AS Ano_Estudiante,
        s.S_Class AS Clase_Estudiante,

        IFNULL(SUM(DISTINCT aw.A_Points), 0) AS Puntos_Totales,
        COUNT(DISTINCT aa.AA_ID) AS Premios_Conquistados,
        COUNT(DISTINCT tm.TM_TE_ID) AS Equipos_Activos,
        COUNT(DISTINCT p.P_ID) AS Proyectos_Activos,
        GROUP_CONCAT(DISTINCT d.D_Name ORDER BY d.D_Name SEPARATOR ', ') AS Disciplinas_Inscritas,
        COUNT(DISTINCT ta.T_ID) AS Tareas_Completadas

      FROM student s
      JOIN user u ON s.S_U_ID = u.U_ID

      LEFT JOIN awardassigment aa ON aa.AA_S_ID = s.S_ID
      LEFT JOIN awards aw ON aa.AA_A_ID = aw.A_ID

      LEFT JOIN team_member tm ON tm.TM_S_ID = s.S_ID
      LEFT JOIN team te ON tm.TM_TE_ID = te.TE_ID
      LEFT JOIN project p ON te.TE_P_ID = p.P_ID

      LEFT JOIN studentcourse sc ON sc.SC_S_ID = s.S_ID
      LEFT JOIN discipline d ON sc.SC_D_ID = d.D_ID

      LEFT JOIN task ta ON ta.T_TE_ID = te.TE_ID AND ta.T_Completed = 1

      WHERE s.S_ID = ?
      GROUP BY s.S_ID, u.U_Name, u.U_Email, s.S_Year, s.S_Class
      LIMIT 1
    `;
    const perfilRows = await query(perfilSql, [studentId]);
    const perfil = perfilRows[0] || null;
    if (!perfil) return { message: "Estudante não encontrado" };

    // 2) TOP 3 ranking (por pontos totais usando a mesma lógica)
    const top3Sql = `
      SELECT
        s.S_ID AS studentId,
        u.U_Name AS name,
        IFNULL(SUM(DISTINCT aw.A_Points), 0) AS points
      FROM student s
      JOIN user u ON s.S_U_ID = u.U_ID
      LEFT JOIN awardassigment aa ON aa.AA_S_ID = s.S_ID
      LEFT JOIN awards aw ON aa.AA_A_ID = aw.A_ID
      GROUP BY s.S_ID, u.U_Name
      ORDER BY points DESC
      LIMIT 3
    `;
    const top3 = await query(top3Sql);

    // 3) Ranking posição do estudante (mesma métrica)
    const rankSql = `
      SELECT x.studentId, x.points,
             (SELECT COUNT(*) + 1
              FROM (
                SELECT s2.S_ID AS studentId,
                       IFNULL(SUM(DISTINCT aw2.A_Points), 0) AS points
                FROM student s2
                LEFT JOIN awardassigment aa2 ON aa2.AA_S_ID = s2.S_ID
                LEFT JOIN awards aw2 ON aa2.AA_A_ID = aw2.A_ID
                GROUP BY s2.S_ID
              ) r
              WHERE r.points > x.points
             ) AS rankPos
      FROM (
        SELECT s.S_ID AS studentId,
               IFNULL(SUM(DISTINCT aw.A_Points), 0) AS points
        FROM student s
        LEFT JOIN awardassigment aa ON aa.AA_S_ID = s.S_ID
        LEFT JOIN awards aw ON aa.AA_A_ID = aw.A_ID
        WHERE s.S_ID = ?
        GROUP BY s.S_ID
      ) x
    `;
    const rankRow = (await query(rankSql, [studentId]))[0] || { rankPos: null };

    // 4) Últimos prémios (individual)
    const lastAwardsSql = `
      SELECT
        aa.AA_ID,
        a.A_ID,
        a.A_Name,
        a.A_Points,
        aa.AA_Date,
        aa.AA_Reason
      FROM awardassigment aa
      JOIN awards a ON a.A_ID = aa.AA_A_ID
      WHERE aa.AA_S_ID = ?
      ORDER BY aa.AA_Date DESC, aa.AA_ID DESC
      LIMIT 6
    `;
    const lastAwards = await query(lastAwardsSql, [studentId]);

    // 5) Minhas equipas (nome + role + projeto)
    const teamsSql = `
      SELECT
        te.TE_ID,
        te.TE_Name,
        tm.TM_Role,
        p.P_ID,
        p.P_Name
      FROM team_member tm
      JOIN team te ON te.TE_ID = tm.TM_TE_ID
      LEFT JOIN project p ON p.P_ID = te.TE_P_ID
      WHERE tm.TM_S_ID = ?
      ORDER BY te.TE_ID DESC
      LIMIT 12
    `;
    const myTeams = await query(teamsSql, [studentId]);

    // 6) Projetos (dos teus teams)
    const projectsSql = `
      SELECT DISTINCT
        p.P_ID,
        p.P_Name,
        p.P_Status,
        p.P_Start_Date,
        p.P_End_Date
      FROM team_member tm
      JOIN team te ON te.TE_ID = tm.TM_TE_ID
      JOIN project p ON p.P_ID = te.TE_P_ID
      WHERE tm.TM_S_ID = ?
      ORDER BY p.P_ID DESC
      LIMIT 10
    `;
    const myProjects = await query(projectsSql, [studentId]);

    // 7) Disciplinas inscritas (com curso se quiseres)
    const disciplinesSql = `
      SELECT
        d.D_ID,
        d.D_Name,
        c.C_Name
      FROM studentcourse sc
      JOIN discipline d ON d.D_ID = sc.SC_D_ID
      LEFT JOIN course c ON c.C_ID = d.D_C_ID
      WHERE sc.SC_S_ID = ?
      ORDER BY d.D_Name
    `;
    const myDisciplines = await query(disciplinesSql, [studentId]);

    // 8) Progresso (tarefas completas vs total nas equipas)
    const taskProgressSql = `
      SELECT
        SUM(CASE WHEN t.T_Completed = 1 THEN 1 ELSE 0 END) AS done,
        COUNT(*) AS total
      FROM team_member tm
      JOIN task t ON t.T_TE_ID = tm.TM_TE_ID
      WHERE tm.TM_S_ID = ?
    `;
    const pr = (await query(taskProgressSql, [studentId]))[0] || { done: 0, total: 0 };

    return {
      perfil,
      rank: { rankPos: rankRow.rankPos, points: perfil.Puntos_Totales },
      top3,
      lastAwards,
      myTeams,
      myProjects,
      myDisciplines,
      progress: {
        tasksDone: Number(pr.done || 0),
        tasksTotal: Number(pr.total || 0)
      }
    };
  }
};
