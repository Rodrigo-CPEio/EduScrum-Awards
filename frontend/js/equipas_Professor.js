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
  loadTeams();
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

  // Encontrar ou criar o container do topo
  let userTop = sidebarUserInfo.querySelector('.user-top');
  if (!userTop) {
    userTop = document.createElement('div');
    userTop.className = 'user-top';
    userTop.style.cssText = 'display: flex; gap: 12px; align-items: center;';
    sidebarUserInfo.innerHTML = '';
    sidebarUserInfo.appendChild(userTop);
  }

  // Criar avatar placeholder
  let avatar = userTop.querySelector('.avatar-placeholder');
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

  // Criar imagem
  let img = userTop.querySelector('img');
  if (!img) {
    img = document.createElement('img');
    img.alt = 'Foto de perfil';
    img.style.cssText = 'width: 55px; height: 55px; border-radius: 50%; display: none;';
  }

  // Criar detalhes do usuário
  let userDetails = userTop.querySelector('.user-details');
  if (!userDetails) {
    userDetails = document.createElement('div');
    userDetails.className = 'user-details';
    userDetails.innerHTML = `
      <h3 style="margin: 0; font-size: 16px;"></h3>
      <p style="margin: 0; color: #999; font-size: 14px;"></p>
    `;
  }

  // Adicionar elementos
  userTop.appendChild(avatar);
  userTop.appendChild(img);
  userTop.appendChild(userDetails);

  // Preencher dados
  if (userData.foto) {
    img.src = userData.foto;
    img.style.display = 'block';
    avatar.style.display = 'none';
  } else {
    img.style.display = 'none';
    avatar.style.display = 'flex';
    avatar.textContent = (userData.nome || 'U')[0].toUpperCase();
  }

  const nameEl = userDetails.querySelector('h3');
  const typeEl = userDetails.querySelector('p');
  if (nameEl) nameEl.textContent = userData.nome;
  if (typeEl) typeEl.textContent = 'Docente';
}

// =========================
//  ABRIR E FECHAR MODAL
// =========================
const btnAbrirModal = document.getElementById("btnAbrirModal");
const modal = document.getElementById("modalNovaEquipa");
const fechar = document.getElementById("fecharModal");
const numMembrosInput = document.getElementById("numMembros");
const membrosContainer = document.getElementById("membrosContainer");

btnAbrirModal.addEventListener("click", () => {
    limparFormulario();
    modal.style.display = "flex";
});

fechar.addEventListener("click", () => {
    modal.style.display = "none";
    limparFormulario();
});

window.addEventListener("click", (e) => {
    if (e.target === modal) {
        modal.style.display = "none";
        limparFormulario();
    }
});

// =========================
//  LIMPAR FORMULÁRIO
// =========================
function limparFormulario() {
    document.getElementById("formNovaEquipa").reset();
    membrosContainer.innerHTML = "";
}

// =========================
//  BUSCAR ESTUDANTES DA BD
// =========================
async function fetchStudents() {
    const res = await fetch("http://localhost:3000/api/teams/students");
    return await res.json();
}

async function loadStudentsIntoSelect(select) {
    const students = await fetchStudents();

    select.innerHTML = `<option value="">Selecionar aluno...</option>`;

    students.forEach(s => {
        const opt = document.createElement("option");
        opt.value = s.S_ID;
        opt.textContent = s.U_Name;
        select.appendChild(opt);
    });
}

// =========================
//  GERAR CAMPOS DOS MEMBROS
// =========================
numMembrosInput.addEventListener("input", async () => {
    membrosContainer.innerHTML = "";
    const qtd = parseInt(numMembrosInput.value);

    for (let i = 1; i <= qtd; i++) {
        const div = document.createElement("div");
        div.className = "membro-item";

        div.innerHTML = `
          <h3>Membro ${i}</h3>

          <label>Aluno:</label>
          <select id="aluno${i}">
            <option>Carregando...</option>
          </select>

          <label>Função:</label>
          <select id="funcao${i}">
            <option value="">Função...</option>
            <option value="Scrum Master">Scrum Master</option>
            <option value="Product Owner">Product Owner</option>
            <option value="Developer">Developer</option>
          </select>
        `;

        membrosContainer.appendChild(div);
        await loadStudentsIntoSelect(document.getElementById(`aluno${i}`));
    }
});

// =========================
//  CRIAR EQUIPA
// =========================
document.getElementById("formNovaEquipa").addEventListener("submit", async (e) => {
    e.preventDefault();

    const nomeEquipa = document.querySelector("input[name='nomeEquipa']").value;
    const totalTasks = document.querySelector("input[name='numTarefas']").value;
    const qtd = parseInt(numMembrosInput.value);

    const membros = [];
    for (let i = 1; i <= qtd; i++) {
        membros.push({
            studentId: document.getElementById(`aluno${i}`).value,
            role: document.getElementById(`funcao${i}`).value
        });
    }

    const body = {
        projectId: 1,
        teamName: nomeEquipa,
        totalTasks,
        members: membros
    };

    const res = await fetch("http://localhost:3000/api/teams/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    });

    const data = await res.json();
    alert(data.message);

    modal.style.display = "none";
    limparFormulario();
    loadTeams();
});

// =========================
//  REMOVER EQUIPA
// =========================
async function deleteTeam(id) {
    if (!confirm("Deseja realmente eliminar esta equipa?")) return;

    const res = await fetch(`http://localhost:3000/api/teams/${id}`, { method: "DELETE" });
    const data = await res.json();

    alert(data.message);
    loadTeams();
}

// =========================
//  LISTAR EQUIPAS NA PÁGINA
// =========================
async function loadTeams() {
    const res = await fetch("http://localhost:3000/api/teams");
    const teams = await res.json();

    const container = document.querySelector(".teams");
    container.innerHTML = "";

    teams.forEach(team => {
        const card = document.createElement("div");
        card.className = "team-card";

        const membersHTML = team.members
            .map(m => `
                <li>
                    <div class="circle">${m.name[0]}${m.name[1] ?? ""}</div>
                    <span>${m.name}</span>
                    <span class="role">${m.role}</span>
                </li>
            `)
            .join("");

        card.innerHTML = `
            <div class="team-header">
                <h2>${team.TE_Name}</h2>
                <button class="btn-delete-team" onclick="deleteTeam(${team.TE_ID})">Eliminar</button>
            </div>

            <p class="members">${team.members.length} membros</p>

            <h3>Membros da Equipa</h3>
            <ul class="member-list">
                ${membersHTML}
            </ul>
        `;

        container.appendChild(card);
    });

    renderPerformance(teams);
}

// =========================
//  COMPARAÇÃO DE PERFORMANCE
// =========================
function renderPerformance(teams) {
    const container = document.getElementById("performanceContainer");
    container.innerHTML = "";

    teams.forEach(team => {
        const total = team.totalTasks ?? 0;
        const completed = 0; 
        const percent = total > 0 ? (completed / total) * 100 : 0;

        const item = document.createElement("div");
        item.className = "compare-item";

        item.innerHTML = `
            <span class="label">${team.TE_Name}</span>

            <div class="bar">
                <div class="fill" style="width:${percent}%"></div>
            </div>

            <div class="compare-footer">
                <span>${completed}/${total} tarefas</span>
                <span>🏆 0</span>
            </div>
        `;

        container.appendChild(item);
    });
}