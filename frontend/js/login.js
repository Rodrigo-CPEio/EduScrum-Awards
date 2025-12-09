// login.js

// Espera o DOM carregar completamente
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');

  form.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const tipo = document.querySelector('input[name="tipo"]:checked').value;
  
  try {
    const response = await fetch('/usuarios/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, tipo })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      // Salva dados do usuário no localStorage
      localStorage.setItem('user', JSON.stringify(data.user));
      
      alert('Login bem-sucedido! 🎉');
      
      // Redirecionar conforme o tipo de utilizador
      if (tipo === 'estudante') {
        window.location.href = '/dashboardE';
      } else {
        window.location.href = '/dashboardP';
      }
    } else {
      alert(data.error || 'Erro ao fazer login');
    }
  } catch (err) {
    console.error('❌ Erro:', err);
    alert('Erro de conexão com o servidor');
  }
});

  // Botão Registrar
  document.getElementById('btnRegistrar').addEventListener('click', () => {
    window.location.href = '/registrar';
  });
});