const db = require("../config/db");

module.exports = {
  getMyDashboard(req, res) {
    const studentId = Number(req.query.studentId);
    if (!studentId) return res.status(400).json({ message: "studentId é obrigatório" });

    // ✅ 1) RESUMO (igual ao que testaste no phpMyAdmin)
    const sqlSummary = `
      SELECT
        s.S_ID AS studentId,
        u.U_Name AS name,
        u.U_Email AS email,
        s.S_Year AS year,
        s.S_Class AS className,

        IFNULL(SUM(DISTINCT aw.A_Points), 0) AS totalPoints,
        COUNT(DISTINCT aa.AA_ID) AS awardsWon,
        COUNT(DISTINCT tm.TM_TE_ID) AS activeTeams,
        COUNT(DISTINCT p.P_ID) AS activeProjects,
        GROUP_CONCAT(DISTINCT d.D_Name SEPARATOR ', ') AS disciplines,

        -- tarefas concluídas (como na tua query)
        COUNT(DISTINCT ta.T_ID) AS tasksCompleted
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
    `;

    // ✅ 2) TOTAL DE TAREFAS (para % progresso)
    const sqlTasksTotal = `
      SELECT COUNT(DISTINCT t.T_ID) AS tasksTotal
      FROM task t
      JOIN team_member tm ON tm.TM_TE_ID = t.T_TE_ID
      WHERE tm.TM_S_ID = ?
    `;

    // ✅ 3) RANK (MariaDB 10.4 tem window functions)
    // calcula pontos por estudante com a mesma lógica (SUM DISTINCT awards points)
    const sqlRank = `
      SELECT r.studentId, r.totalPoints, r.rankPos
      FROM (
        SELECT
          s.S_ID AS studentId,
          IFNULL(SUM(DISTINCT aw.A_Points), 0) AS totalPoints,
          DENSE_RANK() OVER (ORDER BY IFNULL(SUM(DISTINCT aw.A_Points), 0) DESC) AS rankPos
        FROM student s
        LEFT JOIN awardassigment aa ON aa.AA_S_ID = s.S_ID
        LEFT JOIN awards aw ON aa.AA_A_ID = aw.A_ID
        GROUP BY s.S_ID
      ) r
      WHERE r.studentId = ?
    `;

    // ✅ 4) TOP 3 ranking (para listar no dashboard)
    const sqlTop3 = `
      SELECT
        s.S_ID AS studentId,
        u.U_Name AS name,
        IFNULL(SUM(DISTINCT aw.A_Points), 0) AS totalPoints
      FROM student s
      JOIN user u ON s.S_U_ID = u.U_ID
      LEFT JOIN awardassigment aa ON aa.AA_S_ID = s.S_ID
      LEFT JOIN awards aw ON aa.AA_A_ID = aw.A_ID
      GROUP BY s.S_ID, u.U_Name
      ORDER BY totalPoints DESC
      LIMIT 3
    `;

    // ✅ 5) Últimos prémios do estudante (recentes)
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

            db.query(sqlRecentAwards, [studentId], (err5, recentAwards) => {
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
