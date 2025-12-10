const Course = require('../models/cursoModel');

const cursoController = {
  listarCursosProfessor: (req, res) => {
    const { teacherId } = req.params;
    Course.listarPorProfessor(teacherId, (err, cursos) => {
      if (err) {
        console.error('Erro ao listar cursos:', err);
        return res.status(500).json({ success: false, error: 'Erro ao buscar cursos' });
      }
      res.status(200).json({ success: true, cursos });
    });
  },

  criarCurso: (req, res) => {
    const { nome, descricao, professorId } = req.body;
    if (!nome || !nome.trim()) return res.status(400).json({ success: false, error: 'O nome do curso é obrigatório' });
    if (!descricao || !descricao.trim()) return res.status(400).json({ success: false, error: 'A descrição do curso é obrigatória' });
    if (!professorId) return res.status(400).json({ success: false, error: 'Professor não identificado' });

    Course.verificarProfessor(professorId, (err, existe) => {
      if (err) return res.status(500).json({ success: false, error: 'Erro ao verificar professor' });
      if (!existe) return res.status(404).json({ success: false, error: 'Professor não encontrado' });

      Course.verificarNomeDuplicado(nome.trim(), professorId, null, (err, duplicado) => {
        if (err) return res.status(500).json({ success: false, error: 'Erro ao verificar nome do curso' });
        if (duplicado) return res.status(400).json({ success: false, error: 'Já existe um curso com este nome' });

        Course.criar(nome.trim(), descricao.trim(), professorId, (err, curso) => {
          if (err) {
            console.error('Erro ao criar curso:', err);
            return res.status(500).json({ success: false, error: 'Erro ao criar curso' });
          }
          res.status(201).json({ success: true, message: 'Curso criado com sucesso', curso });
        });
      });
    });
  },

  obterCurso: (req, res) => {
    const { id } = req.params;
    Course.obterPorId(id, (err, curso) => {
      if (err) {
        console.error('Erro ao buscar curso:', err);
        return res.status(500).json({ success: false, error: 'Erro ao buscar curso' });
      }
      if (!curso) return res.status(404).json({ success: false, error: 'Curso não encontrado' });
      res.status(200).json({ success: true, curso });
    });
  },

  editarCurso: (req, res) => {
    const { id } = req.params;
    const { nome, descricao, professorId } = req.body;

    if (!nome || !nome.trim()) return res.status(400).json({ success: false, error: 'O nome do curso é obrigatório' });
    if (!descricao || !descricao.trim()) return res.status(400).json({ success: false, error: 'A descrição do curso é obrigatória' });

    Course.verificarPropriedade(id, professorId, (err, pertence) => {
      if (err) return res.status(500).json({ success: false, error: 'Erro ao verificar curso' });
      if (!pertence) return res.status(403).json({ success: false, error: 'Curso não encontrado ou sem permissão' });

      Course.verificarNomeDuplicado(nome.trim(), professorId, id, (err, duplicado) => {
        if (err) return res.status(500).json({ success: false, error: 'Erro ao verificar nome do curso' });
        if (duplicado) return res.status(400).json({ success: false, error: 'Já existe outro curso com este nome' });

        Course.atualizar(id, nome.trim(), descricao.trim(), (err) => {
          if (err) {
            console.error('Erro ao atualizar curso:', err);
            return res.status(500).json({ success: false, error: 'Erro ao atualizar curso' });
          }
          res.status(200).json({ success: true, message: 'Curso atualizado com sucesso' });
        });
      });
    });
  },

  apagarCurso: (req, res) => {
    const { id } = req.params;
    const { professorId } = req.body;

    Course.verificarPropriedade(id, professorId, (err, pertence) => {
      if (err) return res.status(500).json({ success: false, error: 'Erro ao verificar curso' });
      if (!pertence) return res.status(403).json({ success: false, error: 'Curso não encontrado ou sem permissão' });

      Course.apagar(id, (err) => {
        if (err) {
          if (err.message === 'HAS_CADEIRAS') {
            return res.status(400).json({ success: false, error: 'Não é possível apagar um curso com cadeiras associadas' });
          }
          console.error('Erro ao apagar curso:', err);
          return res.status(500).json({ success: false, error: 'Erro ao apagar curso' });
        }
        res.status(200).json({ success: true, message: 'Curso apagado com sucesso' });
      });
    });
  }
};

module.exports = cursoController;
