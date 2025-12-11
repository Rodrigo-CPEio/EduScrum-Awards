// backend/controllers/sprintController.js
const Sprint = require('../models/sprintModel');

const sprintController = {
  // Criar novo sprint
  createSprint: (req, res) => {
    const { projectId, name, startDate, endDate, objectives } = req.body;

    if (!projectId || !name || !startDate || !endDate || !objectives) {
      return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
    }

    const sprintData = { projectId, name, startDate, endDate, objectives };

    Sprint.create(sprintData, (err, result) => {
      if (err) {
        console.error('Erro ao criar sprint:', err);
        return res.status(500).json({ message: 'Erro ao criar sprint', error: err });
      }
      res.status(201).json({ 
        message: 'Sprint criado com sucesso', 
        sprintId: result.insertId 
      });
    });
  },

  // Buscar sprints por projeto
  getSprintsByProject: (req, res) => {
    const { projectId } = req.params;

    Sprint.findByProject(projectId, (err, sprints) => {
      if (err) {
        console.error('Erro ao buscar sprints:', err);
        return res.status(500).json({ message: 'Erro ao buscar sprints', error: err });
      }
      res.status(200).json(sprints);
    });
  },

  // Buscar sprint por ID
  getSprintById: (req, res) => {
    const { sprintId } = req.params;

    Sprint.findById(sprintId, (err, sprints) => {
      if (err) {
        console.error('Erro ao buscar sprint:', err);
        return res.status(500).json({ message: 'Erro ao buscar sprint', error: err });
      }
      if (sprints.length === 0) {
        return res.status(404).json({ message: 'Sprint não encontrado' });
      }
      res.status(200).json(sprints[0]);
    });
  },

  // Atualizar sprint
  updateSprint: (req, res) => {
    const { sprintId } = req.params;
    const { name, startDate, endDate, objectives, status } = req.body;

    if (!name || !startDate || !endDate || !objectives) {
      return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
    }

    const sprintData = { name, startDate, endDate, objectives, status: status || 'em-espera' };

    Sprint.update(sprintId, sprintData, (err, result) => {
      if (err) {
        console.error('Erro ao atualizar sprint:', err);
        return res.status(500).json({ message: 'Erro ao atualizar sprint', error: err });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Sprint não encontrado' });
      }
      res.status(200).json({ message: 'Sprint atualizado com sucesso' });
    });
  },

  // Deletar sprint
  deleteSprint: (req, res) => {
    const { sprintId } = req.params;

    Sprint.delete(sprintId, (err, result) => {
      if (err) {
        console.error('Erro ao deletar sprint:', err);
        return res.status(500).json({ message: 'Erro ao deletar sprint', error: err });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Sprint não encontrado' });
      }
      res.status(200).json({ message: 'Sprint deletado com sucesso' });
    });
  }
};

module.exports = sprintController;