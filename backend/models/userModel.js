const db = require('../config/db');

const User = {
  getAll: (callback) => {
    const sql = 'SELECT email FROM estudiantes';
    db.query(sql, (err, results) => {
      callback(err, results);
    });
  }
};

module.exports = User;