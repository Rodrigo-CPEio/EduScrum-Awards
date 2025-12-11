// backend/models/sprintModel.js
const db = require('../config/db');

const Sprint = {
  // Criar novo sprint
  create: (sprintData, callback) => {
    const { projectId, name, startDate, endDate, objectives } = sprintData;
    const query = `
      INSERT INTO sprint (SP_P_ID, SP_Name, SP_Start_Date, SP_End_Date, SP_Objectives, SP_Status)
      VALUES (?, ?, ?, ?, ?, 'em-espera')
    `;
    db.query(query, [projectId, name, startDate, endDate, objectives], callback);
  },

  // Buscar todos os sprints de um projeto
  findByProject: (projectId, callback) => {
    const query = `
      SELECT 
        sp.*,
        CASE 
          WHEN sp.SP_End_Date < NOW() THEN 'concluido'
          WHEN sp.SP_Start_Date <= NOW() AND sp.SP_End_Date >= NOW() THEN 'ativo'
          ELSE 'em-espera'
        END as calculated_status
      FROM sprint sp
      WHERE sp.SP_P_ID = ?
      ORDER BY sp.SP_Start_Date ASC
    `;
    db.query(query, [projectId], callback);
  },

  // Buscar sprint por ID
  findById: (sprintId, callback) => {
    const query = 'SELECT * FROM sprint WHERE SP_ID = ?';
    db.query(query, [sprintId], callback);
  },

  // Atualizar sprint
  update: (sprintId, sprintData, callback) => {
    const { name, startDate, endDate, objectives, status } = sprintData;
    const query = `
      UPDATE sprint 
      SET SP_Name = ?, SP_Start_Date = ?, SP_End_Date = ?, SP_Objectives = ?, SP_Status = ?
      WHERE SP_ID = ?
    `;
    db.query(query, [name, startDate, endDate, objectives, status, sprintId], callback);
  },

  // Deletar sprint
  delete: (sprintId, callback) => {
    const query = 'DELETE FROM sprint WHERE SP_ID = ?';
    db.query(query, [sprintId], callback);
  },

  // Atualizar status do sprint automaticamente
  updateStatus: (sprintId, status, callback) => {
    const query = 'UPDATE sprint SET SP_Status = ? WHERE SP_ID = ?';
    db.query(query, [status, sprintId], callback);
  }
};

module.exports = Sprint;