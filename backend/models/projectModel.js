// backend/models/projectModel.js
const db = require('../config/db');

const Project = {
  // Criar novo projeto
  create: (projectData, callback) => {
    const { name, description, startDate, endDate, disciplineId } = projectData;
    const query = `
      INSERT INTO project (P_Name, P_Description, P_Start_Date, P_End_Date, P_Status, P_D_ID)
      VALUES (?, ?, ?, ?, 'ativo', ?)
    `;
    db.query(query, [name, description, startDate, endDate, disciplineId], callback);
  },

  // Buscar todos os projetos de uma disciplina
  findByDiscipline: (disciplineId, callback) => {
    const query = `
      SELECT 
        p.*,
        COUNT(DISTINCT sp.SP_ID) as total_sprints,
        COUNT(DISTINCT CASE WHEN sp.SP_End_Date < NOW() THEN sp.SP_ID END) as completed_sprints
      FROM project p
      LEFT JOIN sprint sp ON p.P_ID = sp.SP_P_ID
      WHERE p.P_D_ID = ?
      GROUP BY p.P_ID
      ORDER BY p.P_Start_Date DESC
    `;
    db.query(query, [disciplineId], callback);
  },

  // Buscar projeto por ID
  findById: (projectId, callback) => {
    const query = `
      SELECT p.*, d.D_Name as discipline_name
      FROM project p
      LEFT JOIN discipline d ON p.P_D_ID = d.D_ID
      WHERE p.P_ID = ?
    `;
    db.query(query, [projectId], callback);
  },

  // Atualizar projeto
  update: (projectId, projectData, callback) => {
    const { name, description, startDate, endDate, status } = projectData;
    const query = `
      UPDATE project 
      SET P_Name = ?, P_Description = ?, P_Start_Date = ?, P_End_Date = ?, P_Status = ?
      WHERE P_ID = ?
    `;
    db.query(query, [name, description, startDate, endDate, status, projectId], callback);
  },

  // Deletar projeto
  delete: (projectId, callback) => {
    const query = 'DELETE FROM project WHERE P_ID = ?';
    db.query(query, [projectId], callback);
  },

  // Buscar projetos do professor (através das disciplinas)
  findByTeacher: (teacherId, callback) => {
    const query = `
      SELECT 
        p.*,
        d.D_Name as discipline_name,
        c.C_Name as course_name,
        COUNT(DISTINCT sp.SP_ID) as total_sprints,
        COUNT(DISTINCT CASE WHEN sp.SP_End_Date < NOW() THEN sp.SP_ID END) as completed_sprints,
        COUNT(DISTINCT te.TE_ID) as total_teams,
        COUNT(DISTINCT tm.TM_S_ID) as total_students
      FROM project p
      INNER JOIN discipline d ON p.P_D_ID = d.D_ID
      INNER JOIN course c ON d.D_C_ID = c.C_ID
      LEFT JOIN sprint sp ON p.P_ID = sp.SP_P_ID
      LEFT JOIN team te ON p.P_ID = te.TE_P_ID
      LEFT JOIN team_member tm ON te.TE_ID = tm.TM_TE_ID
      WHERE d.D_T_ID = ?
      GROUP BY p.P_ID
      ORDER BY p.P_Start_Date DESC
    `;
    db.query(query, [teacherId], callback);
  }
};

module.exports = Project;