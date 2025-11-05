const express = require('express');
const app = express();
const path = require('path');
const PORT = 3000;
const userRoutes = require('./routes/userRoutes');


// Middleware para JSON
app.use(express.json());

// Serve para archivos estáticos (HTML, CSS, imágenes, JS)
app.use(express.static(path.join(__dirname, '..', 'frontend')));


// Ruta principal (login)
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'login.html'));
});

// Ruta de registro
app.get('/registrar', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'registrar.html'));
});

// Rota para a dashboard do estudante
app.get('/dashboardE', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'dashboard_Estudante.html'));
});

// rota para a dashboard do Professor
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



// Ruta de usuarios
app.use('/usuarios', userRoutes);

// Ruta de prova
app.get('/', (req, res) => {
  res.send('Servidor Node.js funcionando correctamente 🚀');
});


// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});