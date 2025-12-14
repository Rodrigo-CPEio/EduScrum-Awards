// =========================
//  SIDEBAR UNIVERSAL
// =========================

/**
 * Configuração do Sidebar
 * @param {Object} config - Configuração do sidebar
 * @param {string} config.userType - Tipo de usuário: 'estudante' ou 'professor'
 * @param {string} config.activePage - Página ativa atual
 * @param {Object} config.userData - Dados do usuário (nome, foto, pontos)
 */
function inicializarSidebar(config) {
  const { userType = 'estudante', activePage = '', userData = {} } = config;
  
  // Menu items por tipo de usuário
  const menuItems = {
    estudante: [
      {
        id: 'dashboard',
        icon: '<path d="M3 13h8V3H3zM13 21h8v-8h-8zM13 3v8h8V3zM3 21h8v-8H3z"/>',
        label: 'Dashboard',
        href: '/dashboardE'
      },
      {
        id: 'projetos',
        icon: '<path d="M4 19.5V4a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v15.5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z"/><path d="M4 6h16M4 10h16M4 14h16"/>',
        label: 'Projetos',
        href: '/projetosE'
      },
      {
        id: 'equipas',
        icon: '<circle cx="9" cy="7" r="4"/><circle cx="17" cy="7" r="4"/><path d="M5 21v-2a4 4 0 0 1 8 0v2"/><path d="M13 21v-2a4 4 0 0 1 8 0v2"/>',
        label: 'Minhas Equipas',
        href: '/EquipaE'
      },
      {
        id: 'premios',
        icon: '<path d="M8 2h8v4H8z"/><path d="M6 6h12v2a5 5 0 0 1-5 5H11a5 5 0 0 1-5-5V6z"/><path d="M9 18h6"/><path d="M12 14v4"/>',
        label: 'Prémios',
        href: '/PremiosE'
      },
      {
        id: 'rankings',
        icon: '<line x1="4" y1="20" x2="4" y2="14"/><line x1="9" y1="20" x2="9" y2="10"/><line x1="14" y1="20" x2="14" y2="16"/><line x1="19" y1="20" x2="19" y2="8"/>',
        label: 'Rankings',
        href: '/RankingsE'
      },
      {
        id: 'notificacoes',
        icon: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>',
        label: 'Notificações',
        href: '/NotificacoesE',
        badge: '2'
      }
    ],
    professor: [
      {
        id: 'dashboard',
        icon: '<path d="M3 13h8V3H3zM13 21h8v-8h-8zM13 3v8h8V3zM3 21h8v-8H3z"/>',
        label: 'Dashboard',
        href: 'dashboard_Professor.html'
      },
      {
        id: 'cursos',
        icon: '<path d="M2 3h8a2 2 0 0 1 2 2v16a2 2 0 0 0-2-2H2z"/><path d="M22 3h-8a2 2 0 0 0-2 2v16a2 2 0 0 1 2-2h8z"/>',
        label: 'Cursos',
        href: 'curso_Professor.html'
      },
      {
        id: 'equipas',
        icon: '<circle cx="9" cy="7" r="4"/><circle cx="17" cy="7" r="4"/><path d="M5 21v-2a4 4 0 0 1 8 0v2"/><path d="M13 21v-2a4 4 0 0 1 8 0v2"/>',
        label: 'Equipas',
        href: 'equipas_Professor.html'
      },
      {
        id: 'premios',
        icon: '<path d="M8 2h8v4H8z"/><path d="M6 6h12v2a5 5 0 0 1-5 5H11a5 5 0 0 1-5-5V6z"/><path d="M9 18h6"/><path d="M12 14v4"/>',
        label: 'Prémios',
        href: 'premios_Professor.html'
      },
      {
        id: 'rankings',
        icon: '<line x1="4" y1="20" x2="4" y2="14"/><line x1="9" y1="20" x2="9" y2="10"/><line x1="14" y1="20" x2="14" y2="16"/><line x1="19" y1="20" x2="19" y2="8"/>',
        label: 'Rankings',
        href: 'ranking_Professor.html'
      },
      {
        id: 'notificacoes',
        icon: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>',
        label: 'Notificações',
        href: 'notificacoes_Professor.html',
        badge: '2'
      }
    ]
  };

  // Gerar HTML do sidebar
  const sidebarHTML = `
    <aside class="sidebar">
      <div class="logo">
        <div class="logo-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2">
            <circle cx="12" cy="8" r="4"/>
            <path d="M8 14l-2 6 6-3 6 3-2-6"/>
          </svg>
        </div>
        <h2>EduScrum Awards</h2>
      </div>

      <hr class="divider">

      <div class="user-info">
        <div class="user-top">
          <!-- Avatar será inserido aqui dinamicamente -->
        </div>
        ${userType === 'estudante' ? `
        <div class="user-points">
          <span class="label">Pontos:</span>
          <div class="points-box">
            <strong>${userData.pontos || 0}</strong>
          </div>
        </div>
        ` : ''}
      </div>

      <hr class="divider">

      <nav class="menu">
        <ul>
          ${menuItems[userType].map(item => `
            <li${item.id === activePage ? ' class="active"' : ''}>
              <a href="${item.href}">
                <svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  ${item.icon}
                </svg>
                <span>${item.label}</span>
                ${item.badge ? `<span class="badge">${item.badge}</span>` : ''}
              </a>
            </li>
          `).join('')}
        </ul>
      </nav>

      <div class="bottom-menu">
        <ul>
          <li>
            <svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="3"/>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9c0 .69.28 1.36.77 1.85.49.49 1.16.77 1.85.77h.09a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
            </svg>
            Definições
          </li>
          <li>
            <svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Sair
          </li>
        </ul>
      </div>
    </aside>
  `;

  // Inserir sidebar no DOM
  const container = document.querySelector('.container');
  if (container) {
    container.insertAdjacentHTML('afterbegin', sidebarHTML);
  }

  // Carregar perfil do usuário
  carregarPerfilSidebar(userData, userType);
}

// =========================
//  CARREGAR PERFIL SIDEBAR
// =========================
function carregarPerfilSidebar(userData, userType) {
  const userTop = document.querySelector('.sidebar .user-top');
  if (!userTop) return;

  // Limpar conteúdo existente
  userTop.innerHTML = '';

  // Criar avatar ou imagem
  if (userData.foto) {
    const img = document.createElement('img');
    img.src = userData.foto;
    img.alt = 'Foto de perfil';
    img.style.cssText = 'width: 50px; height: 50px; border-radius: 50%; border: 2px solid #3498db; object-fit: cover;';
    userTop.appendChild(img);
  } else {
    const avatar = document.createElement('div');
    avatar.className = 'avatar-placeholder';
    avatar.style.cssText = `
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 20px;
      font-weight: bold;
      border: 2px solid #3498db;
    `;
    avatar.textContent = (userData.nome || 'U')[0].toUpperCase();
    userTop.appendChild(avatar);
  }

  // Criar detalhes do usuário
  const userDetails = document.createElement('div');
  userDetails.className = 'user-details';
  userDetails.innerHTML = `
    <h3>${userData.nome || 'Usuário'}</h3>
    <p>${userType === 'estudante' ? 'Estudante' : 'Docente'}</p>
  `;
  userTop.appendChild(userDetails);
}

