// backend/app.js

// ==================== IMPORTS ====================
const express = require('express');
const path = require('path');
require('./config/db'); // inicia conexão ao MySQL

// Rotas
const userRoutes = require('./routes/userRoutes');
const cursosRoutes = require('./routes/cursoRoutes');
const cadeirasRoutes = require('./routes/cadeiraRoutes');
const projectRoutes = require('./routes/projectRoutes');
const teamRoutes = require('./routes/teamRoutes');
const awardsRoutes = require('./routes/awardsRoutes');
const awardAssignmentRoutes = require('./routes/awardAssignmentRoutes');
const studentRoutes = require("./routes/studentRoutes");
const pointsRoutes = require("./routes/pointsRoutes");
const studentAwardsRoutes = require("./routes/studentAwardsRoutes");
const studentDashboardRoutes = require("./routes/studentDashboardRoutes");
const studentProfileRoutes = require("./routes/studentProfileRoutes");

const app = express();
const PORT = 3000;

// ==================== MIDDLEWARE ====================
// Middleware para processar JSON
app.use(express.json());

// ==================== ROTAS DE API (DEVEM VIR PRIMEIRO!) ====================
app.use("/api", studentRoutes);
app.use('/usuarios', userRoutes);
app.use('/cursos', cursosRoutes);
app.use('/cadeiras', cadeirasRoutes);
app.use('/projetos', projectRoutes);
app.use('/api/teams', teamRoutes); // <-- AGORA FUNCIONA 100%
app.use("/api/points", pointsRoutes);
app.use("/api/awards", studentAwardsRoutes);
app.use("/api/dashboard", studentDashboardRoutes);
app.use("/api/students", studentProfileRoutes);
// Ignorar favicon (opcional)
app.get('/favicon.ico', (req, res) => res.status(204).end());

// ==================== FICHEIROS DO FRONTEND ====================
// (DEPOIS das rotas API!)
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// ==================== PÁGINAS FRONTEND ====================
app.get('/', (req, res) => {
  res.send('Servidor Node.js funcionando corretamente 🚀');
});

// Login / Registo
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'login.html'));
});
app.use(express.static(path.join(__dirname, '..', 'frontend')));

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

// Professor — Páginas
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

app.get('/definicoesP', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'definicoes_Professor.html'));
});

// Estudante — Páginas
app.get('/projetosE', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'projeto_Estudante.html'));
});

app.get('/EquipaE', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'equipa_Estudante.html'));
});

app.get('/PremiosE', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'premios_estudante.html'));
});

app.get('/RankingsE', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'ranking_Estudiante.html'));
});

app.get('/definicoesE', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'definicoes_Estudiante.html'));
});

app.get('/notificacoesE', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'notificacoes_Estudiante.html'));
});

// ==================== ROTAS DE API ====================
app.use('/usuarios', userRoutes);
app.use('/cursos', cursosRoutes);
app.use('/cadeiras', cadeirasRoutes);
app.use('/projetos', projectRoutes);   // Rotas de projetos e sprints
app.use('/api/teams', teamRoutes);     // Rotas de equipas
app.use('/awards', awardsRoutes);
app.use('/awardassignments', awardAssignmentRoutes);

// ==================== INICIAR SERVIDOR ====================
app.listen(PORT, () => {
  console.log(`🔥 Servidor rodando em: http://localhost:${PORT}`);
});
