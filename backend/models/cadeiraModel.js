const db = require('../config/db');

const Cadeira = {
  // Listar cadeiras de um curso
  listarPorCurso: (cursoId, callback) => {
    const sql = `
      SELECT 
        d.D_ID as id,
        d.D_Name as nome,
        d.D_Description as descricao,
        d.D_T_ID as professorId,
        d.D_C_ID as cursoId,
        COUNT(DISTINCT sc.SC_S_ID) as totalEstudantes,
        COUNT(DISTINCT p.P_ID) as totalProjetos,
        DATE_FORMAT(d.D_Created_At, '%d/%m/%Y') as criadoEm
      FROM discipline d
      LEFT JOIN studentcourse sc ON d.D_ID = sc.SC_D_ID
      LEFT JOIN project p ON d.D_ID = p.P_D_ID
      WHERE d.D_C_ID = ?
      GROUP BY d.D_ID
      ORDER BY d.D_Created_At DESC
    `;
    db.query(sql, [cursoId], (err, results) => callback(err, results));
  },

  // Listar todas as cadeiras de um professor
  listarPorProfessor: (teacherId, callback) => {
    const sql = `
      SELECT 
        d.D_ID as id,
        d.D_Name as nome,
        d.D_Description as descricao,
        d.D_T_ID as professorId,
        d.D_C_ID as cursoId,
        COUNT(DISTINCT sc.SC_S_ID) as totalEstudantes,
        COUNT(DISTINCT p.P_ID) as totalProjetos,
        DATE_FORMAT(d.D_Created_At, '%d/%m/%Y') as criadoEm
      FROM discipline d
      LEFT JOIN studentcourse sc ON d.D_ID = sc.SC_D_ID
      LEFT JOIN project p ON d.D_ID = p.P_D_ID
      WHERE d.D_T_ID = ?
      GROUP BY d.D_ID
      ORDER BY d.D_Created_At DESC
    `;
    db.query(sql, [teacherId], (err, results) => callback(err, results));
  },

  // Criar nova cadeira (agora recebe cursoId)
  criar: (nome, descricao, professorId, cursoId, callback) => {
    const sql = 'INSERT INTO discipline (D_Name, D_Description, D_T_ID, D_C_ID, D_Created_At) VALUES (?, ?, ?, ?, NOW())';
    db.query(sql, [nome, descricao, professorId, cursoId], (err, result) => {
      if (err) return callback(err);
      callback(null, { id: result.insertId, nome, descricao, professorId, cursoId });
    });
  },

  // Verificar se professor existe
  verificarProfessor: (teacherId, callback) => {
    db.query('SELECT T_ID FROM teacher WHERE T_ID = ?', [teacherId], (err, results) => {
      callback(err, results.length > 0);
    });
  },

  // Verificar se cadeira existe com mesmo nome para o professor no mesmo curso
  verificarNomeDuplicado: (nome, professorId, cursoId, cadeiraId, callback) => {
    let sql = 'SELECT D_ID FROM discipline WHERE D_Name = ? AND D_T_ID = ? AND D_C_ID = ?';
    const params = [nome, professorId, cursoId];
    if (cadeiraId) {
      sql += ' AND D_ID != ?';
      params.push(cadeiraId);
    }
    db.query(sql, params, (err, results) => callback(err, results.length > 0));
  },

  // Obter cadeira por ID
  obterPorId: (cadeiraId, callback) => {
    const sql = `
      SELECT 
        d.D_ID as id,
        d.D_Name as nome,
        d.D_Description as descricao,
        d.D_T_ID as professorId,
        d.D_C_ID as cursoId,
        u.U_Name as professorNome,
        DATE_FORMAT(d.D_Created_At, '%d/%m/%Y') as criadoEm
      FROM discipline d
      INNER JOIN teacher t ON d.D_T_ID = t.T_ID
      INNER JOIN user u ON t.T_U_ID = u.U_ID
      WHERE d.D_ID = ?
    `;
    db.query(sql, [cadeiraId], (err, results) => callback(err, results[0]));
  },

  // Verificar se cadeira pertence ao professor
  verificarPropriedade: (cadeiraId, professorId, callback) => {
    db.query('SELECT D_ID FROM discipline WHERE D_ID = ? AND D_T_ID = ?', [cadeiraId, professorId], (err, results) => {
      callback(err, results.length > 0);
    });
  },

  // Atualizar cadeira
  atualizar: (cadeiraId, nome, descricao, cursoId, callback) => {
    db.query('UPDATE discipline SET D_Name = ?, D_Description = ?, D_C_ID = ? WHERE D_ID = ?', [nome, descricao, cursoId, cadeiraId], callback);
  },

  // Verificar se tem estudantes inscritos
  verificarEstudantes: (cadeiraId, callback) => {
    db.query('SELECT COUNT(*) as total FROM studentcourse WHERE SC_D_ID = ?', [cadeiraId], (err, results) => callback(err, results[0]?.total || 0));
  },

  // Verificar se tem projetos associados
  verificarProjetos: (cadeiraId, callback) => {
    db.query('SELECT COUNT(*) as total FROM project WHERE P_D_ID = ?', [cadeiraId], (err, results) => callback(err, results[0]?.total || 0));
  },

  // Apagar cadeira
  apagar: (cadeiraId, callback) => {
    db.query('DELETE FROM studentcourse WHERE SC_D_ID = ?', [cadeiraId], (err) => {
      if (err) return callback(err);
      db.query('DELETE FROM discipline WHERE D_ID = ?', [cadeiraId], callback);
    });
  },

  // Listar estudantes inscritos na cadeira
  listarEstudantes: (cadeiraId, callback) => {
    const sql = `
      SELECT 
        s.S_ID as id,
        u.U_Name as nome,
        u.U_Email as email,
        s.S_Year as ano,
        s.S_Class as turma
      FROM studentcourse sc
      INNER JOIN student s ON sc.SC_S_ID = s.S_ID
      INNER JOIN user u ON s.S_U_ID = u.U_ID
      WHERE sc.SC_D_ID = ?
      ORDER BY u.U_Name ASC
    `;
    db.query(sql, [cadeiraId], (err, results) => callback(err, results));
  }
};

module.exports = Cadeira;
