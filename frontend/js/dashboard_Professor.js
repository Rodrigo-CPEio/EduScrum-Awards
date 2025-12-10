document.addEventListener('DOMContentLoaded', () => {
  carregarDadosUsuario();
  configurarBotaoSair();
});

// ==================== CARREGAR DADOS DO USUÁRIO ====================
function carregarDadosUsuario() {
  const userStr = localStorage.getItem('user');
  
  if (!userStr) {
    // Usuário não está logado, redireciona para login
    window.location.href = '/login';
    return;
  }

  const user = JSON.parse(userStr);

  // Atualiza nome na sidebar
  const nomeElement = document.querySelector('.user-details h3');
  if (nomeElement) {
    nomeElement.textContent = user.nome || 'Usuário';
  }

  // Atualiza tipo
  const tipoElement = document.querySelector('.user-details p');
  if (tipoElement) {
    tipoElement.textContent = user.tipo === 'docente' ? 'Docente' : 'Estudante';
  }

  // Avatar: se não tiver foto, mostra inicial
  const imgElement = document.querySelector('.user-info img');
  if (imgElement) {
    if (user.foto) {
      imgElement.src = user.foto;
      imgElement.style.display = 'block';
    } else {
      imgElement.style.display = 'none';
      const avatar = document.createElement('div');
      avatar.style.cssText = `
        width: 55px;
        height: 55px;
        border-radius: 50%;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 24px;
        font-weight: bold;
      `;
      avatar.textContent = (user.nome || 'U')[0].toUpperCase();
      imgElement.parentNode.insertBefore(avatar, imgElement);
    }
  }
}

// ==================== CONFIGURAR BOTÃO SAIR ====================
function configurarBotaoSair() {
  const botaoSair = document.querySelector('.bottom-menu li:last-child a');
  if (botaoSair) {
    botaoSair.addEventListener('click', (e) => {
      e.preventDefault();
      if (confirm('Tem certeza que deseja sair?')) {
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    });
  }
}
