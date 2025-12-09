// frontend/javascript/curso_Professor.js

let teacherId = null;
let cursoEditandoId = null;

document.addEventListener('DOMContentLoaded', () => {
  inicializar();
  carregarDadosUsuario();
  configurarBotaoSair();
});

// ==================== INICIALIZAR ====================
function inicializar() {
  const userStr = localStorage.getItem('user');
  
  if (!userStr) {
    window.location.href = '/login';
    return;
  }
  
  const user = JSON.parse(userStr);
  
  if (user.tipo !== 'docente') {
    alert('Acesso negado. Apenas professores podem aceder a esta página.');
    window.location.href = '/login';
    return;
  }
  
  teacherId = user.teacherId;
  carregarCursos();
  configurarFormulario();
}

// ==================== CARREGAR DADOS DO USUÁRIO (SIDEBAR) ====================
function carregarDadosUsuario() {
  const userStr = localStorage.getItem('user');
  if (!userStr) return;
  
  const user = JSON.parse(userStr);
  
  // Atualiza nome na sidebar
  const nomeElements = document.querySelectorAll('.user-details h3');
  nomeElements.forEach(el => {
    el.textContent = user.nome || 'Professor';
  });
  
  // Atualiza tipo
  const tipoElements = document.querySelectorAll('.user-details p');
  tipoElements.forEach(el => {
    el.textContent = user.tipo === 'docente' ? 'Docente' : 'Estudante';
  });
  
  // Remove imagem e cria avatar
  const imgElements = document.querySelectorAll('.user-info img');
  imgElements.forEach(imgElement => {
    const inicial = (user.nome || 'P')[0].toUpperCase();
    imgElement.style.display = 'none';
    
    const existingAvatar = imgElement.parentNode.querySelector('.avatar-inicial');
    if (!existingAvatar) {
      const avatar = document.createElement('div');
      avatar.className = 'avatar-inicial';
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
        flex-shrink: 0;
      `;
      avatar.textContent = inicial;
      imgElement.parentNode.insertBefore(avatar, imgElement);
    }
  });
}

// ==================== CARREGAR CURSOS ====================
async function carregarCursos() {
  try {
    const response = await fetch(`/cursos/list/${teacherId}`);
    const data = await response.json();
    
    if (data.success) {
      renderizarCursos(data.cursos);
    } else {
      console.error('Erro ao carregar cursos');
    }
  } catch (err) {
    console.error('❌ Erro:', err);
    alert('Erro ao carregar cursos');
  }
}

// ==================== RENDERIZAR TABELA ====================
function renderizarCursos(cursos) {
  const tbody = document.querySelector('.courses-table tbody');
  
  if (cursos.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" style="text-align: center; padding: 2rem; color: #666;">
          Nenhum curso criado ainda. Clique em "+ Novo Curso" para começar.
        </td>
      </tr>
    `;
    return;
  }
  
  tbody.innerHTML = cursos.map(curso => `
    <tr>
      <td>${curso.nome}</td>
      <td>${curso.descricao || 'Sem descrição'}</td>
      <td>👥 ${curso.num_estudantes || 0}</td>
      <td><span class="date-badge">${curso.criado_em || 'N/A'}</span></td>
      <td>
        <button class="ver-projetos-btn" onclick="verCadeiras(${curso.id})">Ver Cadeiras</button>
        <button class="editar-btn" onclick="editarCurso(${curso.id})">✏️</button>
        <button class="apagar-btn" onclick="apagarCurso(${curso.id})">🗑️</button>
      </td>
    </tr>
  `).join('');
}

// ==================== ABRIR/FECHAR MODAL ====================
function abrirModal() {
  cursoEditandoId = null;
  document.querySelector('.modal h2').textContent = 'Criar Novo Curso';
  document.querySelector('form').reset();
  document.getElementById('modalCriarCurso').classList.add('ativo');
  document.body.style.overflow = 'hidden';
}

function fecharModal() {
  document.getElementById('modalCriarCurso').classList.remove('ativo');
  document.body.style.overflow = '';
  cursoEditandoId = null;
}

// ==================== CONFIGURAR FORMULÁRIO ====================
function configurarFormulario() {
  const form = document.querySelector('.modal form');
  
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const nome = form.querySelector('input[type="text"]').value.trim();
    const descricao = form.querySelector('textarea').value.trim();
    
    if (!nome) {
      alert('Por favor, preencha o nome do curso');
      return;
    }
    
    try {
      let response;
      
      if (cursoEditandoId) {
        // EDITAR
        response = await fetch(`/cursos/update/${cursoEditandoId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nome, descricao })
        });
      } else {
        // CRIAR
        response = await fetch('/cursos/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nome, descricao, teacherId })
        });
      }
      
      const data = await response.json();
      
      if (data.success) {
        alert(data.message);
        fecharModal();
        carregarCursos();
      } else {
        alert(data.error || 'Erro ao salvar curso');
      }
    } catch (err) {
      console.error('❌ Erro:', err);
      alert('Erro ao salvar curso');
    }
  });
}

// ==================== EDITAR CURSO ====================
async function editarCurso(id) {
  try {
    const response = await fetch(`/cursos/${id}`);
    const data = await response.json();
    
    if (data.success) {
      cursoEditandoId = id;
      document.querySelector('.modal h2').textContent = 'Editar Curso';
      document.querySelector('input[type="text"]').value = data.curso.nome;
      document.querySelector('textarea').value = data.curso.descricao || '';
      document.getElementById('modalCriarCurso').classList.add('ativo');
      document.body.style.overflow = 'hidden';
    }
  } catch (err) {
    console.error('❌ Erro:', err);
    alert('Erro ao carregar dados do curso');
  }
}

// ==================== APAGAR CURSO ====================
async function apagarCurso(id) {
  if (!confirm('Tem certeza que deseja apagar este curso? Esta ação não pode ser desfeita.')) {
    return;
  }
  
  try {
    const response = await fetch(`/cursos/delete/${id}`, {
      method: 'DELETE'
    });
    
    const data = await response.json();
    
    if (data.success) {
      alert(data.message);
      carregarCursos();
    } else {
      alert(data.error || 'Erro ao apagar curso');
    }
  } catch (err) {
    console.error('❌ Erro:', err);
    alert('Erro ao apagar curso');
  }
}

// ==================== VER CADEIRAS ====================
function verCadeiras(cursoId) {
  localStorage.setItem('cursoSelecionado', cursoId);
  window.location.href = 'cadeiras_Professor.html';
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