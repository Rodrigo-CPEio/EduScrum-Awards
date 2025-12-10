const db = require('../config/db');

const Course = {
  listarPorProfessor: (teacherId, callback) => {
    const sql = `
      SELECT 
        c.C_ID AS id,
        c.C_Name AS nome,
        c.C_Description AS descricao,
        c.C_T_ID AS professorId,
        DATE_FORMAT(c.C_Created_At, '%d/%m/%Y') AS criadoEm,
        (SELECT COUNT(DISTINCT sc.SC_S_ID)
           FROM discipline d
           LEFT JOIN studentcourse sc ON d.D_ID = sc.SC_D_ID
           WHERE d.D_C_ID = c.C_ID) AS totalEstudantes
      FROM course c
      WHERE c.C_T_ID = ?
      ORDER BY c.C_Created_At DESC
    `;
    db.query(sql, [teacherId], callback);
  },

  verificarProfessor: (teacherId, callback) => {
    db.query('SELECT T_ID FROM teacher WHERE T_ID = ?', [teacherId], (err, results) => {
      callback(err, results.length > 0);
    });
  },

  verificarNomeDuplicado: (nome, professorId, courseId, callback) => {
    let sql = 'SELECT C_ID FROM course WHERE C_Name = ? AND C_T_ID = ?';
    const params = [nome, professorId];
    if (courseId) {
      sql += ' AND C_ID != ?';
      params.push(courseId);
    }
    db.query(sql, params, (err, results) => callback(err, results.length > 0));
  },

  criar: (nome, descricao, professorId, callback) => {
    const sql = 'INSERT INTO course (C_Name, C_Description, C_T_ID, C_Created_At) VALUES (?, ?, ?, NOW())';
    db.query(sql, [nome, descricao, professorId], (err, result) => {
      if (err) return callback(err);
      callback(null, { id: result.insertId, nome, descricao, professorId });
    });
  },

  obterPorId: (courseId, callback) => {
    const sql = `
      SELECT 
        c.C_ID AS id,
        c.C_Name AS nome,
        c.C_Description AS descricao,
        c.C_T_ID AS professorId,
        u.U_Name AS professorNome,
        DATE_FORMAT(c.C_Created_At, '%d/%m/%Y') AS criadoEm
      FROM course c
      INNER JOIN teacher t ON c.C_T_ID = t.T_ID
      INNER JOIN user u ON t.T_U_ID = u.U_ID
      WHERE c.C_ID = ?
    `;
    db.query(sql, [courseId], (err, results) => callback(err, results[0]));
  },

  verificarPropriedade: (courseId, professorId, callback) => {
    db.query('SELECT C_ID FROM course WHERE C_ID = ? AND C_T_ID = ?', [courseId, professorId], (err, results) => {
      callback(err, results.length > 0);
    });
  },

  atualizar: (courseId, nome, descricao, callback) => {
    db.query('UPDATE course SET C_Name = ?, C_Description = ? WHERE C_ID = ?', [nome, descricao, courseId], callback);
  },

  apagar: (courseId, callback) => {
    // Opcional: verificar e remover ligação das cadeiras (d.D_C_ID) ou impedir remoção se existam cadeiras
    // Aqui vamos impedir apagar se houver cadeiras associadas:
    db.query('SELECT COUNT(*) AS total FROM discipline WHERE D_C_ID = ?', [courseId], (err, results) => {
      if (err) return callback(err);
      if (results[0]?.total > 0) return callback(new Error('HAS_CADEIRAS'));
      db.query('DELETE FROM course WHERE C_ID = ?', [courseId], callback);
    });
  }
};

module.exports = Course;
