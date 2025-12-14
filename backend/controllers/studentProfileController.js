const db = require("../config/db");

module.exports = {
  getMyProfile(req, res){
    const studentId = Number(req.query.studentId);
    if(!studentId) return res.status(400).json({ message:"studentId é obrigatório" });

    const sql = `
      SELECT
        s.S_ID AS studentId,
        u.U_Name AS name,
        u.U_Email AS email,
        s.S_Year AS year,
        s.S_Class AS className
      FROM student s
      JOIN user u ON u.U_ID = s.S_U_ID
      WHERE s.S_ID = ?
      LIMIT 1
    `;

    db.query(sql, [studentId], (err, rows) => {
      if(err) return res.status(500).json({ message:"Erro SQL", error: err });
      if(!rows?.length) return res.status(404).json({ message:"Estudante não encontrado" });
      return res.json(rows[0]);
    });
  },

  updateMyProfile(req, res){
    const studentId = Number(req.query.studentId);
    if(!studentId) return res.status(400).json({ message:"studentId é obrigatório" });

    const { name, email, year, className } = req.body || {};
    if(!name || String(name).trim().length < 2) return res.status(400).json({ message:"Nome inválido" });
    if(!email || !String(email).includes("@")) return res.status(400).json({ message:"Email inválido" });

    // 1) Buscar U_ID del estudiante
    db.query(`SELECT S_U_ID AS userId FROM student WHERE S_ID = ? LIMIT 1`, [studentId], (err, rows) => {
      if(err) return res.status(500).json({ message:"Erro SQL", error: err });
      if(!rows?.length) return res.status(404).json({ message:"Estudante não encontrado" });

      const userId = rows[0].userId;

      // 2) Update user (nome/email)
      db.query(
        `UPDATE user SET U_Name = ?, U_Email = ? WHERE U_ID = ?`,
        [String(name).trim(), String(email).trim(), userId],
        (err2) => {
          if(err2) return res.status(500).json({ message:"Erro ao atualizar user", error: err2 });

          // 3) Update student (ano/turma)
          db.query(
            `UPDATE student SET S_Year = ?, S_Class = ? WHERE S_ID = ?`,
            [year ?? null, className ?? null, studentId],
            (err3) => {
              if(err3) return res.status(500).json({ message:"Erro ao atualizar student", error: err3 });
              return res.json({ message:"Perfil atualizado com sucesso" });
            }
          );
        }
      );
    });
  }
};
