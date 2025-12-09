//UserModel.js
const db = require('../config/db');

const User = {
  create: (nome, email, password, tipo, callback) => {
    db.query('INSERT INTO User (U_Name, U_Email, U_Password) VALUES (?, ?, ?)', 
      [nome, email, password], (err, result) => {
        if (err) return callback(err);
        const userId = result.insertId;

        if (tipo === 'docente') {
          db.query('INSERT INTO Teacher (T_U_ID) VALUES (?)', [userId], callback);
        } else if (tipo === 'estudante') {
          db.query('INSERT INTO Student (S_U_ID) VALUES (?)', [userId], callback);
        } else {
          callback(null, { userId });
        }
    });
  },

  findByEmail: (email, callback) => {
    db.query('SELECT * FROM User WHERE U_Email = ?', [email], (err, results) => {
      callback(err, results[0]);
    });
  },

  findByEmailWithType: (email, callback) => {
    const sql = `
      SELECT u.*, 
             s.S_ID, s.S_Year, s.S_Class,
             t.T_ID, t.T_Institution, t.T_Department,
             CASE WHEN s.S_U_ID IS NOT NULL THEN 1 ELSE 0 END as isStudent,
             CASE WHEN t.T_U_ID IS NOT NULL THEN 1 ELSE 0 END as isTeacher
      FROM User u
      LEFT JOIN Student s ON u.U_ID = s.S_U_ID
      LEFT JOIN Teacher t ON u.U_ID = t.T_U_ID
      WHERE u.U_Email = ?
    `;
    db.query(sql, [email], (err, results) => callback(err, results[0]));
  },

  findById: (userId, callback) => {
    const sql = `
      SELECT u.U_ID, u.U_Name, u.U_Email, u.U_Password,
             s.S_ID, s.S_Year, s.S_Class,
             t.T_ID, t.T_Institution, t.T_Department
      FROM User u
      LEFT JOIN Student s ON u.U_ID = s.S_U_ID
      LEFT JOIN Teacher t ON u.U_ID = t.T_U_ID
      WHERE u.U_ID = ?
    `;
    db.query(sql, [userId], (err, results) => {
      if (err) return callback(err);
      if (results.length === 0) return callback(null, null);

      const r = results[0];
      const perfil = {
        id: r.U_ID,
        nome: r.U_Name,
        email: r.U_Email,
        U_Password: r.U_Password,
        tipo: r.S_ID ? 'estudante' : 'docente',
        ano: r.S_Year || null,
        turma: r.S_Class || null,
        studentId: r.S_ID || null,
        instituicao: r.T_Institution || null,
        departamento: r.T_Department || null,
        teacherId: r.T_ID || null
      };
      callback(null, perfil);
    });
  },

  updateProfile: (userId, campos, callback) => {
    const { nome, ano, turma, instituicao, departamento } = campos;

    db.query('UPDATE User SET U_Name = ? WHERE U_ID = ?', [nome || null, userId], (err) => {
      if (err) return callback(err);

      db.query('SELECT * FROM Student WHERE S_U_ID = ?', [userId], (err, student) => {
        if (err) return callback(err);

        if (student.length > 0) {
          db.query('UPDATE Student SET S_Year = ?, S_Class = ? WHERE S_U_ID = ?', 
            [ano || null, turma || null, userId], callback);
        } else {
          db.query('UPDATE Teacher SET T_Institution = ?, T_Department = ? WHERE T_U_ID = ?', 
            [instituicao || null, departamento || null, userId], callback);
        }
      });
    });
  },

  updatePassword: (userId, novaSenha, callback) => {
    db.query('UPDATE User SET U_Password = ? WHERE U_ID = ?', [novaSenha, userId], callback);
  }
};

module.exports = User;
