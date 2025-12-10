const Cadeira = require('../models/cadeiraModel');

const cadeiraController = {
  // Listar cadeiras por curso
  listarPorCurso: (req, res) => {
    const { cursoId } = req.params;
    if (!cursoId) return res.status(400).json({ success: false, error: 'ID do curso é obrigatório' });

    Cadeira.listarPorCurso(cursoId, (err, cadeiras) => {
      if (err) {
        console.error('Erro ao listar cadeiras:', err);
        return res.status(500).json({ success: false, error: 'Erro ao buscar cadeiras' });
      }
      res.json({ success: true, cadeiras });
    });
  },

  // Listar cadeiras de um professor (fallback)
  listarPorProfessor: (req, res) => {
    const { professorId } = req.params;
    if (!professorId) return res.status(400).json({ success: false, error: 'ID do professor é obrigatório' });

    Cadeira.listarPorProfessor(professorId, (err, cadeiras) => {
      if (err) {
        console.error('Erro ao listar cadeiras:', err);
        return res.status(500).json({ success: false, error: 'Erro ao buscar cadeiras' });
      }
      res.json({ success: true, cadeiras });
    });
  },

  // Obter cadeira por ID
  obterPorId: (req, res) => {
    const { id } = req.params;
    Cadeira.obterPorId(id, (err, cadeira) => {
      if (err) {
        console.error('Erro ao buscar cadeira:', err);
        return res.status(500).json({ success: false, error: 'Erro ao buscar cadeira' });
      }
      if (!cadeira) return res.status(404).json({ success: false, error: 'Cadeira não encontrada' });
      res.json({ success: true, cadeira });
    });
  },

  // Criar nova cadeira (exige cursoId)
  criar: (req, res) => {
    const { nome, descricao, professorId, cursoId } = req.body;
    if (!nome || nome.trim().length < 3) return res.status(400).json({ success: false, error: 'Nome da cadeira deve ter pelo menos 3 caracteres' });
    if (!descricao || descricao.trim().length === 0) return res.status(400).json({ success: false, error: 'Descrição da cadeira é obrigatória' });
    if (!professorId) return res.status(400).json({ success: false, error: 'ID do professor é obrigatório' });
    if (!cursoId) return res.status(400).json({ success: false, error: 'ID do curso é obrigatório' });

    Cadeira.verificarProfessor(professorId, (err, existe) => {
      if (err) {
        console.error('Erro ao verificar professor:', err);
        return res.status(500).json({ success: false, error: 'Erro ao verificar professor' });
      }
      if (!existe) return res.status(404).json({ success: false, error: 'Professor não encontrado' });

      Cadeira.verificarNomeDuplicado(nome.trim(), professorId, cursoId, null, (err, duplicado) => {
        if (err) {
          console.error('Erro ao verificar nome duplicado:', err);
          return res.status(500).json({ success: false, error: 'Erro ao verificar nome da cadeira' });
        }
        if (duplicado) return res.status(400).json({ success: false, error: 'Já existe uma cadeira com este nome neste curso' });

        Cadeira.criar(nome.trim(), descricao.trim(), professorId, cursoId, (err, cadeira) => {
          if (err) {
            console.error('Erro ao criar cadeira:', err);
            return res.status(500).json({ success: false, error: 'Erro ao criar cadeira' });
          }
          res.status(201).json({ success: true, message: 'Cadeira criada com sucesso!', cadeira });
        });
      });
    });
  },

  // Atualizar cadeira (pode alterar curso)
  atualizar: (req, res) => {
    const { id } = req.params;
    const { nome, descricao, professorId, cursoId } = req.body;

    if (!nome || nome.trim().length < 3) return res.status(400).json({ success: false, error: 'Nome da cadeira deve ter pelo menos 3 caracteres' });
    if (!descricao || descricao.trim().length === 0) return res.status(400).json({ success: false, error: 'Descrição da cadeira é obrigatória' });
    if (!professorId) return res.status(400).json({ success: false, error: 'ID do professor é obrigatório' });
    if (!cursoId) return res.status(400).json({ success: false, error: 'ID do curso é obrigatório' });

    Cadeira.verificarPropriedade(id, professorId, (err, pertence) => {
      if (err) {
        console.error('Erro ao verificar propriedade:', err);
        return res.status(500).json({ success: false, error: 'Erro ao verificar cadeira' });
      }
      if (!pertence) return res.status(403).json({ success: false, error: 'Você não tem permissão para editar esta cadeira' });

      Cadeira.verificarNomeDuplicado(nome.trim(), professorId, cursoId, id, (err, duplicado) => {
        if (err) {
          console.error('Erro ao verificar nome duplicado:', err);
          return res.status(500).json({ success: false, error: 'Erro ao verificar nome da cadeira' });
        }
        if (duplicado) return res.status(400).json({ success: false, error: 'Já existe uma cadeira com este nome neste curso' });

        Cadeira.atualizar(id, nome.trim(), descricao.trim(), cursoId, (err) => {
          if (err) {
            console.error('Erro ao atualizar cadeira:', err);
            return res.status(500).json({ success: false, error: 'Erro ao atualizar cadeira' });
          }
          res.json({ success: true, message: 'Cadeira atualizada com sucesso!' });
        });
      });
    });
  },

  // Apagar cadeira
  apagar: (req, res) => {
    const { id } = req.params;
    const { professorId } = req.body;
    if (!professorId) return res.status(400).json({ success: false, error: 'ID do professor é obrigatório' });

    Cadeira.verificarPropriedade(id, professorId, (err, pertence) => {
      if (err) return res.status(500).json({ success: false, error: 'Erro ao verificar cadeira' });
      if (!pertence) return res.status(403).json({ success: false, error: 'Você não tem permissão para apagar esta cadeira' });

      Cadeira.verificarProjetos(id, (err, totalProjetos) => {
        if (err) return res.status(500).json({ success: false, error: 'Erro ao verificar projetos' });
        if (totalProjetos > 0) return res.status(400).json({ success: false, error: `Não é possível apagar esta cadeira pois tem ${totalProjetos} projeto(s) associado(s)` });

        Cadeira.apagar(id, (err) => {
          if (err) {
            console.error('Erro ao apagar cadeira:', err);
            return res.status(500).json({ success: false, error: 'Erro ao apagar cadeira' });
          }
          res.json({ success: true, message: 'Cadeira apagada com sucesso!' });
        });
      });
    });
  },

  listarEstudantes: (req, res) => {
    const { id } = req.params;
    Cadeira.listarEstudantes(id, (err, estudantes) => {
      if (err) return res.status(500).json({ success: false, error: 'Erro ao buscar estudantes' });
      res.json({ success: true, estudantes });
    });
  }
};

module.exports = cadeiraController;
