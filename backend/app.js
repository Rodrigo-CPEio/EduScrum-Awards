const express = require('express');
const path = require('path');
const userRoutes = require('./routes/userRoutes');
require('./config/db'); // inicia conexão ao MySQL

const app = express();
const PORT = 3000;

// Middleware para processar JSON (necessário para POST com body)
app.use(express.json());

// Servir ficheiros do frontend
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// Rota principal — só mostra mensagem no navegador
app.get('/', (req, res) => {
  res.send('Servidor Node.js funcionando corretamente 🚀');
});

// Outras páginas
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'login.html'));
});

app.get('/registrar', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'registrar.html'));
});

// Rota para a dashboard do Estudante
app.get('/dashboardE', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'dashboard_Estudante.html'));
});

// Rota para a dashboard do Professor
app.get('/dashboardP', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'dashboard_Professor.html'));
});

// Rota para os cursos do professor
app.get('/cursoP', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'curso_Professor.html'));
});

// Rota para as cadeiras do professor
app.get('/cadeirasP', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'cadeiras_Professor.html'));
});

// Rota para os projetos do professor
app.get('/projetosP', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'projetos_Professor.html'));
});

// Rota para as equipas do professor
app.get('/equipasP', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'equipas_Professor.html'));
});

// Rotas de API
app.use('/usuarios', userRoutes);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🔥 Servidor rodando em: http://localhost:${PORT}`);
});
