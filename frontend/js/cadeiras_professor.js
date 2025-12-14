// =========================
//  VARIÁVEIS GLOBAIS
// =========================
let professorId = null;
let cadeiraEditando = null;
let cursoAtual = null;
let userData = null;

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

  cursoAtual = localStorage.getItem('cursoAtual');
  if (!cursoAtual) {
    alert('Curso não selecionado. Volte à página de cursos.');
    window.location.href = '/cursoP';
    return;
  }

  carregarNomeCurso();
  carregarCadeiras();
  configurarFormulario();
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
  professorId = user.teacherId;
  return true;
}

// =========================
//  CARREGAR NOME DO CURSO
// =========================
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

// =========================
//  CARREGAR CADEIRAS
// =========================
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

// =========================
//  RENDERIZAR CADEIRAS
// =========================
function renderizarCadeiras(cadeiras) {
  const tbody = document.querySelector('.courses-table tbody');

  if (!cadeiras || cadeiras.length === 0) {
    mostrarMensagemVazia('Nenhuma cadeira criada ainda. Clique em "+ Nova Cadeira" para começar.');
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
        <button class="apagar-btn" onclick="confirmarApagarCadeira(${cadeira.id}, '${cadeira.nome.replace(/'/g, "\\'")}' )" title="Apagar">
          🗑️
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// =========================
//  MENSAGEM QUANDO VAZIO
// =========================
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

// =========================
//  MODAL (CRIAR / EDITAR)
// =========================
function abrirModal() {
  cadeiraEditando = null;
  const modal = document.getElementById('modalCriarCadeira');
  modal.classList.add('ativo');
  modal.querySelector('h2').textContent = 'Criar Nova Cadeira';
  modal.querySelector('form').reset();
  modal.querySelector('.btn.criar').textContent = 'Criar';
  document.body.style.overflow = 'hidden';
}

function fecharModal() {
  const modal = document.getElementById('modalCriarCadeira');
  modal.classList.remove('ativo');
  document.body.style.overflow = '';
  cadeiraEditando = null;
}

// =========================
//  CONFIGURAR FORMULÁRIO
// =========================
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

// =========================
//  EDITAR
// =========================
async function editarCadeira(id) {
  try {
    const response = await fetch(`/cadeiras/${id}`);
    const data = await response.json();

    if (data.success) {
      cadeiraEditando = id;

      const modal = document.getElementById('modalCriarCadeira');
      const form = modal.querySelector('form');
      
      form.querySelector('input[type="text"]').value = data.cadeira.nome;
      form.querySelector('textarea').value = data.cadeira.descricao;

      modal.querySelector('h2').textContent = 'Editar Cadeira';
      modal.querySelector('.btn.criar').textContent = 'Salvar';
      modal.classList.add('ativo');
      document.body.style.overflow = 'hidden';
    } else {
      alert('Erro ao carregar cadeira: ' + data.error);
    }
  } catch (error) {
    console.error('Erro ao carregar cadeira:', error);
    alert('Erro de conexão com o servidor');
  }
}

// =========================
//  APAGAR
// =========================
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

// =========================
//  VER PROJETOS
// =========================
function verProjetos(cadeiraId) {
  window.location.href = `/projetosP?disciplineId=${cadeiraId}`;
}

// =========================
//  FECHAR MODAL AO CLICAR FORA
// =========================
document.addEventListener('click', (e) => {
  const modal = document.getElementById('modalCriarCadeira');
  if (e.target === modal) {
    fecharModal();
  }
});

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