document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');
  const btnRegistrar = document.getElementById('btnRegistrar');
  const msgLogin = document.createElement('p');
  msgLogin.classList.add('msg');
  form.appendChild(msgLogin);

  if (!form) {
    console.error('Formulário não encontrado!');
    return;
  }

  // Botão registrar
  btnRegistrar.addEventListener('click', () => {
    window.location.href = '/registrar';
  });

  // Submit login
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const tipo = document.querySelector('input[name="tipo"]:checked').value;

    msgLogin.textContent = '⏳ Carregando...';
    msgLogin.style.color = 'black';

    try {
      const response = await fetch('/usuarios/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, tipo })
      });

      const data = await response.json();

      if (response.ok) {
        msgLogin.textContent = '✅ Login bem-sucedido!';
        msgLogin.style.color = 'green';
        setTimeout(() => {
          window.location.href = tipo === 'estudante' ? '/dashboardE' : '/dashboardP';
        }, 800);
      } else {
        msgLogin.textContent = '❌ ' + (data.error || 'Erro ao fazer login');
        msgLogin.style.color = 'red';
      }
    } catch (err) {
      console.error(err);
      msgLogin.textContent = '❌ Erro de conexão com o servidor';
      msgLogin.style.color = 'red';
    }
  });
});
