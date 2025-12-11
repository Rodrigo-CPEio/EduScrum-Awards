// backend/config/db.js
const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'qualidade_de_software'
});

connection.connect((err) => {
  if (err) {
    console.error('❌ Erro ao conectar à base de dados:', err);
  } else {
    console.log('✅ Conexão ao banco de dados bem-sucedida!');
  }
});

module.exports = connection;