// backend/models/cursoModel.js
const db = require('../config/db');

const Curso = {
  // Listar cursos de um professor
  listarPorProfessor: (teacherId, callback) => {
    const sql = `
      SELECT 
        d.D_ID as id,
        d.D_Name as nome,
        d.D_Description as descricao,
        d.D_T_ID as professorId,
        COUNT(DISTINCT sc.SC_S_ID) as totalEstudantes,
        DATE_FORMAT(d.D_Created_At, '%d/%m/%Y') as criadoEm
      FROM discipline d
      LEFT JOIN studentcourse sc ON d.D_ID = sc.SC_D_ID
      WHERE d.D_T_ID = ?
      GROUP BY d.D_ID
      ORDER BY d.D_Created_At DESC
    `;
    
    db.query(sql, [teacherId], (err, results) => {
      callback(err, results);
    });
  },

  // Criar novo curso
  criar: (nome, descricao, professorId, callback) => {
    const sql = 'INSERT INTO discipline (D_Name, D_Description, D_T_ID, D_Created_At) VALUES (?, ?, ?, NOW())';
    
    db.query(sql, [nome, descricao, professorId], (err, result) => {
      if (err) return callback(err);
      callback(null, { id: result.insertId, nome, descricao, professorId });
    });
  },

  // Verificar se professor existe
  verificarProfessor: (teacherId, callback) => {
    db.query('SELECT T_ID FROM teacher WHERE T_ID = ?', [teacherId], (err, results) => {
      callback(err, results.length > 0);
    });
  },

  // Verificar se curso existe com mesmo nome para o professor
  verificarNomeDuplicado: (nome, professorId, cursoId, callback) => {
    let sql = 'SELECT D_ID FROM discipline WHERE D_Name = ? AND D_T_ID = ?';
    let params = [nome, professorId];
    
    if (cursoId) {
      sql += ' AND D_ID != ?';
      params.push(cursoId);
    }
    
    db.query(sql, params, (err, results) => {
      callback(err, results.length > 0);
    });
  },

  // Obter curso por ID
  obterPorId: (cursoId, callback) => {
    const sql = `
      SELECT 
        d.D_ID as id,
        d.D_Name as nome,
        d.D_Description as descricao,
        d.D_T_ID as professorId,
        u.U_Name as professorNome,
        COUNT(DISTINCT sc.SC_S_ID) as totalEstudantes,
        DATE_FORMAT(d.D_Created_At, '%d/%m/%Y') as criadoEm
      FROM discipline d
      INNER JOIN teacher t ON d.D_T_ID = t.T_ID
      INNER JOIN user u ON t.T_U_ID = u.U_ID
      LEFT JOIN studentcourse sc ON d.D_ID = sc.SC_D_ID
      WHERE d.D_ID = ?
      GROUP BY d.D_ID
    `;
    
    db.query(sql, [cursoId], (err, results) => {
      callback(err, results[0]);
    });
  },

  // Verificar se curso pertence ao professor
  verificarPropriedade: (cursoId, professorId, callback) => {
    db.query('SELECT D_ID FROM discipline WHERE D_ID = ? AND D_T_ID = ?', 
      [cursoId, professorId], (err, results) => {
        callback(err, results.length > 0);
    });
  },

  // Atualizar curso
  atualizar: (cursoId, nome, descricao, callback) => {
    db.query('UPDATE discipline SET D_Name = ?, D_Description = ? WHERE D_ID = ?',
      [nome, descricao, cursoId], callback);
  },

  // Verificar se tem estudantes inscritos
  verificarEstudantes: (cursoId, callback) => {
    db.query('SELECT COUNT(*) as total FROM studentcourse WHERE SC_D_ID = ?', 
      [cursoId], (err, results) => {
        callback(err, results[0]?.total || 0);
    });
  },

  // Verificar se tem projetos associados
  verificarProjetos: (cursoId, callback) => {
    db.query('SELECT COUNT(*) as total FROM project WHERE P_D_ID = ?', 
      [cursoId], (err, results) => {
        callback(err, results[0]?.total || 0);
    });
  },

  // Apagar curso
  apagar: (cursoId, callback) => {
    db.query('DELETE FROM discipline WHERE D_ID = ?', [cursoId], callback);
  }
};

module.exports = Curso;