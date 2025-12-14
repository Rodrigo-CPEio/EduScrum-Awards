const db = require("../config/db");

module.exports = {
  getMyDashboard(req, res) {
    const studentId = Number(req.query.studentId);
    if (!studentId) return res.status(400).json({ message: "studentId é obrigatório" });

    // ✅ 1) RESUMO (INDIVIDUAL + GRUPO, sem DISTINCT em pontos)
    // Nota: pontos são calculados via subquery para não dar duplicação com joins (disciplinas, tasks, etc.)
    const sqlSummary = `
      SELECT
        s.S_ID AS studentId,
        u.U_Name AS name,
        u.U_Email AS email,
        s.S_Year AS year,
        s.S_Class AS className,

        (
          SELECT COALESCE(SUM(a2.A_Points), 0)
          FROM awardassigment aa2
          JOIN awards a2 ON a2.A_ID = aa2.AA_A_ID
          WHERE aa2.AA_S_ID = s.S_ID
             OR aa2.AA_T_ID IN (
                SELECT tm2.TM_TE_ID
                FROM team_member tm2
                WHERE tm2.TM_S_ID = s.S_ID
             )
        ) AS totalPoints,

        (
          SELECT COUNT(*)
          FROM awardassigment aa3
          WHERE aa3.AA_S_ID = s.S_ID
             OR aa3.AA_T_ID IN (
                SELECT tm3.TM_TE_ID
                FROM team_member tm3
                WHERE tm3.TM_S_ID = s.S_ID
             )
        ) AS awardsWon,

        COUNT(DISTINCT tm.TM_TE_ID) AS activeTeams,
        COUNT(DISTINCT p.P_ID) AS activeProjects,
        GROUP_CONCAT(DISTINCT d.D_Name SEPARATOR ', ') AS disciplines,

        COUNT(DISTINCT ta.T_ID) AS tasksCompleted
      FROM student s
      JOIN user u ON s.S_U_ID = u.U_ID

      LEFT JOIN team_member tm ON tm.TM_S_ID = s.S_ID
      LEFT JOIN team te ON tm.TM_TE_ID = te.TE_ID
      LEFT JOIN project p ON te.TE_P_ID = p.P_ID

      LEFT JOIN studentcourse sc ON sc.SC_S_ID = s.S_ID
      LEFT JOIN discipline d ON sc.SC_D_ID = d.D_ID

      LEFT JOIN task ta ON ta.T_TE_ID = te.TE_ID AND ta.T_Completed = 1

      WHERE s.S_ID = ?
      GROUP BY s.S_ID, u.U_Name, u.U_Email, s.S_Year, s.S_Class
    `;

    // ✅ 2) TOTAL DE TAREFAS
    const sqlTasksTotal = `
      SELECT COUNT(DISTINCT t.T_ID) AS tasksTotal
      FROM task t
      JOIN team_member tm ON tm.TM_TE_ID = t.T_TE_ID
      WHERE tm.TM_S_ID = ?
    `;

    // ✅ 3) RANK (mesma lógica de pontos: individual + grupo)
    const sqlRank = `
      SELECT r.studentId, r.totalPoints, r.rankPos
      FROM (
        SELECT
          s.S_ID AS studentId,
          (
            SELECT COALESCE(SUM(a2.A_Points), 0)
            FROM awardassigment aa2
            JOIN awards a2 ON a2.A_ID = aa2.AA_A_ID
            WHERE aa2.AA_S_ID = s.S_ID
               OR aa2.AA_T_ID IN (
                  SELECT tm2.TM_TE_ID
                  FROM team_member tm2
                  WHERE tm2.TM_S_ID = s.S_ID
               )
          ) AS totalPoints,
          DENSE_RANK() OVER (
            ORDER BY (
              SELECT COALESCE(SUM(a3.A_Points), 0)
              FROM awardassigment aa3
              JOIN awards a3 ON a3.A_ID = aa3.AA_A_ID
              WHERE aa3.AA_S_ID = s.S_ID
                 OR aa3.AA_T_ID IN (
                    SELECT tm3.TM_TE_ID
                    FROM team_member tm3
                    WHERE tm3.TM_S_ID = s.S_ID
                 )
            ) DESC
          ) AS rankPos
        FROM student s
      ) r
      WHERE r.studentId = ?
    `;

    // ✅ 4) TOP 3 (mesma lógica)
    const sqlTop3 = `
      SELECT
        s.S_ID AS studentId,
        u.U_Name AS name,
        (
          SELECT COALESCE(SUM(a2.A_Points), 0)
          FROM awardassigment aa2
          JOIN awards a2 ON a2.A_ID = aa2.AA_A_ID
          WHERE aa2.AA_S_ID = s.S_ID
             OR aa2.AA_T_ID IN (
                SELECT tm2.TM_TE_ID
                FROM team_member tm2
                WHERE tm2.TM_S_ID = s.S_ID
             )
        ) AS totalPoints
      FROM student s
      JOIN user u ON s.S_U_ID = u.U_ID
      ORDER BY totalPoints DESC
      LIMIT 3
    `;

    // ✅ 5) Últimos prémios (INDIVIDUAL + GRUPO)
    const sqlRecentAwards = `
      SELECT
        aa.AA_ID,
        a.A_Name,
        a.A_Points,
        aa.AA_Date,
        aa.AA_Reason
      FROM awardassigment aa
      JOIN awards a ON a.A_ID = aa.AA_A_ID
      WHERE aa.AA_S_ID = ?
         OR aa.AA_T_ID IN (
            SELECT tm.TM_TE_ID
            FROM team_member tm
            WHERE tm.TM_S_ID = ?
         )
      ORDER BY aa.AA_Date DESC, aa.AA_ID DESC
      LIMIT 5
    `;

    db.query(sqlSummary, [studentId], (err, rows) => {
      if (err) return res.status(500).json({ message: "Erro SQL summary", error: err });
      if (!rows?.length) return res.status(404).json({ message: "Estudante não encontrado" });

      const summary = rows[0];

      db.query(sqlTasksTotal, [studentId], (err2, rows2) => {
        if (err2) return res.status(500).json({ message: "Erro SQL tasksTotal", error: err2 });

        const tasksTotal = Number(rows2?.[0]?.tasksTotal || 0);
        const tasksCompleted = Number(summary.tasksCompleted || 0);
        const courseProgressPct = tasksTotal > 0 ? Math.round((tasksCompleted / tasksTotal) * 100) : 0;

        db.query(sqlRank, [studentId], (err3, rows3) => {
          if (err3) return res.status(500).json({ message: "Erro SQL rank", error: err3 });

          const rankPos = rows3?.[0]?.rankPos ? `#${rows3[0].rankPos}` : "—";

          db.query(sqlTop3, (err4, top3) => {
            if (err4) return res.status(500).json({ message: "Erro SQL top3", error: err4 });

            db.query(sqlRecentAwards, [studentId, studentId], (err5, recentAwards) => {
              if (err5) return res.status(500).json({ message: "Erro SQL recentAwards", error: err5 });

              return res.json({
                studentId: summary.studentId,
                name: summary.name,
                email: summary.email,
                year: summary.year,
                className: summary.className,

                totalPoints: Number(summary.totalPoints || 0),
                awardsWon: Number(summary.awardsWon || 0),
                activeTeams: Number(summary.activeTeams || 0),
                activeProjects: Number(summary.activeProjects || 0),
                disciplines: summary.disciplines || "",

                tasksCompleted,
                tasksTotal,
                courseProgressPct,

                rankPos,
                top3: top3 || [],
                recentAwards: recentAwards || []
              });
            });
          });
        });
      });
    });
  }
};
