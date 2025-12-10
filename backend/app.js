const express = require('express');
const path = require('path');
require('./config/db'); // inicia conexão ao MySQL

const userRoutes = require('./routes/userRoutes');
const cursosRoutes = require('./routes/cursoRoutes'); // rotas de cursos

const app = express();
const PORT = 3000;

// Middleware para processar JSON (necessário para POST, PUT, DELETE com body)
app.use(express.json());

// Servir ficheiros do frontend
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// ==================== PÁGINAS FRONTEND ====================
app.get('/', (req, res) => {
  res.send('Servidor Node.js funcionando corretamente 🚀');
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'login.html'));
});

app.get('/registrar', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'registrar.html'));
});

// Dashboards
app.get('/dashboardE', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'dashboard_Estudante.html'));
});

app.get('/dashboardP', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'dashboard_Professor.html'));
});

// Professor - Cursos, Cadeiras, Projetos, Equipas, Prémios, Ranking, Notificações
app.get('/cursoP', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'curso_Professor.html'));
});
app.get('/cadeirasP', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'cadeiras_Professor.html'));
});
app.get('/projetosP', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'projetos_Professor.html'));
});
app.get('/equipasP', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'equipas_Professor.html'));
});
app.get('/premiosP', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'premios_Professor.html'));
});
app.get('/rankingP', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'ranking_Professor.html'));
});
app.get('/notificacoesP', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'notificacoes_Professor.html'));
});


// ==================== Estudante====================
app.get('/projetosE', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'dashboard_Estudante_P.html'));
});

app.get('/EquipaE', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'dashboard_Estudante_E.html'));
});

app.get('/PremiosE', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'premios_estudante.html'));
});
app.get('/RankingsE', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'ranking_Estudiante.html'));
});
app.get('/RankingsE', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'ranking_Estudiante.html'));
});



// ==================== ROTAS DE API ====================
app.use('/usuarios', userRoutes);
app.use('/cursos', cursosRoutes); // <-- aqui registramos as rotas de cursos

// ==================== INICIAR SERVIDOR ====================
app.listen(PORT, () => {
  console.log(`🔥 Servidor rodando em: http://localhost:${PORT}`);
});
