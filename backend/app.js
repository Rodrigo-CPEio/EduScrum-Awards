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

app.get('/dashboardE', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'dashboard_Estudante.html'));
});

app.get('/dashboardP', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'dashboard_Professor.html'));
});

// Rotas de API
app.use('/usuarios', userRoutes);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🔥 Servidor rodando em: http://localhost:${PORT}`);
});