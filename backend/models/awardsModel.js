// backend/models/awardsModel.js
const db = require('../config/db');

module.exports = {
  getAllAwards(callback) {
    db.query("SELECT * FROM awards", callback);
  },

  getAwardsByTarget(target, callback) {
    const sql = "SELECT * FROM awards WHERE A_Target = ?";
    db.query(sql, [target], callback);
  },

  createAward(data, callback) {
    const sql = `
      INSERT INTO awards (A_Name, A_Description, A_Points, A_Type, A_Trigger_Condition, A_T_ID, A_Target)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    db.query(sql, [
      data.A_Name,
      data.A_Description,
      data.A_Points,
      data.A_Type,
      data.A_Trigger_Condition,
      data.A_T_ID,
      data.A_Target || 'estudante'
    ], callback);
  },

  deleteAward(awardId, callback) {
    // Primeiro apagar todas as atribuições deste prémio
    const deletAssignmentsSql = "DELETE FROM awardassigment WHERE AA_A_ID = ?";
    db.query(deletAssignmentsSql, [awardId], (err) => {
      if (err) return callback(err);
      
      // Depois apagar o prémio
      const deleteAwardSql = "DELETE FROM awards WHERE A_ID = ?";
      db.query(deleteAwardSql, [awardId], callback);
    });
  }
};