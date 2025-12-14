// =========================
//  VARIÁVEIS GLOBAIS
// =========================
let userData = null;
let teacherId = null;
let cursoEditando = null;

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

  carregarCursos();
  configurarFormularioModal();
  configurarBotaoSair();
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
//  CARREGAR CURSOS
// =========================
async function carregarCursos() {
  if (!teacherId) return;

  try {
    const res = await fetch(`/cursos/professor/${teacherId}`);
    const text = await res.text();

    let data;
    try { 
      data = JSON.parse(text); 
    } catch (err) { 
      console.error('Resposta inválida:', text);
      alert('Erro ao carregar cursos');
      return;
    }

    if (data.success) {
      renderizarCursos(data.cursos);
    } else {
      alert(data.error || 'Erro ao carregar cursos');
    }
  } catch (err) {
    console.error(err);
    alert('Erro ao carregar cursos');
  }
}

// =========================
//  RENDERIZAR CURSOS
// =========================
function renderizarCursos(cursos) {
  const tbody = document.querySelector('.courses-table tbody');
  if (!tbody) return;

  if (!cursos || cursos.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" style="text-align:center; padding:40px; color:#999;">
          Nenhum curso criado ainda. Clique em "+ Novo Curso" para começar.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = cursos.map(curso => `
    <tr data-curso-id="${curso.id}">
      <td><strong>${curso.nome}</strong></td>
      <td>${curso.descricao || '-'}</td>
      <td>👥 ${curso.totalEstudantes || 0}</td>
      <td><span class="date-badge">${curso.criadoEm || 'N/A'}</span></td>
      <td>
        <button class="ver-projetos-btn" onclick="verCadeiras(${curso.id})">Ver Cadeiras</button>
        <button class="editar-btn" onclick="editarCurso(${curso.id})">✏️</button>
        <button class="apagar-btn" onclick="apagarCurso(${curso.id})">🗑️</button>
      </td>
    </tr>
  `).join('');
}

// =========================
//  MODAL
// =========================
function abrirModal() {
  cursoEditando = null;
  const modal = document.getElementById('modalCriarCurso');
  if (!modal) return;

  modal.classList.add('ativo');
  document.body.style.overflow = 'hidden';

  const form = modal.querySelector('form');
  if (form) form.reset();

  const title = modal.querySelector('h2');
  if (title) title.textContent = 'Criar Novo Curso';

  const btnCriar = modal.querySelector('.btn.criar');
  if (btnCriar) btnCriar.textContent = 'Criar';
}

function fecharModal() {
  const modal = document.getElementById('modalCriarCurso');
  if (!modal) return;
  modal.classList.remove('ativo');
  document.body.style.overflow = '';
  cursoEditando = null;
}

// =========================
//  CONFIGURAR FORMULÁRIO MODAL
// =========================
function configurarFormularioModal() {
  const form = document.querySelector('.modal form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const nome = form.querySelector('input[type="text"]').value.trim();
    const descricao = form.querySelector('textarea').value.trim();

    if (!nome || !descricao) {
      alert('Preencha todos os campos do curso.');
      return;
    }

    if (cursoEditando) {
      await atualizarCurso(cursoEditando, nome, descricao);
    } else {
      await criarCurso(nome, descricao);
    }
  });
}

// =========================
//  CRUD - CRIAR
// =========================
async function criarCurso(nome, descricao) {
  try {
    const res = await fetch('/cursos', {
      method: 'POST',
      headers: { 'Content-Type':'application/json' },
      body: JSON.stringify({ nome, descricao, professorId: teacherId })
    });

    const text = await res.text();
    let data;
    try { 
      data = JSON.parse(text); 
    } catch { 
      alert('Erro: resposta inválida do servidor'); 
      return; 
    }

    if (data.success) {
      alert('✅ Curso criado com sucesso!');
      fecharModal();
      carregarCursos();
    } else {
      alert(data.error || 'Erro ao criar curso');
    }
  } catch (err) {
    console.error(err);
    alert('Erro ao criar curso');
  }
}

// =========================
//  CRUD - EDITAR
// =========================
async function editarCurso(cursoId) {
  try {
    const res = await fetch(`/cursos/${cursoId}`);
    const text = await res.text();
    let data;
    try { 
      data = JSON.parse(text); 
    } catch { 
      alert('Erro: resposta inválida'); 
      return; 
    }

    if (!data.success) { 
      alert('Erro ao carregar curso'); 
      return; 
    }

    const curso = data.curso;
    cursoEditando = cursoId;

    const modal = document.getElementById('modalCriarCurso');
    if (!modal) return;

    const form = modal.querySelector('form');
    form.querySelector('input[type="text"]').value = curso.nome;
    form.querySelector('textarea').value = curso.descricao;

    modal.querySelector('h2').textContent = 'Editar Curso';
    modal.querySelector('.btn.criar').textContent = 'Salvar';

    modal.classList.add('ativo');
    document.body.style.overflow = 'hidden';
  } catch (err) {
    console.error(err);
    alert('Erro ao carregar curso');
  }
}

// =========================
//  CRUD - ATUALIZAR
// =========================
async function atualizarCurso(cursoId, nome, descricao) {
  try {
    const res = await fetch(`/cursos/${cursoId}`, {
      method: 'PUT',
      headers: { 'Content-Type':'application/json' },
      body: JSON.stringify({ nome, descricao, professorId: teacherId })
    });

    const text = await res.text();
    let data;
    try { 
      data = JSON.parse(text); 
    } catch { 
      alert('Erro: resposta inválida'); 
      return; 
    }

    if (data.success) {
      alert('✅ Curso atualizado com sucesso!');
      fecharModal();
      carregarCursos();
    } else {
      alert(data.error || 'Erro ao atualizar curso');
    }
  } catch (err) {
    console.error(err);
    alert('Erro ao atualizar curso');
  }
}

// =========================
//  CRUD - APAGAR
// =========================
async function apagarCurso(cursoId) {
  if (!confirm('Tem certeza que deseja apagar este curso?')) return;

  try {
    const res = await fetch(`/cursos/${cursoId}`, {
      method: 'DELETE',
      headers: { 'Content-Type':'application/json' },
      body: JSON.stringify({ professorId: teacherId })
    });

    const text = await res.text();
    let data;
    try { 
      data = JSON.parse(text); 
    } catch { 
      alert('Erro: resposta inválida'); 
      return; 
    }

    if (data.success) {
      alert('✅ Curso apagado com sucesso!');
      carregarCursos();
    } else {
      alert(data.error || 'Erro ao apagar curso');
    }
  } catch (err) {
    console.error(err);
    alert('Erro ao apagar curso');
  }
}

// =========================
//  VER CADEIRAS
// =========================
function verCadeiras(cursoId) {
  localStorage.setItem('cursoAtual', cursoId);
  window.location.href = 'cadeiras_Professor.html';
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
          window.location.href = '/login';
        }
      });
    }
  }, 100);
}