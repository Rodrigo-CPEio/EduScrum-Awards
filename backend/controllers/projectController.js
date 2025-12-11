// backend/controllers/projectController.js
const Project = require('../models/projectModel');

const projectController = {
  // Criar novo projeto
  createProject: (req, res) => {
    const { name, description, startDate, endDate, disciplineId } = req.body;

    if (!name || !description || !startDate || !endDate || !disciplineId) {
      return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
    }

    const projectData = { name, description, startDate, endDate, disciplineId };

    Project.create(projectData, (err, result) => {
      if (err) {
        console.error('Erro ao criar projeto:', err);
        return res.status(500).json({ message: 'Erro ao criar projeto', error: err });
      }
      res.status(201).json({ 
        message: 'Projeto criado com sucesso', 
        projectId: result.insertId 
      });
    });
  },

  // Buscar projetos por disciplina
  getProjectsByDiscipline: (req, res) => {
    const { disciplineId } = req.params;

    Project.findByDiscipline(disciplineId, (err, projects) => {
      if (err) {
        console.error('Erro ao buscar projetos:', err);
        return res.status(500).json({ message: 'Erro ao buscar projetos', error: err });
      }
      res.status(200).json(projects);
    });
  },

  // Buscar projeto por ID
  getProjectById: (req, res) => {
    const { projectId } = req.params;

    Project.findById(projectId, (err, projects) => {
      if (err) {
        console.error('Erro ao buscar projeto:', err);
        return res.status(500).json({ message: 'Erro ao buscar projeto', error: err });
      }
      if (projects.length === 0) {
        return res.status(404).json({ message: 'Projeto não encontrado' });
      }
      res.status(200).json(projects[0]);
    });
  },

  // Buscar projetos do professor
  getProjectsByTeacher: (req, res) => {
    const { teacherId } = req.params;

    Project.findByTeacher(teacherId, (err, projects) => {
      if (err) {
        console.error('Erro ao buscar projetos do professor:', err);
        return res.status(500).json({ message: 'Erro ao buscar projetos', error: err });
      }
      res.status(200).json(projects);
    });
  },

  // Atualizar projeto
  updateProject: (req, res) => {
    const { projectId } = req.params;
    const { name, description, startDate, endDate, status } = req.body;

    if (!name || !description || !startDate || !endDate) {
      return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
    }

    const projectData = { name, description, startDate, endDate, status: status || 'ativo' };

    Project.update(projectId, projectData, (err, result) => {
      if (err) {
        console.error('Erro ao atualizar projeto:', err);
        return res.status(500).json({ message: 'Erro ao atualizar projeto', error: err });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Projeto não encontrado' });
      }
      res.status(200).json({ message: 'Projeto atualizado com sucesso' });
    });
  },

  // Deletar projeto
  deleteProject: (req, res) => {
    const { projectId } = req.params;

    Project.delete(projectId, (err, result) => {
      if (err) {
        console.error('Erro ao deletar projeto:', err);
        return res.status(500).json({ message: 'Erro ao deletar projeto', error: err });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Projeto não encontrado' });
      }
      res.status(200).json({ message: 'Projeto deletado com sucesso' });
    });
  }
};

module.exports = projectController;