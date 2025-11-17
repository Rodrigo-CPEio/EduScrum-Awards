const db = require('../config/db');

const User = {
  // Criar novo utilizador (User + Teacher/Student)
  create: (name, email, password, tipo, callback) => {
    console.log('📝 [MODEL] Tentando criar user:', { name, email, tipo });
    
    const sqlUser = 'INSERT INTO User (U_Name, U_Email, U_Password) VALUES (?, ?, ?)';
    
    db.query(sqlUser, [name, email, password], (err, result) => {
      if (err) {
        console.error('❌ [MODEL] Erro ao inserir User:', err);
        return callback(err);
      }
      
      console.log('✅ [MODEL] User criado! ID:', result.insertId);
      const userId = result.insertId;

      if (tipo === 'docente') {
        console.log('👨‍🏫 [MODEL] Criando Teacher...');
        const sqlTeacher = 'INSERT INTO Teacher (T_U_ID) VALUES (?)';
        db.query(sqlTeacher, [userId], (err2) => {
          if (err2) {
            console.error('❌ [MODEL] Erro ao inserir Teacher:', err2);
            return callback(err2);
          }
          console.log('✅ [MODEL] Teacher criado!');
          callback(null, { userId });
        });
      } 
      else if (tipo === 'estudante') {
        console.log('👨‍🎓 [MODEL] Criando Student...');
        const sqlStudent = 'INSERT INTO Student (S_U_ID) VALUES (?)';
        db.query(sqlStudent, [userId], (err2) => {
          if (err2) {
            console.error('❌ [MODEL] Erro ao inserir Student:', err2);
            return callback(err2);
          }
          console.log('✅ [MODEL] Student criado!');
          callback(null, { userId });
        });
      } 
      else {
        console.log('⚠️ [MODEL] Tipo indefinido, só criou User');
        callback(null, { userId });
      }
    });
  },

  // Buscar utilizador pelo email (simples)
  findByEmail: (email, callback) => {
    console.log('🔍 [MODEL] Buscando email:', email);
    const sql = 'SELECT * FROM User WHERE U_Email = ?';
    db.query(sql, [email], (err, results) => {
      if (err) {
        console.error('❌ [MODEL] Erro ao buscar email:', err);
      } else {
        console.log('✅ [MODEL] Busca concluída. Encontrado:', results.length > 0);
      }
      callback(err, results[0]);
    });
  },

  // NOVO: Buscar utilizador pelo email COM TIPO (Student ou Teacher)
  findByEmailWithType: (email, callback) => {
    console.log('🔍 [MODEL] Buscando email com tipo:', email);
    
    const sql = `
      SELECT 
        u.*,
        CASE WHEN s.S_U_ID IS NOT NULL THEN 1 ELSE 0 END as isStudent,
        CASE WHEN t.T_U_ID IS NOT NULL THEN 1 ELSE 0 END as isTeacher
      FROM User u
      LEFT JOIN Student s ON u.U_ID = s.S_U_ID
      LEFT JOIN Teacher t ON u.U_ID = t.T_U_ID
      WHERE u.U_Email = ?
    `;
    
    db.query(sql, [email], (err, results) => {
      if (err) {
        console.error('❌ [MODEL] Erro ao buscar email com tipo:', err);
        return callback(err);
      }
      
      if (results.length > 0) {
        console.log('✅ [MODEL] Utilizador encontrado:', {
          id: results[0].U_ID,
          isStudent: !!results[0].isStudent,
          isTeacher: !!results[0].isTeacher
        });
      } else {
        console.log('⚠️ [MODEL] Utilizador não encontrado');
      }
      
      callback(null, results[0]);
    });
  }
};

module.exports = User;