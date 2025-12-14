// =========================
//  VARIÁVEIS GLOBAIS
// =========================
let userData = null;
let teacherId = null;
let disciplineId = null;
let sprintEditando = null;
let projetoEditando = null;

// =========================
//  INICIALIZAÇÃO
// =========================
document.addEventListener('DOMContentLoaded', () => {
  if (!verificarAutenticacao()) return;

  // Inicializar sidebar
  inicializarSidebar({
    userType: 'professor',
    activePage: 'cursos',
    userData: {
      nome: userData.nome,
      foto: userData.foto || null
    }
  });

  obterDisciplinaId();
  carregarInfoDisciplina();
  carregarProjetos();
  configurarEventos();
  configurarBotaoSair();
});

// =========================
//  AUTENTICAÇÃO
// =========================
function verificarAutenticacao() {
  const userStr = localStorage.getItem('user');
  if (!userStr) {
    window.location.href = 'login.html';
    return false;
  }

  const user = JSON.parse(userStr);
  if (user.tipo !== 'docente') {
    alert('Acesso negado. Apenas professores podem acessar esta página.');
    window.location.href = 'login.html';
    return false;
  }

  userData = user;
  teacherId = user.teacherId;
  return true;
}

// =========================
//  OBTER ID DA DISCIPLINA
// =========================
function obterDisciplinaId() {
  // Primeiro tenta pegar da URL
  const urlParams = new URLSearchParams(window.location.search);
  disciplineId = urlParams.get('disciplineId');
  
  // Se não estiver na URL, tenta pegar do localStorage
  if (!disciplineId) {
    disciplineId = localStorage.getItem('cadeiraAtual');
  }
  
  if (!disciplineId) {
    alert('Disciplina não identificada!');
    window.location.href = 'cadeiras_Professor.html';
    return false;
  }
  
  return true;
}

// =========================
//  CARREGAR INFO DA DISCIPLINA
// =========================
async function carregarInfoDisciplina() {
  if (!disciplineId) return;

  try {
    const res = await fetch(`http://localhost:3000/cadeiras/${disciplineId}`);
    const text = await res.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch (err) {
      console.error('Erro ao parsear info da disciplina:', text);
      return;
    }

    if (data.success && data.cadeira) {
      const disciplina = data.cadeira;
      
      // Atualizar header
      const nomeEl = document.getElementById('disciplinaNome');
      const descEl = document.getElementById('disciplinaDescricao');
      
      if (nomeEl) nomeEl.textContent = disciplina.nome || 'Disciplina';
      if (descEl) descEl.textContent = disciplina.descricao || '';
    }
  } catch (err) {
    console.error('Erro ao carregar info da disciplina:', err);
  }
}

// =========================
//  CONFIGURAR EVENTOS
// =========================
function configurarEventos() {
  // Botão voltar
  const btnVoltar = document.getElementById('btnVoltar');
  if (btnVoltar) {
    btnVoltar.addEventListener('click', () => {
      window.location.href = 'cadeiras_Professor.html';
    });
  }

  // Botão novo projeto
  const btnNovoProjeto = document.getElementById('btnNovoProjeto');
  if (btnNovoProjeto) {
    btnNovoProjeto.addEventListener('click', abrirModalProjeto);
  }

  // Fechar modals
  document.querySelectorAll('[data-close]').forEach(btn => {
    btn.addEventListener('click', fecharModals);
  });

  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) fecharModals();
    });
  });

  // Formulário criar projeto
  const formProjeto = document.getElementById('formNovoProjeto');
  if (formProjeto) {
    formProjeto.addEventListener('submit', handleSubmitProjeto);
  }

  // Formulário criar sprint
  const formSprint = document.getElementById('formNovoSprint');
  if (formSprint) {
    formSprint.addEventListener('submit', handleSubmitSprint);
  }

  // Delegação de eventos para botões dinâmicos
  const projetosContainer = document.getElementById('projetosContainer');
  if (projetosContainer) {
    projetosContainer.addEventListener('click', handleClickProjetos);
  }
}

// =========================
//  CARREGAR PROJETOS
// =========================
async function carregarProjetos() {
  if (!disciplineId) return;

  try {
    // Limpar container primeiro para evitar conflitos
    const container = document.getElementById('projetosContainer');
    if (container) {
      container.innerHTML = '<div style="text-align: center; padding: 20px;">Carregando...</div>';
    }

    const res = await fetch(`http://localhost:3000/projetos/disciplina/${disciplineId}`);
    const text = await res.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch (err) {
      console.error('Resposta inválida:', text);
      alert('Erro ao carregar projetos');
      return;
    }

    renderizarProjetos(data);
    atualizarContadores(data);
  } catch (err) {
    console.error('Erro ao carregar projetos:', err);
    alert('Erro ao carregar projetos');
  }
}

// =========================
//  ATUALIZAR CONTADORES
// =========================
function atualizarContadores(projetos) {
  const totalProjetosEl = document.getElementById('totalProjetos');
  const totalEstudantesEl = document.getElementById('totalEstudantes');
  const totalEquipasEl = document.getElementById('totalEquipas');

  if (totalProjetosEl) {
    totalProjetosEl.textContent = projetos.length || 0;
  }

  // Calcular totais de estudantes e equipas
  let totalEstudantes = 0;
  let totalEquipas = 0;

  projetos.forEach(projeto => {
    totalEstudantes += projeto.total_students || 0;
    totalEquipas += projeto.total_teams || 0;
  });

  if (totalEstudantesEl) totalEstudantesEl.textContent = totalEstudantes;
  if (totalEquipasEl) totalEquipasEl.textContent = totalEquipas;
}

// =========================
//  RENDERIZAR PROJETOS
// =========================
function renderizarProjetos(projetos) {
  const container = document.getElementById('projetosContainer');
  if (!container) return;

  if (!projetos || projetos.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 40px; color: #666;">
        <p>Nenhum projeto encontrado. Crie o primeiro projeto!</p>
      </div>
    `;
    return;
  }

  container.innerHTML = '';

  projetos.forEach(projeto => {
    const card = criarCardProjeto(projeto);
    container.appendChild(card);
    carregarSprints(projeto.P_ID);
  });
}

// =========================
//  CRIAR CARD PROJETO
// =========================
function criarCardProjeto(projeto) {
  const div = document.createElement('div');
  div.className = 'project-card';
  div.dataset.projectId = projeto.P_ID;

  const totalSprints = projeto.total_sprints || 0;
  const completedSprints = projeto.completed_sprints || 0;
  const progress = totalSprints > 0 ? (completedSprints / totalSprints) * 100 : 0;

  div.innerHTML = `
    <div class="project-header">
      <div class="header-top">
        <h3>${escapeHtml(projeto.P_Name)} 
          <span class="status ${projeto.P_Status}">${getStatusLabel(projeto.P_Status)}</span>
        </h3>
        <div class="actions">
          <button class="btn-ico btn-edit-project" data-project-id="${projeto.P_ID}">✎</button>
          <button class="btn-ico btn-delete-project" data-project-id="${projeto.P_ID}">🗑</button>
        </div>
      </div>
      <p>${escapeHtml(projeto.P_Description)}</p>
    </div>
    
    <div class="datas">
      <p>📅 <strong>Início:</strong> ${formatarData(projeto.P_Start_Date)}</p>
      <p>📅 <strong>Fim:</strong> ${formatarData(projeto.P_End_Date)}</p>
    </div>
    
    <div class="progress-wrapper">
      <p class="progress-label">Progresso</p>
      <div class="progress-bar">
        <div class="progress" style="width: ${progress}%;"></div>
      </div>
      <p class="progress-text">${completedSprints}/${totalSprints} sprints</p>
    </div>
    
    <div class="sprints">
      <div class="sprint-header">
        <h4>🌀 Sprints (<span class="sprint-count">0</span>)</h4>
        <button class="btn-sprint btn-add-sprint" data-project-id="${projeto.P_ID}">+ Sprint</button>
      </div>
      <div class="sprints-list" data-project-id="${projeto.P_ID}"></div>
    </div>
  `;

  return div;
}

// =========================
//  CARREGAR SPRINTS
// =========================
async function carregarSprints(projectId) {
  try {
    const res = await fetch(`http://localhost:3000/projetos/${projectId}/sprints`);
    
    // Verificar se o projeto ainda existe (status 404 = projeto foi apagado)
    if (res.status === 404) {
      console.log(`Projeto ${projectId} não existe mais, ignorando...`);
      return;
    }

    const text = await res.text();

    let sprints;
    try {
      sprints = JSON.parse(text);
    } catch (err) {
      console.error('Erro ao parsear sprints:', text);
      return;
    }

    renderizarSprints(projectId, sprints);
  } catch (err) {
    console.error('Erro ao carregar sprints:', err);
  }
}

// =========================
//  RENDERIZAR SPRINTS
// =========================
function renderizarSprints(projectId, sprints) {
  const sprintsList = document.querySelector(`.sprints-list[data-project-id="${projectId}"]`);
  const sprintCount = document.querySelector(`[data-project-id="${projectId}"] .sprint-count`);
  
  if (!sprintsList) return;

  sprintsList.innerHTML = '';

  if (sprintCount) {
    sprintCount.textContent = sprints.length;
  }

  sprints.forEach(sprint => {
    const card = criarCardSprint(sprint);
    sprintsList.appendChild(card);
  });
}

// =========================
//  CRIAR CARD SPRINT
// =========================
function criarCardSprint(sprint) {
  const div = document.createElement('div');
  const status = sprint.calculated_status || sprint.SP_Status || 'em-espera';
  div.className = `sprint ${status}`;
  div.dataset.sprintId = sprint.SP_ID;

  div.innerHTML = `
    <p>
      <strong>${escapeHtml(sprint.SP_Name || 'Sprint sem nome')}</strong> 
      <span class="badge ${status}">${getStatusLabel(status)}</span>
    </p>
    <p>${formatarData(sprint.SP_Start_Date)} - ${formatarData(sprint.SP_End_Date)}</p>
    <p>${sprint.SP_Objectives || 0} objetivos</p>
    <button class="btn-ico btn-delete-sprint" data-sprint-id="${sprint.SP_ID}">🗑</button>
  `;

  return div;
}

// =========================
//  HANDLE CLICKS
// =========================
function handleClickProjetos(e) {
  // Adicionar sprint
  if (e.target.closest('.btn-add-sprint')) {
    const projectId = e.target.closest('.btn-add-sprint').dataset.projectId;
    abrirModalSprint(projectId);
    return;
  }

  // Editar projeto
  if (e.target.closest('.btn-edit-project')) {
    const projectId = e.target.closest('.btn-edit-project').dataset.projectId;
    editarProjeto(projectId);
    return;
  }

  // Deletar sprint
  if (e.target.closest('.btn-delete-sprint')) {
    const sprintId = e.target.closest('.btn-delete-sprint').dataset.sprintId;
    if (confirm('Tem certeza que deseja deletar este sprint?')) {
      apagarSprint(sprintId);
    }
    return;
  }

  // Deletar projeto
  if (e.target.closest('.btn-delete-project')) {
    const projectId = e.target.closest('.btn-delete-project').dataset.projectId;
    if (confirm('Tem certeza que deseja deletar este projeto? Todos os sprints serão removidos!')) {
      apagarProjeto(projectId);
    }
    return;
  }
}

// =========================
//  MODALS
// =========================
function abrirModalProjeto() {
  projetoEditando = null;
  const modal = document.getElementById('modalNovoProjeto');
  if (!modal) return;

  modal.classList.add('ativo');
  document.body.style.overflow = 'hidden';

  const form = modal.querySelector('form');
  if (form) form.reset();

  // Atualizar título e botão
  const titulo = modal.querySelector('h2');
  const btnSubmit = modal.querySelector('.btn.criar');
  
  if (titulo) titulo.textContent = 'Criar Novo Projeto';
  if (btnSubmit) btnSubmit.textContent = 'Criar';
}

function abrirModalSprint(projectId) {
  sprintEditando = projectId;
  
  const modal = document.getElementById('modalNovoSprint');
  if (!modal) return;

  modal.classList.add('ativo');
  document.body.style.overflow = 'hidden';

  const form = modal.querySelector('form');
  if (form) form.reset();
}

function fecharModals() {
  document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.classList.remove('ativo');
  });
  document.body.style.overflow = '';
  sprintEditando = null;
  projetoEditando = null;
}

// =========================
//  SUBMIT HANDLERS
// =========================
async function handleSubmitProjeto(e) {
  e.preventDefault();

  const nome = document.getElementById('projNome').value.trim();
  const descricao = document.getElementById('projDesc').value.trim();
  const inicio = document.getElementById('projInicio').value;
  const fim = document.getElementById('projFim').value;

  if (!nome || !descricao || !inicio || !fim) {
    alert('Preencha todos os campos do projeto.');
    return;
  }

  if (projetoEditando) {
    await atualizarProjeto(projetoEditando, nome, descricao, inicio, fim);
  } else {
    await criarProjeto(nome, descricao, inicio, fim);
  }
}

async function handleSubmitSprint(e) {
  e.preventDefault();

  if (!sprintEditando) {
    alert('Projeto não identificado');
    return;
  }

  const nome = document.getElementById('sprintNome').value.trim();
  const inicio = document.getElementById('sprintInicio').value;
  const fim = document.getElementById('sprintFim').value;
  const objetivos = document.getElementById('sprintObjetivos').value;

  if (!nome || !inicio || !fim || !objetivos) {
    alert('Preencha todos os campos do sprint.');
    return;
  }

  await criarSprint(sprintEditando, nome, inicio, fim, objetivos);
}

// =========================
//  CRUD PROJETOS
// =========================
async function criarProjeto(nome, descricao, inicio, fim) {
  try {
    const res = await fetch('http://localhost:3000/projetos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: nome,
        description: descricao,
        startDate: inicio,
        endDate: fim,
        disciplineId: disciplineId
      })
    });

    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      alert('Erro: resposta inválida do servidor');
      return;
    }

    if (res.ok) {
      alert('✅ Projeto criado com sucesso!');
      fecharModals();
      carregarProjetos();
    } else {
      alert(data.message || 'Erro ao criar projeto');
    }
  } catch (err) {
    console.error('Erro ao criar projeto:', err);
    alert('Erro ao criar projeto');
  }
}

async function editarProjeto(projectId) {
  try {
    const res = await fetch(`http://localhost:3000/projetos/${projectId}`);
    const text = await res.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      alert('Erro: resposta inválida do servidor');
      return;
    }

    if (res.ok) {
      projetoEditando = projectId;

      const modal = document.getElementById('modalNovoProjeto');
      const form = modal.querySelector('form');

      // Preencher formulário
      document.getElementById('projNome').value = data.P_Name || '';
      document.getElementById('projDesc').value = data.P_Description || '';
      document.getElementById('projInicio').value = formatarDataParaInput(data.P_Start_Date);
      document.getElementById('projFim').value = formatarDataParaInput(data.P_End_Date);

      // Atualizar título e botão
      const titulo = modal.querySelector('h2');
      const btnSubmit = modal.querySelector('.btn.criar');
      
      if (titulo) titulo.textContent = 'Editar Projeto';
      if (btnSubmit) btnSubmit.textContent = 'Salvar';

      modal.classList.add('ativo');
      document.body.style.overflow = 'hidden';
    } else {
      alert('Erro ao carregar projeto');
    }
  } catch (err) {
    console.error('Erro ao carregar projeto:', err);
    alert('Erro ao carregar projeto');
  }
}

async function atualizarProjeto(projectId, nome, descricao, inicio, fim) {
  try {
    const res = await fetch(`http://localhost:3000/projetos/${projectId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: nome,
        description: descricao,
        startDate: inicio,
        endDate: fim,
        status: 'ativo'
      })
    });

    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      alert('Erro: resposta inválida do servidor');
      return;
    }

    if (res.ok) {
      alert('✅ Projeto atualizado com sucesso!');
      fecharModals();
      carregarProjetos();
    } else {
      alert(data.message || 'Erro ao atualizar projeto');
    }
  } catch (err) {
    console.error('Erro ao atualizar projeto:', err);
    alert('Erro ao atualizar projeto');
  }
}

async function apagarProjeto(projectId) {
  try {
    const res = await fetch(`http://localhost:3000/projetos/${projectId}`, {
      method: 'DELETE'
    });

    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      alert('Erro: resposta inválida');
      return;
    }

    if (res.ok) {
      alert('✅ Projeto deletado com sucesso!');
      carregarProjetos();
    } else {
      alert(data.message || 'Erro ao deletar projeto');
    }
  } catch (err) {
    console.error('Erro ao deletar projeto:', err);
    alert('Erro ao deletar projeto');
  }
}

// =========================
//  CRUD SPRINTS
// =========================
async function criarSprint(projectId, nome, inicio, fim, objetivos) {
  try {
    const res = await fetch(`http://localhost:3000/projetos/${projectId}/sprints`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        projectId: projectId,
        name: nome,
        startDate: inicio,
        endDate: fim,
        objectives: objetivos
      })
    });

    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      alert('Erro: resposta inválida do servidor');
      return;
    }

    if (res.ok) {
      alert('✅ Sprint criado com sucesso!');
      fecharModals();
      carregarSprints(projectId);
    } else {
      alert(data.message || 'Erro ao criar sprint');
    }
  } catch (err) {
    console.error('Erro ao criar sprint:', err);
    alert('Erro ao criar sprint');
  }
}

async function apagarSprint(sprintId) {
  try {
    const res = await fetch(`http://localhost:3000/projetos/sprints/${sprintId}`, {
      method: 'DELETE'
    });

    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      alert('Erro: resposta inválida');
      return;
    }

    if (res.ok) {
      alert('✅ Sprint deletado com sucesso!');
      
      // Recarregar sprints do projeto
      const sprintCard = document.querySelector(`[data-sprint-id="${sprintId}"]`);
      if (sprintCard) {
        const projectId = sprintCard.closest('.project-card').dataset.projectId;
        carregarSprints(projectId);
      }
    } else {
      alert(data.message || 'Erro ao deletar sprint');
    }
  } catch (err) {
    console.error('Erro ao deletar sprint:', err);
    alert('Erro ao deletar sprint');
  }
}

// =========================
//  UTILITÁRIOS
// =========================
function formatarData(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

function formatarDataParaInput(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function escapeHtml(text) {
  if (!text) return '';
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

function getStatusLabel(status) {
  const labels = {
    'ativo': 'Ativo',
    'concluido': 'Concluído',
    'em-espera': 'Em espera',
    'arquivado': 'Arquivado'
  };
  return labels[status] || status;
}

// =========================
//  BOTÃO SAIR
// =========================
function configurarBotaoSair() {
  setTimeout(() => {
    const botaoSair = document.querySelector('.bottom-menu li:last-child');
    if (botaoSair) {
      botaoSair.style.cursor = 'pointer';
      botaoSair.addEventListener('click', (e) => {
        e.preventDefault();
        if (confirm('Tem certeza que deseja sair?')) {
          localStorage.removeItem('user');
          window.location.href = 'login.html';
        }
      });
    }
  }, 100);
}
