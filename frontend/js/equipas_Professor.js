// frontend/js/equipas_Professor.js

// =========================
//  CONFIG
// =========================
const API_BASE = "/api/teams"; // corresponde ao app.use('/api/teams', teamRoutes) no app.js

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
  setupModalHandlers();
  loadTeams();
});

// =========================
//  AUTENTICAÇÃO (mesma lógica antiga)
// =========================
function verificarAutenticacao() {
  const userStr = localStorage.getItem('user');
  if (!userStr) {
    // deixa abrir a página para desenvolvimento (opcional)
    // window.location.href = '/login';
    return true;
  }

  const user = JSON.parse(userStr);
  if (user.tipo && user.tipo !== 'docente') {
    alert('Acesso negado. Apenas professores podem acessar esta página.');
    window.location.href = '/login';
    return false;
  }

  userData = user;
  teacherId = user ? user.teacherId : null;
  return true;
}

// =========================
//  SIDEBAR (ATUALIZADA - IGUAL AO CURSOS)
// =========================
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

  if (userData && userData.foto) {
    img.src = userData.foto;
    img.style.display = 'block';
    avatar.style.display = 'none';
  } else {
    img.style.display = 'none';
    avatar.style.display = 'flex';
    avatar.textContent = (userData && userData.nome ? userData.nome[0].toUpperCase() : 'U');
  }

  const nameEl = sidebarUserInfo.querySelector('.user-details h3');
  const typeEl = sidebarUserInfo.querySelector('.user-details p');
  if (nameEl) nameEl.textContent = userData ? userData.nome : 'Professor';
  if (typeEl) typeEl.textContent = 'Docente';
}

// =========================
//  MODAL HANDLERS & DYNAMICS
// =========================
function setupModalHandlers() {
  const btnAbrirModal = document.getElementById("btnAbrirModal");
  const modal = document.getElementById("modalNovaEquipa");
  const fechar = document.getElementById("fecharModal");
  const numMembrosInput = document.getElementById("numMembros");
  const numTarefasInput = document.querySelector("input[name='numTarefas']");
  window._membrosContainer = document.getElementById("membrosContainer"); // exposto globalmente

  // garante que existe o placeholder das tarefas no HTML
  let tarefasContainer = document.getElementById("tarefasContainer");
  if (!tarefasContainer) {
    tarefasContainer = document.createElement("div");
    tarefasContainer.id = "tarefasContainer";
    // inserir após o input numTarefas (se existir)
    const form = document.getElementById("formNovaEquipa");
    const numTarefasEl = form.querySelector("input[name='numTarefas']");
    if (numTarefasEl && numTarefasEl.parentNode) {
      numTarefasEl.parentNode.insertBefore(tarefasContainer, numTarefasEl.nextSibling);
    } else {
      form.insertBefore(tarefasContainer, form.querySelector("button[type='submit']"));
    }
  }

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

  // num membros -> cria selects para alunos + funções
  numMembrosInput.addEventListener("input", async () => {
    const membrosContainer = window._membrosContainer;
    membrosContainer.innerHTML = "";
    const qtd = parseInt(numMembrosInput.value) || 0;
    for (let i = 1; i <= qtd; i++) {
      const div = document.createElement("div");
      div.className = "membro-item";
      div.style.padding = "8px";
      div.style.marginBottom = "8px";
      div.style.borderRadius = "6px";
      div.style.background = "#fafafa";
      div.innerHTML = `
        <h3 style="margin-top:0">Membro ${i}</h3>
        <label>Aluno:</label>
        <select id="aluno${i}" style="width:100%;padding:8px;margin-bottom:6px;">
          <option>Carregando...</option>
        </select>
        <label>Função:</label>
        <select id="funcao${i}" style="width:100%;padding:8px;">
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

  // num tarefas -> cria campos de tarefa (nome + descrição)
  numTarefasInput.addEventListener("input", () => {
    const tarefasContainer = document.getElementById("tarefasContainer");
    tarefasContainer.innerHTML = "";
    const qtd = parseInt(numTarefasInput.value) || 0;
    for (let i = 1; i <= qtd; i++) {
      const card = document.createElement("div");
      card.style.padding = "10px";
      card.style.marginBottom = "8px";
      card.style.borderRadius = "6px";
      card.style.background = "#fff";
      card.style.border = "1px solid #eee";
      card.innerHTML = `
        <h3 style="margin:0 0 6px 0">Tarefa ${i}</h3>
        <label>Nome da Tarefa:</label>
        <input type="text" id="taskName${i}" placeholder="Nome da tarefa ${i}" style="width:100%;padding:8px;margin:6px 0" />
        <label>Descrição:</label>
        <textarea id="taskDesc${i}" placeholder="Descrição da tarefa ${i}" style="width:100%;padding:8px;margin:6px 0" rows="3"></textarea>
      `;
      tarefasContainer.appendChild(card);
    }
  });

  // form submit
  document.getElementById("formNovaEquipa").addEventListener("submit", async (e) => {
    e.preventDefault();

    const nomeEquipa = document.querySelector("input[name='nomeEquipa']").value.trim();
    const totalTasks = parseInt(document.querySelector("input[name='numTarefas']").value) || 0;
    const qtd = parseInt(numMembrosInput.value) || 0;

    // NOTE: variável chama-se "members" (ING) porque o backend espera essa propriedade
    const members = [];
    for (let i = 1; i <= qtd; i++) {
      const studentIdEl = document.getElementById(`aluno${i}`);
      const roleEl = document.getElementById(`funcao${i}`);
      members.push({
        studentId: studentIdEl ? (studentIdEl.value || null) : null,
        role: roleEl ? (roleEl.value || null) : null
      });
    }

    const tasks = [];
    for (let i = 1; i <= totalTasks; i++) {
      const name = (document.getElementById(`taskName${i}`) || {}).value || "";
      const desc = (document.getElementById(`taskDesc${i}`) || {}).value || "";
      if (name.trim() === "" && desc.trim() === "") continue; // ignora vazios
      tasks.push({ name: name.trim(), description: desc.trim() });
    }

    const body = {
      projectId: 1,
      teamName: nomeEquipa,
      members,
      tasks
    };

    try {
      console.log("Criando equipa -> payload:", body);
      const res = await fetch(`${API_BASE}/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Erro ao criar equipa");
      alert(data.message || "Equipa criada!");
      document.getElementById("modalNovaEquipa").style.display = "none";
      limparFormulario();
      loadTeams();
    } catch (err) {
      console.error("Erro ao criar equipa:", err);
      alert("Erro ao criar equipa: " + (err.message || err));
    }
  });
}

function limparFormulario() {
  document.getElementById("formNovaEquipa").reset();
  const tarefasContainer = document.getElementById("tarefasContainer");
  if (tarefasContainer) tarefasContainer.innerHTML = "";
  if (window._membrosContainer) window._membrosContainer.innerHTML = "";
}

// =========================
//  BUSCAR ESTUDANTES
// =========================
async function fetchStudents() {
  try {
    const res = await fetch(`${API_BASE}/students`);
    return await res.json();
  } catch (err) {
    console.error("Erro a buscar estudantes:", err);
    return [];
  }
}

async function loadStudentsIntoSelect(select) {
  if (!select) return;
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
//  LISTAR EQUIPAS (com members + tasks)
// =========================
async function loadTeams() {
  try {
    const res = await fetch(`${API_BASE}`);
    const teams = await res.json();
    renderTeams(teams);
    renderPerformance(teams);
  } catch (err) {
    console.error("Erro a carregar equipas:", err);
  }
}

function renderTeams(teams) {
  const container = document.querySelector(".teams");
  container.innerHTML = "";

  teams.forEach(team => {
    const card = document.createElement("div");
    card.className = "team-card";
    card.style.padding = "18px";
    card.style.borderRadius = "10px";
    card.style.background = "#fff";
    card.style.boxShadow = "0 2px 8px rgba(0,0,0,0.05)";
    card.style.marginBottom = "18px";

    const membersHTML = (team.members || []).map(m => `
      <li>
        <div class="circle">${(m.name || '').slice(0,2).toUpperCase()}</div>
        <span>${m.name}</span>
        <span class="role">${m.role || ''}</span>
      </li>
    `).join("");

    // tasks list
    const tasksHTML = (team.tasks || []).map(t => `
      <li style="display:flex; align-items:center; gap:10px; margin-bottom:6px;">
        <input type="checkbox" data-taskid="${t.T_ID}" ${t.T_Completed ? "checked": ""} onchange="toggleTask(${t.T_ID}, this.checked, ${team.TE_ID})" />
        <div style="flex:1">
          <div style="font-weight:600">${escapeHtml(t.T_Name)}</div>
          <div style="font-size:13px; color:#666">${escapeHtml(t.T_Description || '')}</div>
        </div>
      </li>
    `).join("");

    card.innerHTML = `
      <div class="team-header" style="display:flex; justify-content:space-between; align-items:start;">
        <div>
          <h2 style="margin:0 0 6px 0">${escapeHtml(team.TE_Name)}</h2>
          <p style="margin:0; color:#666">${(team.members || []).length} membros</p>
        </div>
        <div>
          <button class="btn-delete-team" style="background:#ff6b6b;color:white;border:none;padding:8px 12px;border-radius:8px;cursor:pointer" onclick="deleteTeam(${team.TE_ID})">Eliminar</button>
        </div>
      </div>

      <div style="margin-top:12px">
        <h3 style="margin:6px 0">Membros da Equipa</h3>
        <ul class="member-list" style="list-style:none;padding:0;margin:8px 0">
          ${membersHTML}
        </ul>
      </div>

      <div style="margin-top:12px">
        <h3 style="margin:6px 0">Tarefas</h3>
        <ul class="task-list" style="list-style:none;padding:0;margin:8px 0">
          ${tasksHTML || '<li style="color:#888">Sem tarefas</li>'}
        </ul>
      </div>

    `;
    container.appendChild(card);
  });
}

// =========================
//  ESCAPE HTML (simples)
// =========================
function escapeHtml(s) {
  if (!s && s !== 0) return "";
  return String(s).replace(/[&<>"']/g, function (m) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m];
  });
}

// =========================
//  TOGGLE TASK (checkbox) -> chama API para marcar como complete
// =========================
async function toggleTask(taskId, checked, teamId) {
  try {
    const res = await fetch(`${API_BASE}/tasks/${taskId}/complete`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: checked ? 1 : 0 })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Erro a atualizar tarefa");
    // recarrega as equipas para actualizar barras
    loadTeams();
  } catch (err) {
    console.error("Erro ao atualizar tarefa:", err);
    alert("Erro ao atualizar tarefa");
  }
}

// =========================
//  REMOVER EQUIPA
// =========================
async function deleteTeam(id) {
  if (!confirm("Deseja realmente eliminar esta equipa?")) return;
  try {
    const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Erro ao eliminar");
    alert(data.message);
    loadTeams();
  } catch (err) {
    console.error(err);
    alert("Erro ao eliminar equipa");
  }
}

// =========================
//  PERFORMANCE / COMPARAÇÃO
// =========================
function renderPerformance(teams) {
  const container = document.getElementById("performanceContainer");
  container.innerHTML = "";
  if (!Array.isArray(teams) || teams.length === 0) {
    container.innerHTML = `<p style="color:#666">Nenhuma equipa ainda.</p>`;
    return;
  }

  teams.forEach(team => {
    const total = (team.tasks || []).length;
    const completed = (team.tasks || []).filter(t => t.T_Completed == 1).length;
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

    const item = document.createElement("div");
    item.className = "compare-item";
    item.style.padding = "18px";
    item.style.marginBottom = "12px";
    item.style.borderRadius = "10px";
    item.style.background = "#fff";
    item.style.boxShadow = "0 2px 8px rgba(0,0,0,0.03)";

    item.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <div>
          <div style="font-weight:700">${escapeHtml(team.TE_Name)}</div>
          <div style="color:#666; font-size:13px">${completed}/${total} tarefas • 🏆 0</div>
        </div>
        <div style="font-weight:700">${percent}%</div>
      </div>

      <div style="margin-top:10px; background:#f1f5f9; height:12px; border-radius:8px; overflow:hidden;">
        <div style="width:${percent}%; height:100%; background:linear-gradient(90deg,#2b8aef,#0ac06a)"></div>
      </div>

      <!-- Lista compacta de tarefas com checkbox -->
      <ul style="margin-top:12px; list-style:none; padding:0;">
        ${(team.tasks || []).map(t => `
          <li style="display:flex;align-items:center;gap:8px;padding:6px 0;">
            <input type="checkbox" data-taskid="${t.T_ID}" ${t.T_Completed ? "checked" : ""} onchange="toggleTask(${t.T_ID}, this.checked, ${team.TE_ID})" />
            <div style="flex:1">
              <div style="font-weight:600">${escapeHtml(t.T_Name)}</div>
              <div style="font-size:12px;color:#666">${escapeHtml(t.T_Description || '')}</div>
            </div>
          </li>
        `).join("")}
      </ul>
    `;
    container.appendChild(item);
  });
}
