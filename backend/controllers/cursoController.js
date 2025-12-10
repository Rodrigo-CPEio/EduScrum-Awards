// cursoController.js
const Curso = require('../models/cursoModel');

const cursoController = {
  // LISTAR CURSOS DO PROFESSOR
  listarCursosProfessor: (req, res) => {
    const { teacherId } = req.params;
    
    Curso.listarPorProfessor(teacherId, (err, cursos) => {
      if (err) {
        console.error('Erro ao listar cursos:', err);
        return res.status(500).json({
          success: false,
          error: 'Erro ao buscar cursos'
        });
      }
      
      res.status(200).json({
        success: true,
        cursos: cursos
      });
    });
  },

  // CRIAR NOVO CURSO
  criarCurso: (req, res) => {
    const { nome, descricao, professorId } = req.body;
    
    // Validações
    if (!nome || !nome.trim()) {
      return res.status(400).json({
        success: false,
        error: 'O nome do curso é obrigatório'
      });
    }
    
    if (!descricao || !descricao.trim()) {
      return res.status(400).json({
        success: false,
        error: 'A descrição do curso é obrigatória'
      });
    }
    
    if (!professorId) {
      return res.status(400).json({
        success: false,
        error: 'Professor não identificado'
      });
    }
    
    // Verifica se o professor existe
    Curso.verificarProfessor(professorId, (err, existe) => {
      if (err) {
        return res.status(500).json({
          success: false,
          error: 'Erro ao verificar professor'
        });
      }
      
      if (!existe) {
        return res.status(404).json({
          success: false,
          error: 'Professor não encontrado'
        });
      }
      
      // Verifica se já existe um curso com o mesmo nome
      Curso.verificarNomeDuplicado(nome.trim(), professorId, null, (err, duplicado) => {
        if (err) {
          return res.status(500).json({
            success: false,
            error: 'Erro ao verificar nome do curso'
          });
        }
        
        if (duplicado) {
          return res.status(400).json({
            success: false,
            error: 'Já existe um curso com este nome'
          });
        }
        
        // Cria o curso
        Curso.criar(nome.trim(), descricao.trim(), professorId, (err, curso) => {
          if (err) {
            console.error('Erro ao criar curso:', err);
            return res.status(500).json({
              success: false,
              error: 'Erro ao criar curso'
            });
          }
          
          res.status(201).json({
            success: true,
            message: 'Curso criado com sucesso',
            curso: curso
          });
        });
      });
    });
  },

  // OBTER DETALHES DO CURSO
  obterCurso: (req, res) => {
    const { id } = req.params;
    
    Curso.obterPorId(id, (err, curso) => {
      if (err) {
        console.error('Erro ao buscar curso:', err);
        return res.status(500).json({
          success: false,
          error: 'Erro ao buscar curso'
        });
      }
      
      if (!curso) {
        return res.status(404).json({
          success: false,
          error: 'Curso não encontrado'
        });
      }
      
      res.status(200).json({
        success: true,
        curso: curso
      });
    });
  },

  // EDITAR CURSO
  editarCurso: (req, res) => {
    const { id } = req.params;
    const { nome, descricao, professorId } = req.body;
    
    // Validações
    if (!nome || !nome.trim()) {
      return res.status(400).json({
        success: false,
        error: 'O nome do curso é obrigatório'
      });
    }
    
    if (!descricao || !descricao.trim()) {
      return res.status(400).json({
        success: false,
        error: 'A descrição do curso é obrigatória'
      });
    }
    
    // Verifica se o curso existe e pertence ao professor
    Curso.verificarPropriedade(id, professorId, (err, pertence) => {
      if (err) {
        return res.status(500).json({
          success: false,
          error: 'Erro ao verificar curso'
        });
      }
      
      if (!pertence) {
        return res.status(404).json({
          success: false,
          error: 'Curso não encontrado ou sem permissão'
        });
      }
      
      // Verifica se já existe outro curso com o mesmo nome
      Curso.verificarNomeDuplicado(nome.trim(), professorId, id, (err, duplicado) => {
        if (err) {
          return res.status(500).json({
            success: false,
            error: 'Erro ao verificar nome do curso'
          });
        }
        
        if (duplicado) {
          return res.status(400).json({
            success: false,
            error: 'Já existe outro curso com este nome'
          });
        }
        
        // Atualiza o curso
        Curso.atualizar(id, nome.trim(), descricao.trim(), (err) => {
          if (err) {
            console.error('Erro ao atualizar curso:', err);
            return res.status(500).json({
              success: false,
              error: 'Erro ao atualizar curso'
            });
          }
          
          res.status(200).json({
            success: true,
            message: 'Curso atualizado com sucesso'
          });
        });
      });
    });
  },

  // APAGAR CURSO
  apagarCurso: (req, res) => {
    const { id } = req.params;
    const { professorId } = req.body;
    
    // Verifica se o curso existe e pertence ao professor
    Curso.verificarPropriedade(id, professorId, (err, pertence) => {
      if (err) {
        return res.status(500).json({
          success: false,
          error: 'Erro ao verificar curso'
        });
      }
      
      if (!pertence) {
        return res.status(404).json({
          success: false,
          error: 'Curso não encontrado ou sem permissão'
        });
      }
      
      // Verifica se existem estudantes inscritos
      Curso.verificarEstudantes(id, (err, totalEstudantes) => {
        if (err) {
          return res.status(500).json({
            success: false,
            error: 'Erro ao verificar estudantes'
          });
        }
        
        if (totalEstudantes > 0) {
          return res.status(400).json({
            success: false,
            error: 'Não é possível apagar um curso com estudantes inscritos'
          });
        }
        
        // Verifica se existem projetos associados
        Curso.verificarProjetos(id, (err, totalProjetos) => {
          if (err) {
            return res.status(500).json({
              success: false,
              error: 'Erro ao verificar projetos'
            });
          }
          
          if (totalProjetos > 0) {
            return res.status(400).json({
              success: false,
              error: 'Não é possível apagar um curso com projetos associados'
            });
          }
          
          // Apaga o curso
          Curso.apagar(id, (err) => {
            if (err) {
              console.error('Erro ao apagar curso:', err);
              return res.status(500).json({
                success: false,
                error: 'Erro ao apagar curso'
              });
            }
            
            res.status(200).json({
              success: true,
              message: 'Curso apagado com sucesso'
            });
          });
        });
      });
    });
  }
};

module.exports = cursoController;