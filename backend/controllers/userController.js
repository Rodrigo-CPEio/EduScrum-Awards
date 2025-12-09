//userController.js

const User = require('../models/userModel');

const userController = {
  // REGISTRO
  register: (req, res) => {
    const { nome, email, password, tipo } = req.body;
    if (!nome || !email || !password || !tipo) {
      return res.status(400).json({ error: 'Preencha todos os campos.' });
    }

    User.findByEmail(email, (err, existingUser) => {
      if (err) return res.status(500).json({ error: 'Erro ao verificar usuário.' });
      if (existingUser) return res.status(400).json({ error: 'Email já está em uso.' });

      User.create(nome, email, password, tipo, (err) => {
        if (err) return res.status(500).json({ error: 'Erro ao registrar usuário.' });
        res.status(201).json({ message: 'Usuário registrado com sucesso!' });
      });
    });
  },

  // LOGIN
  login: (req, res) => {
    const { email, password, tipo } = req.body;
    if (!email || !password || !tipo) return res.status(400).json({ error: 'Preencha todos os campos.' });

    User.findByEmailWithType(email, (err, user) => {
      if (err) return res.status(500).json({ error: 'Erro no servidor.' });
      if (!user) return res.status(401).json({ error: 'Utilizador não encontrado.' });
      if (user.U_Password !== password) return res.status(401).json({ error: 'Senha incorreta.' });

      if (tipo === 'estudante' && !user.isStudent)
        return res.status(403).json({ error: 'Esta conta não é de estudante.' });
      if (tipo === 'docente' && !user.isTeacher)
        return res.status(403).json({ error: 'Esta conta não é de docente.' });

      res.status(200).json({
        message: 'Login bem-sucedido!',
        user: {
          id: user.U_ID,
          nome: user.U_Name,
          email: user.U_Email,
          tipo: user.isStudent ? 'estudante' : 'docente',
          teacherId: user.T_ID || null,
          studentId: user.S_ID || null,
          ano: user.S_Year || null,
          turma: user.S_Class || null,
          instituicao: user.T_Institution || null,
          departamento: user.T_Department || null
        }
      });
    });
  },

  // OBTER PERFIL
  getProfile: (req, res) => {
    const userId = req.params.userId;
    User.findById(userId, (err, perfil) => {
      if (err) return res.status(500).json({ error: 'Erro ao obter perfil.' });
      if (!perfil) return res.status(404).json({ error: 'Usuário não encontrado.' });
      res.status(200).json({ success: true, perfil });
    });
  },

  // ATUALIZAR PERFIL
  updateProfile: (req, res) => {
    const userId = req.params.userId;
    const { nome, ano, turma, instituicao, departamento } = req.body;

    User.updateProfile(userId, { nome, ano, turma, instituicao, departamento }, (err) => {
      if (err) return res.status(500).json({ error: 'Erro ao atualizar perfil.' });
      res.status(200).json({ success: true, message: 'Perfil atualizado com sucesso!' });
    });
  },

  // ALTERAR SENHA
  changePassword: (req, res) => {
    const userId = req.params.userId;
    const { passwordAtual, novaSenha } = req.body;

    if (!passwordAtual || !novaSenha) return res.status(400).json({ error: 'Passwords são obrigatórias' });

    User.findById(userId, (err, perfil) => {
      if (err) return res.status(500).json({ error: 'Erro no servidor.' });
      if (!perfil) return res.status(404).json({ error: 'Usuário não encontrado.' });
      if (perfil.U_Password !== passwordAtual) return res.status(401).json({ error: 'Password atual incorreta' });

      User.updatePassword(userId, novaSenha, (err) => {
        if (err) return res.status(500).json({ error: 'Erro ao alterar password' });
        res.status(200).json({ success: true, message: 'Password alterada com sucesso!' });
      });
    });
  }
};

module.exports = userController;
