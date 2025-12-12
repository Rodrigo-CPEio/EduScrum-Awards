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
    const sql = "DELETE FROM awards WHERE A_ID = ?";
    db.query(sql, [awardId], callback);
  }
};