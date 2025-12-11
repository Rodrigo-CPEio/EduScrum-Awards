const mysql = require("mysql2/promise");

const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "qualidade_de_software"
});

async function testConnection() {
    try {
        const connection = await db.getConnection();
        console.log("✅ Conexão ao banco de dados bem-sucedida!");
        connection.release();
    } catch (err) {
        console.error("❌ Erro ao conectar ao banco de dados:", err);
    }
}

testConnection();

module.exports = db;
