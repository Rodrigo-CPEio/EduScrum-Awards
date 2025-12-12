// backend/controllers/awardsController.js
const Award = require('../models/awardsModel');

module.exports = {
  listar(req, res) {
    Award.getAllAwards((err, results) => {
      if (err) return res.status(500).json({ error: "Erro ao buscar prémios" });
      res.json(results);
    });
  },

  listarPorAlvo(req, res) {
    const target = req.params.target;
    // Validar se é um target válido (estudante ou equipa)
    if (target !== 'estudante' && target !== 'equipa' && target !== 'estudantes' && target !== 'equipas') {
      return res.status(400).json({ error: "Target inválido" });
    }
    
    // Normalizar para singular
    const normalizedTarget = target === 'estudantes' ? 'estudante' : target === 'equipas' ? 'equipa' : target;
    
    Award.getAwardsByTarget(normalizedTarget, (err, results) => {
      if (err) return res.status(500).json({ error: "Erro ao buscar prémios" });
      res.json(results);
    });
  },

  criar(req, res) {
    const data = req.body;
    Award.createAward(data, (err, result) => {
      if (err) {
        console.error('Erro ao criar prémio:', err);
        return res.status(500).json({ error: "Erro ao criar prémio", details: err.message });
      }
      res.status(201).json({ message: "Prémio criado", id: result.insertId });
    });
  },

  apagar(req, res) {
    const awardId = req.params.id;
    Award.deleteAward(awardId, (err, result) => {
      if (err) return res.status(500).json({ error: "Erro ao apagar prémio" });
      if (result.affectedRows === 0) return res.status(404).json({ error: "Prémio não encontrado" });
      res.json({ message: "Prémio apagado com sucesso" });
    });
  }
};