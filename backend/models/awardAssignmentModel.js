// backend/models/awardAssignmentModel.js
const db = require('../config/db');

module.exports = {
  // Obter todos os estudantes
  getAllStudents(callback) {
    const sql = `
      SELECT s.S_ID, u.U_Name, u.U_Email
      FROM student s
      JOIN user u ON s.S_U_ID = u.U_ID
      ORDER BY u.U_Name
    `;
    db.query(sql, callback);
  },

  // Obter todas as equipas
  getAllTeams(callback) {
    const sql = `
      SELECT te.TE_ID, te.TE_Name, COUNT(tm.TM_S_ID) AS MemberCount
      FROM team te
      LEFT JOIN team_member tm ON te.TE_ID = tm.TM_TE_ID
      GROUP BY te.TE_ID
      ORDER BY te.TE_Name
    `;
    db.query(sql, callback);
  },

  // Obter atribuições de um prémio específico
  getAssignmentsByAward(awardId, callback) {
    const sql = `
      SELECT 
        aa.*,
        a.A_Name,
        u.U_Name AS AssignedBy,
        s.S_ID,
        us.U_Name AS StudentName,
        t.TE_ID,
        t.TE_Name
      FROM awardassigment aa
      LEFT JOIN awards a ON aa.AA_A_ID = a.A_ID
      LEFT JOIN teacher te ON aa.AA_T_ID = te.T_ID
      LEFT JOIN user u ON te.T_U_ID = u.U_ID
      LEFT JOIN student s ON aa.AA_S_ID = s.S_ID
      LEFT JOIN user us ON s.S_U_ID = us.U_ID
      LEFT JOIN team t ON aa.AA_TE_ID = t.TE_ID
      WHERE aa.AA_A_ID = ?
      ORDER BY aa.AA_Date DESC
    `;
    db.query(sql, [awardId], callback);
  },

  // Atribuir prémio a um estudante
  assignToStudent(data, callback) {
    const sql = `
      INSERT INTO awardassigment 
      (AA_A_ID, AA_T_ID, AA_S_ID, AA_Date, AA_Reason)
      VALUES (?, ?, ?, NOW(), ?)
    `;
    db.query(sql, [
      data.awardId,
      data.teacherId,
      data.studentId,
      data.reason
    ], callback);
  },

  // Atribuir prémio a uma equipa
  assignToTeam(data, callback) {
    const sql = `
      INSERT INTO awardassigment 
      (AA_A_ID, AA_T_ID, AA_TE_ID, AA_Date, AA_Reason)
      VALUES (?, ?, ?, NOW(), ?)
    `;
    db.query(sql, [
      data.awardId,
      data.teacherId,
      data.teamId,
      data.reason
    ], callback);
  },

  // Obter todas as atribuições
  getAssignments(callback) {
    const sql = `
      SELECT 
        aa.*,
        a.A_Name, 
        a.A_Points,
        u.U_Name AS TeacherName,
        us.U_Name AS StudentName,
        t.TE_Name
      FROM awardassigment aa
      LEFT JOIN awards a ON aa.AA_A_ID = a.A_ID
      LEFT JOIN teacher te ON aa.AA_T_ID = te.T_ID
      LEFT JOIN user u ON te.T_U_ID = u.U_ID
      LEFT JOIN student s ON aa.AA_S_ID = s.S_ID
      LEFT JOIN user us ON s.S_U_ID = us.U_ID
      LEFT JOIN team t ON aa.AA_TE_ID = t.TE_ID
      ORDER BY aa.AA_Date DESC
    `;
    db.query(sql, callback);
  },

  // Eliminar atribuição
  deleteAssignment(assignmentId, callback) {
    const sql = 'DELETE FROM awardassigment WHERE AA_ID = ?';
    db.query(sql, [assignmentId], callback);
  }
};