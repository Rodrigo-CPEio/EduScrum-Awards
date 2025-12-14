// backend/models/studentAwardsModel.js
const db = require("../config/db");

module.exports = {
  getMyIndividualAwards(studentId, cb) {
    const sql = `
      SELECT
        aa.AA_ID,
        aa.AA_Date,
        a.A_ID,
        a.A_Name,
        a.A_Description,
        a.A_Points
      FROM awardassigment aa
      JOIN awards a ON a.A_ID = aa.AA_A_ID
      WHERE aa.AA_S_ID = ?
      ORDER BY aa.AA_ID DESC
    `;
    db.query(sql, [studentId], cb);
  },

  getMyTeamAwards(studentId, cb) {
    const sql = `
      SELECT
        aa.AA_ID,
        aa.AA_Date,
        a.A_ID,
        a.A_Name,
        a.A_Description,
        a.A_Points,
        t.TE_ID,
        t.TE_Name
      FROM awardassigment aa
      JOIN awards a ON a.A_ID = aa.AA_A_ID
      JOIN team t ON t.TE_ID = aa.AA_TE_ID
      JOIN team_member tm ON tm.TM_TE_ID = t.TE_ID
      WHERE tm.TM_S_ID = ?
      ORDER BY aa.AA_ID DESC
    `;
    db.query(sql, [studentId], cb);
  },
};
