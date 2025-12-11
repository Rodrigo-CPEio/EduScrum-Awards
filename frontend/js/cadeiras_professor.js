// ==================== VARIÁVEIS GLOBAIS ====================
let professorId = null;
let cadeiraEditando = null;
let cursoAtual = null;
let userData = null;

// ==================== AUTENTICAÇÃO ====================
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
  professorId = user.teacherId;
  return true;
}

// ==================== CARREGAR SIDEBAR ====================
function carregarPerfilSidebar() {
  const sidebarUserInfo = document.querySelector('.sidebar .user-info .user-top');
  if (!sidebarUserInfo) return;

  const img = sidebarUserInfo.querySelector('img');
  let avatar = sidebarUserInfo.querySelector('.avatar-placeholder');

  if (avatar) avatar.remove();

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

  sidebarUserInfo.insertBefore(avatar, img);

  if (userData.foto) {
    img.src = userData.foto;
    img.style.display = 'block';
    avatar.style.display = 'none';
  } else {
    img.style.display = 'none';
    avatar.style.display = 'flex';
    avatar.textContent = (userData.nome || 'U')[0].toUpperCase();
  }

  const nameEl = sidebarUserInfo.querySelector('.user-details h3');
  const typeEl = sidebarUserInfo.querySelector('.user-details p');

  if (nameEl) nameEl.textContent = userData.nome;
  if (typeEl) typeEl.textContent = 'Docente';
}

// ==================== DOM READY ====================
document.addEventListener('DOMContentLoaded', () => {
  if (!verificarAutenticacao()) return;

  carregarPerfilSidebar();

  cursoAtual = localStorage.getItem('cursoAtual');
  if (!cursoAtual) {
    alert('Curso não selecionado. Volte à página de cursos.');
    window.location.href = '/cursoP';
    return;
  }

  // Carregar o nome do curso
  carregarNomeCurso();
  carregarCadeiras();
  configurarFormulario();
});

// ==================== CARREGAR NOME DO CURSO ====================
async function carregarNomeCurso() {
  try {
    const response = await fetch(`/cursos/${cursoAtual}`);
    const data = await response.json();

    if (data.success && data.curso) {
      const tituloElement = document.querySelector('.courses-section h3');
      if (tituloElement) {
        tituloElement.textContent = `Cadeiras - ${data.curso.nome}`;
      }
    }
  } catch (error) {
    console.error('Erro ao carregar nome do curso:', error);
  }
}

// ==================== CARREGAR CADEIRAS ====================
async function carregarCadeiras() {
  try {
    const response = await fetch(`/cadeiras/curso/${cursoAtual}`);
    const data = await response.json();

    if (data.success) {
      renderizarCadeiras(data.cadeiras);
    } else {
      console.error('Erro ao carregar cadeiras:', data.error);
      mostrarMensagemVazia('Erro ao carregar cadeiras');
    }
  } catch (error) {
    console.error('Erro na requisição:', error);
    mostrarMensagemVazia('Erro de conexão com o servidor');
  }
}

// ==================== RENDERIZAR CADEIRAS ====================
function renderizarCadeiras(cadeiras) {
  const tbody = document.querySelector('.courses-table tbody');

  if (!cadeiras || cadeiras.length === 0) {
    mostrarMensagemVazia('Nenhuma cadeira criada ainda');
    return;
  }

  tbody.innerHTML = '';

  cadeiras.forEach(cadeira => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${cadeira.nome}</strong></td>
      <td>${cadeira.descricao || '-'}</td>
      <td>👥 ${cadeira.totalEstudantes || 0}</td>
      <td>
        <button class="ver-projetos-btn" onclick="verProjetos(${cadeira.id})">
          Ver Projetos
        </button>
        <button class="editar-btn" onclick="editarCadeira(${cadeira.id})" title="Editar">
          ✏️
        </button>
        <button class="apagar-btn" onclick="confirmarApagarCadeira(${cadeira.id}, '${cadeira.nome}')" title="Apagar">
          🗑️
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// ==================== MENSAGEM QUANDO VAZIO ====================
function mostrarMensagemVazia(mensagem) {
  const tbody = document.querySelector('.courses-table tbody');
  tbody.innerHTML = `
    <tr>
      <td colspan="4" style="text-align: center; padding: 40px; color: #666;">
        ${mensagem}
      </td>
    </tr>
  `;
}

// ==================== MODAL (CRIAR / EDITAR) ====================
function abrirModal() {
  cadeiraEditando = null;
  document.getElementById('modalCriarCadeira').classList.add('ativo');
  document.querySelector('#modalCriarCadeira h2').textContent = 'Criar Nova Cadeira';
  document.querySelector('#modalCriarCadeira form').reset();
  document.body.style.overflow = 'hidden';
}

function fecharModal() {
  document.getElementById('modalCriarCadeira').classList.remove('ativo');
  document.body.style.overflow = '';
  cadeiraEditando = null;
}

// ==================== FORMULÁRIO ====================
function configurarFormulario() {
  const form = document.querySelector('#modalCriarCadeira form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nome = form.querySelector('input[type="text"]').value.trim();
    const descricao = form.querySelector('textarea').value.trim();

    if (!nome || nome.length < 3) {
      alert('O nome da cadeira deve ter pelo menos 3 caracteres');
      return;
    }

    if (!descricao) {
      alert('A descrição da cadeira é obrigatória');
      return;
    }

    const btnSubmit = form.querySelector('.btn.criar');
    const textoOriginal = btnSubmit.textContent;
    btnSubmit.textContent = 'A guardar...';
    btnSubmit.disabled = true;

    try {
      let response;

      if (cadeiraEditando) {
        response = await fetch(`/cadeiras/${cadeiraEditando}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nome,
            descricao,
            professorId,
            cursoId: cursoAtual
          })
        });
      } else {
        response = await fetch('/cadeiras', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nome,
            descricao,
            professorId,
            cursoId: cursoAtual
          })
        });
      }

      const data = await response.json();

      if (data.success) {
        alert(data.message);
        fecharModal();
        carregarCadeiras();
      } else {
        alert('Erro: ' + data.error);
      }
    } catch (error) {
      console.error('Erro ao salvar cadeira:', error);
      alert('Erro de conexão com o servidor');
    } finally {
      btnSubmit.textContent = textoOriginal;
      btnSubmit.disabled = false;
    }
  });
}

// ==================== EDITAR ====================
async function editarCadeira(id) {
  try {
    const response = await fetch(`/cadeiras/${id}`);
    const data = await response.json();

    if (data.success) {
      cadeiraEditando = id;

      const form = document.querySelector('#modalCriarCadeira form');
      form.querySelector('input[type="text"]').value = data.cadeira.nome;
      form.querySelector('textarea').value = data.cadeira.descricao;

      document.querySelector('#modalCriarCadeira h2').textContent = 'Editar Cadeira';
      document.getElementById('modalCriarCadeira').classList.add('ativo');
      document.body.style.overflow = 'hidden';
    } else {
      alert('Erro ao carregar cadeira: ' + data.error);
    }
  } catch (error) {
    console.error('Erro ao carregar cadeira:', error);
    alert('Erro de conexão com o servidor');
  }
}

// ==================== APAGAR ====================
function confirmarApagarCadeira(id, nome) {
  if (confirm(`Tem certeza que deseja apagar a cadeira "${nome}"?\n\nEsta ação não pode ser desfeita.`)) {
    apagarCadeira(id);
  }
}

async function apagarCadeira(id) {
  try {
    const response = await fetch(`/cadeiras/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ professorId })
    });

    const data = await response.json();

    if (data.success) {
      alert(data.message);
      carregarCadeiras();
    } else {
      alert('Erro: ' + data.error);
    }
  } catch (error) {
    console.error('Erro ao apagar cadeira:', error);
    alert('Erro de conexão com o servidor');
  }
}

// ==================== VER PROJETOS ====================
function verProjetos(cadeiraId) {
  window.location.href = `/projetosP?disciplineId=${cadeiraId}`;
}

// ==================== FECHAR MODAL AO CLICAR FORA ====================
document.addEventListener('click', (e) => {
  const modal = document.getElementById('modalCriarCadeira');
  if (e.target === modal) {
    fecharModal();
  }
});