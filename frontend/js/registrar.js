// registrar.js

// Espera o DOM carregar completamente
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('registerForm');

  // Submit = REGISTRAR
  form.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const nome = document.getElementById('username').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const tipo = document.querySelector('input[name="tipo"]:checked').value;
  
  // Debug: mostra o que está sendo enviado
  console.log('📤 Enviando dados:', { nome, email, password, tipo });
  
  try {
    const response = await fetch('/usuarios/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, email, password, tipo })
    });
    
    const data = await response.json();
    console.log('📥 Resposta do servidor:', data);
    
    if (response.ok) {
      alert('✅ Registro realizado com sucesso! 🎉');
      window.location.href = '/login';
    } else {
      alert('❌ ' + (data.error || 'Erro ao registrar'));
    }
  } catch (err) {
    console.error('❌ Erro:', err);
    alert('❌ Erro de conexão com o servidor');
  }
});

// Botão Voltar = vai para login
document.getElementById('btnVoltar').addEventListener('click', () => {
  window.location.href = '/login';
});});