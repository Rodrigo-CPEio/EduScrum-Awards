// =========================
//  VARIÁVEIS GLOBAIS
// =========================
let userData = null;
let teacherId = null;

// =========================
//  INICIALIZAÇÃO
// =========================
document.addEventListener('DOMContentLoaded', () => {
  if (!verificarAutenticacao()) return;
  carregarPerfilSidebar();
  carregarDashboardData();
  configurarBotaoSair();
  animarGraficos();
});

// =========================
//  AUTENTICAÇÃO
// =========================
function verificarAutenticacao() {
  const userStr = localStorage.getItem('user');
  if (!userStr) {
    window.location.href = '/login';
    return false;
  }

  const user = JSON.parse(userStr);
  if (user.tipo !== 'docente') {
    alert('Acesso negado. Apenas professores podem acessar esta página.');
    window.location.href = '/login';
    return false;
  }

  userData = user;
  teacherId = user.teacherId;
  return true;
}

// =========================
//  CARREGAR SIDEBAR
// =========================
function carregarPerfilSidebar() {
  const sidebarUserInfo = document.querySelector('.sidebar .user-info');
  if (!sidebarUserInfo) return;

  // Criar estrutura se não existir
  let userDetails = sidebarUserInfo.querySelector('.user-details');
  if (!userDetails) {
    userDetails = document.createElement('div');
    userDetails.className = 'user-details';
    userDetails.innerHTML = '<h3></h3><p></p>';
    sidebarUserInfo.appendChild(userDetails);
  }

  // Criar avatar
  let img = sidebarUserInfo.querySelector('img');
  let avatar = sidebarUserInfo.querySelector('.avatar-placeholder');

  if (avatar) avatar.remove();

  if (!img) {
    img = document.createElement('img');
    img.alt = 'Foto de perfil';
    img.style.cssText = 'width: 55px; height: 55px; border-radius: 50%; object-fit: cover;';
    sidebarUserInfo.insertBefore(img, userDetails);
  }

  if (userData.foto) {
    img.src = userData.foto;
    img.style.display = 'block';
  } else {
    img.style.display = 'none';
    avatar = document.createElement('div');
    avatar.className = 'avatar-placeholder';
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
    avatar.textContent = (userData.nome || 'U')[0].toUpperCase();
    sidebarUserInfo.insertBefore(avatar, img);
  }

  const nameEl = userDetails.querySelector('h3');
  const typeEl = userDetails.querySelector('p');
  if (nameEl) nameEl.textContent = userData.nome;
  if (typeEl) typeEl.textContent = 'Docente';
}

// =========================
//  CARREGAR DADOS DO DASHBOARD
// =========================
async function carregarDashboardData() {
  if (!teacherId) return;

  try {
    // Buscar equipas
    const resTeams = await fetch('http://localhost:3000/api/teams');
    const teams = await resTeams.json();

    // Buscar cursos do professor
    const resCursos = await fetch(`/cursos/professor/${teacherId}`);
    const dataCursos = await resCursos.json();
    
    let totalCursos = 0;
    if (dataCursos.success && dataCursos.cursos) {
      totalCursos = dataCursos.cursos.length;
    }

    // Atualizar cards
    criarCardsClicaveis(teams, totalCursos);

  } catch (err) {
    console.error('Erro ao carregar dados do dashboard:', err);
    // Criar cards com valores padrão em caso de erro
    criarCardsClicaveis([], 0);
  }
}

// =========================
//  CRIAR CARDS CLICÁVEIS
// =========================
function criarCardsClicaveis(teams, totalCursos) {
  // Procurar onde inserir os cards (antes dos gráficos)
  const chartsGrid = document.querySelector('.charts-grid');
  if (!chartsGrid) return;

  // Verificar se já existe a seção de cards
  let cardsSection = document.querySelector('.cards-section');
  
  if (cardsSection) {
    cardsSection.remove();
  }

  // Criar nova seção de cards
  cardsSection = document.createElement('section');
  cardsSection.className = 'cards-section';

  // Contar total de membros
  const totalMembros = teams.reduce((sum, team) => sum + (team.members?.length || 0), 0);

  cardsSection.innerHTML = `
    <div class="info-card clickable" onclick="window.location.href='equipas_Professor.html'">
      <div class="info-icon">👥</div>
      <h4>Equipas</h4>
      <p class="info-number">${teams.length}</p>
      <p class="info-detail">${totalMembros} membros no total</p>
      <span class="info-arrow">→</span>
    </div>

    <div class="info-card clickable" onclick="window.location.href='curso_Professor.html'">
      <div class="info-icon">📚</div>
      <h4>Cursos</h4>
      <p class="info-number">${totalCursos}</p>
      <p class="info-detail">Lecionados por si</p>
      <span class="info-arrow">→</span>
    </div>

    <div class="info-card clickable" onclick="window.location.href='premios_Professor.html'">
      <div class="info-icon">🏆</div>
      <h4>Recompensas</h4>
      <p class="info-number">0</p>
      <p class="info-detail">Prémios atribuídos</p>
      <span class="info-arrow">→</span>
    </div>
  `;

  // Inserir ANTES dos gráficos
  chartsGrid.parentNode.insertBefore(cardsSection, chartsGrid);

  // Adicionar efeito hover nos cards
  document.querySelectorAll('.info-card.clickable').forEach(card => {
    card.style.cursor = 'pointer';
    card.style.transition = 'transform 0.2s, box-shadow 0.2s';
    
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-5px)';
      card.style.boxShadow = '0 8px 20px rgba(0,0,0,0.15)';
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0)';
      card.style.boxShadow = '';
    });
  });
}

// =========================
//  ANIMAÇÃO DOS GRÁFICOS
// =========================
function animarGraficos() {
  // Animar barras
  document.querySelectorAll('.bar').forEach((el) => {
    const h = el.style.height;
    el.style.height = '6px';
    setTimeout(() => {
      el.style.transition = 'height 0.8s ease';
      el.style.height = h;
    }, 150);
  });

  // Animar linha SVG
  const line = document.querySelector('.chart-line svg .line');
  if (line) {
    const length = line.getTotalLength();
    line.style.strokeDasharray = length;
    line.style.strokeDashoffset = length;
    setTimeout(() => {
      line.style.transition = 'stroke-dashoffset 1s ease';
      line.style.strokeDashoffset = '0';
    }, 200);
  }
}

// =========================
//  BOTÃO SAIR
// =========================
function configurarBotaoSair() {
  const botaoSair = document.querySelector('.bottom-menu li:last-child a, .bottom-menu li:last-child');
  if (botaoSair) {
    botaoSair.style.cursor = 'pointer';
    botaoSair.addEventListener('click', (e) => {
      e.preventDefault();
      if (confirm('Tem certeza que deseja sair?')) {
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    });
  }
}