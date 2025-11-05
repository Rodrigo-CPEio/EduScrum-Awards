const User = require('../models/userModel');

const userController = {
  // Registrar utilizador
  register: (req, res) => {
    console.log('📥 [CONTROLLER] Requisição de registro recebida:', req.body);
    
    const { nome, email, password, tipo } = req.body;

    if (!nome || !email || !password || !tipo) {
      console.log('⚠️ [CONTROLLER] Campos incompletos');
      return res.status(400).json({ error: 'Preencha todos os campos.' });
    }

    // Verifica se o email já está registado
    User.findByEmail(email, (err, existingUser) => {
      if (err) {
        console.error('❌ [CONTROLLER] Erro ao verificar utilizador:', err);
        return res.status(500).json({ error: 'Erro ao verificar utilizador.' });
      }
      
      if (existingUser) {
        console.log('⚠️ [CONTROLLER] Email já existe');
        return res.status(400).json({ error: 'Email já está em uso.' });
      }

      // Cria o utilizador
      console.log('✅ [CONTROLLER] Email disponível, criando utilizador...');
      User.create(nome, email, password, tipo, (err) => {
        if (err) {
          console.error('❌ [CONTROLLER] Erro ao registrar utilizador:', err);
          return res.status(500).json({ error: 'Erro ao registrar utilizador.' });
        }
        console.log('✅ [CONTROLLER] Utilizador registrado com sucesso!');
        res.status(201).json({ message: 'Usuário registrado com sucesso!' });
      });
    });
  },

  // Login do utilizador COM VALIDAÇÃO DE TIPO
  login: (req, res) => {
    console.log('📥 [CONTROLLER] Requisição de login recebida:', req.body);
    
    const { email, password, tipo } = req.body;

    if (!email || !password || !tipo) {
      console.log('⚠️ [CONTROLLER] Campos incompletos');
      return res.status(400).json({ error: 'Preencha todos os campos.' });
    }

    // Busca o utilizador e verifica o tipo
    User.findByEmailWithType(email, (err, user) => {
      if (err) {
        console.error('❌ [CONTROLLER] Erro no servidor:', err);
        return res.status(500).json({ error: 'Erro no servidor.' });
      }
      
      if (!user) {
        console.log('⚠️ [CONTROLLER] Utilizador não encontrado');
        return res.status(401).json({ error: 'Utilizador não encontrado.' });
      }

      // Verifica senha
      if (user.U_Password !== password) {
        console.log('⚠️ [CONTROLLER] Senha incorreta');
        return res.status(401).json({ error: 'Senha incorreta.' });
      }

      // NOVO: Verifica se o tipo corresponde
      if (tipo === 'estudante' && !user.isStudent) {
        console.log('⚠️ [CONTROLLER] Utilizador não é estudante');
        return res.status(403).json({ error: 'Esta conta não é de estudante.' });
      }

      if (tipo === 'docente' && !user.isTeacher) {
        console.log('⚠️ [CONTROLLER] Utilizador não é docente');
        return res.status(403).json({ error: 'Esta conta não é de docente.' });
      }

      console.log('✅ [CONTROLLER] Login bem-sucedido!');
      res.status(200).json({ 
        message: 'Login bem-sucedido!', 
        user: {
          id: user.U_ID,
          nome: user.U_Name,
          email: user.U_Email,
          tipo: user.isStudent ? 'estudante' : 'docente'
        }
      });
    });
  }
};

module.exports = userController;