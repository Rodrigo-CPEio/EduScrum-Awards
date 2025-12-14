// backend/models/studentModel.js
const db = require("../config/db");

const StudentModel = {
  // -------------------------
  // CURSOS
  // -------------------------
  getCursos(callback) {
    db.query(
      `SELECT C_ID, C_T_ID, C_Name, C_Description, C_Created_At
       FROM course
       ORDER BY C_ID DESC`,
      callback
    );
  },

  // cadeiras (disciplinas) de um curso
  getCadeirasByCurso(courseId, callback) {
    db.query(
      `SELECT D_ID, D_Name, D_Description, D_Created_At, D_C_ID, D_T_ID
       FROM discipline
       WHERE D_C_ID = ?
       ORDER BY D_Name ASC`,
      [courseId],
      callback
    );
  },

  // -------------------------
  // JOIN CADEIRA (disciplina)
  // -------------------------
  joinCadeira(studentId, disciplinaId, callback) {
    db.query(
      `INSERT IGNORE INTO studentcourse (SC_S_ID, SC_D_ID)
       VALUES (?, ?)`,
      [studentId, disciplinaId],
      (err, result) => {
        if (err) return callback(err);
        // affectedRows 1 = insert novo, 0 = já existia
        callback(null, {
          message: result.affectedRows === 1
            ? "Matrícula feita na cadeira com sucesso!"
            : "Já estavas matriculado nesta cadeira."
        });
      }
    );
  },

  // join curso = matricular em TODAS as cadeiras do curso
  joinCursoAllCadeiras(studentId, courseId, callback) {
    // 1) buscar cadeiras do curso
    db.query(
      `SELECT D_ID
       FROM discipline
       WHERE D_C_ID = ?`,
      [courseId],
      (err, rows) => {
        if (err) return callback(err);

        if (!rows || rows.length === 0) {
          return callback(null, { message: "Este curso não tem cadeiras.", added: 0 });
        }

        // 2) inserir todas com IGNORE
        const values = rows.map(r => [studentId, r.D_ID]);
        db.query(
          `INSERT IGNORE INTO studentcourse (SC_S_ID, SC_D_ID)
           VALUES ?`,
          [values],
          (err2, result) => {
            if (err2) return callback(err2);
            callback(null, {
              message: "Matrícula no curso feita (cadeiras adicionadas).",
              added: result.affectedRows
            });
          }
        );
      }
    );
  },

  // -------------------------
  // MINHAS CADEIRAS
  // -------------------------
  getMyCadeiras(studentId, callback) {
    db.query(
      `SELECT d.D_ID, d.D_Name, d.D_Description, d.D_C_ID
       FROM studentcourse sc
       JOIN discipline d ON d.D_ID = sc.SC_D_ID
       WHERE sc.SC_S_ID = ?
       ORDER BY d.D_Name ASC`,
      [studentId],
      callback
    );
  },

  // -------------------------
  // PROJETOS POR CADEIRA
  // -------------------------
  getProjetosByCadeira(disciplinaId, callback) {
    db.query(
      `SELECT P_ID, P_Name, P_Description, P_D_ID, P_Mode
       FROM project
       WHERE P_D_ID = ?
       ORDER BY P_ID DESC`,
      [disciplinaId],
      callback
    );
  }
};

module.exports = StudentModel;
