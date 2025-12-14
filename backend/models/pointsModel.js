// backend/models/pointsModel.js
const db = require("../config/db");

module.exports = {
  // =========================
  // Mis puntos (por studentId)
  // =========================
  getMyPoints(studentId, cb) {
    const sql = `
      SELECT COALESCE(SUM(a.A_Points), 0) AS points
      FROM awardassigment aa
      JOIN awards a ON a.A_ID = aa.AA_A_ID
      WHERE aa.AA_S_ID = ?
        AND a.A_Target = 'estudante'
    `;
    db.query(sql, [studentId], (err, rows) => {
      if (err) return cb(err);
      cb(null, rows?.[0]?.points ?? 0);
    });
  },

  // =========================
  // Ranking estudiantes (incluye 0 puntos)
  // =========================
  getStudentsRanking(cb) {
    const sql = `
      SELECT
        s.S_ID AS studentId,
        u.U_Name AS nome,
        s.S_Year AS ano,
        s.S_Class AS turma,
        COALESCE(SUM(a.A_Points), 0) AS pontos
      FROM student s
      JOIN user u ON u.U_ID = s.S_U_ID
      LEFT JOIN awardassigment aa ON aa.AA_S_ID = s.S_ID
      LEFT JOIN awards a
        ON a.A_ID = aa.AA_A_ID
       AND a.A_Target = 'estudante'
      GROUP BY s.S_ID, u.U_Name, s.S_Year, s.S_Class
      ORDER BY pontos DESC, nome ASC
    `;
    db.query(sql, (err, rows) => {
      if (err) return cb(err);
      cb(null, rows || []);
    });
  },

  // =========================
  // Ranking equipos
  // - base: team.TE_Points
  // - opcional: sumar premios de equipa (awardassigment.AA_TE_ID)
  // =========================
  getTeamsRanking(cb) {
    const sql = `
      SELECT
        t.TE_ID AS teamId,
        t.TE_Name AS teamName,
        COUNT(tm.TM_S_ID) AS members,
        (
          COALESCE(t.TE_Points, 0)
          + COALESCE(SUM(CASE WHEN a.A_Target='equipa' THEN a.A_Points ELSE 0 END), 0)
        ) AS pontos
      FROM team t
      LEFT JOIN team_member tm ON tm.TM_TE_ID = t.TE_ID
      LEFT JOIN awardassigment aa ON aa.AA_TE_ID = t.TE_ID
      LEFT JOIN awards a ON a.A_ID = aa.AA_A_ID
      GROUP BY t.TE_ID, t.TE_Name, t.TE_Points
      ORDER BY pontos DESC, teamName ASC
    `;
    db.query(sql, (err, rows) => {
      if (err) return cb(err);
      cb(null, rows || []);
    });
  }
};
