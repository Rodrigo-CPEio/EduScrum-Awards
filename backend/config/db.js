const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',      // usuario por defecto de XAMPP
  password: '',      // deja vacío si no pusiste contraseña
  database: 'teste'
});

connection.connect((err) => {
  if (err) {
    console.error('Error conectando a la base de datos:', err);
  } else {
    console.log('Conexión a MySQL establecida ✅');
  }
});

module.exports = connection;
