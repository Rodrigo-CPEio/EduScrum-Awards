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

  // Inicializar sidebar
  inicializarSidebar({
    userType: 'professor',
    activePage: 'equipas',
    userData: {
      nome: userData.nome,
      foto: userData.foto || null
    }
  });

  setupModalHandlers();
  loadTeams();
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
//  MODAL HANDLERS & DYNAMICS
// =========================
function setupModalHandlers() {
  const btnAbrirModal = document.getElementById("btnAbrirModal");
  const modal = document.getElementById("modalNovaEquipa");
  const fechar = document.getElementById("fecharModal");
  const numMembrosInput = document.getElementById("numMembros");
  const numTarefasInput = document.querySelector("input[name='numTarefas']");
  window._membrosContainer = document.getElementById("membrosContainer");

  // Garante que existe o placeholder das tarefas no HTML
  let tarefasContainer = document.getElementById("tarefasContainer");
  if (!tarefasContainer) {
    tarefasContainer = document.createElement("div");
    tarefasContainer.id = "tarefasContainer";
    const form = document.getElementById("formNovaEquipa");
    const numTarefasEl = form.querySelector("input[name='numTarefas']");
    if (numTarefasEl && numTarefasEl.parentNode) {
      numTarefasEl.parentNode.insertBefore(tarefasContainer, numTarefasEl.nextSibling);
    } else {
      form.insertBefore(tarefasContainer, form.querySelector("button[type='submit']"));
    }
  }

  // Abrir modal
  btnAbrirModal.addEventListener("click", () => {
    limparFormulario();
    loadProjectsIntoSelect(); // ✅ Carregar projetos disponíveis
    modal.style.display = "flex";
  });

  // Fechar modal
  fechar.addEventListener("click", () => {
    modal.style.display = "none";
    limparFormulario();
  });

  // Fechar ao clicar fora
  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
      limparFormulario();
    }
  });

  // Num membros -> cria selects para alunos + funções
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

  // Num tarefas -> cria campos de tarefa (nome + descrição)
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

  // Form submit
  document.getElementById("formNovaEquipa").addEventListener("submit", async (e) => {
    e.preventDefault();

    const projetoSelect = document.getElementById("selectProjeto");
    const projectId = projetoSelect ? parseInt(projetoSelect.value) : null;
    const nomeEquipa = document.querySelector("input[name='nomeEquipa']").value.trim();
    const totalTasks = parseInt(document.querySelector("input[name='numTarefas']").value) || 0;
    const qtd = parseInt(numMembrosInput.value) || 0;

    // ✅ Validar projeto selecionado
    if (!projectId || isNaN(projectId)) {
      alert('⚠️ Por favor, selecione um projeto válido!');
      return;
    }

    // Coletar membros
    const members = [];
    for (let i = 1; i <= qtd; i++) {
      const studentIdEl = document.getElementById(`aluno${i}`);
      const roleEl = document.getElementById(`funcao${i}`);
      members.push({
        studentId: studentIdEl ? (studentIdEl.value || null) : null,
        role: roleEl ? (roleEl.value || null) : null
      });
    }

    // Coletar tarefas
    const tasks = [];
    for (let i = 1; i <= totalTasks; i++) {
      const name = (document.getElementById(`taskName${i}`) || {}).value || "";
      const desc = (document.getElementById(`taskDesc${i}`) || {}).value || "";
      if (name.trim() === "" && desc.trim() === "") continue; // ignora vazios
      tasks.push({ name: name.trim(), description: desc.trim() });
    }

    const body = {
      projectId: projectId, // ✅ Usa o projeto selecionado
      teamName: nomeEquipa,
      members,
      tasks
    };

    try {
      console.log("📤 Criando equipa -> payload:", body);
      
      const res = await fetch('http://localhost:3000/api/teams/create', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || "Erro ao criar equipa");
      }
      
      alert(data.message || "✅ Equipa criada com sucesso!");
      modal.style.display = "none";
      limparFormulario();
      loadTeams();
      
    } catch (err) {
      console.error("❌ Erro ao criar equipa:", err);
      alert("Erro ao criar equipa: " + (err.message || err));
    }
  });
}

// =========================
//  LIMPAR FORMULÁRIO
// =========================
function limparFormulario() {
  document.getElementById("formNovaEquipa").reset();
  const tarefasContainer = document.getElementById("tarefasContainer");
  if (tarefasContainer) tarefasContainer.innerHTML = "";
  if (window._membrosContainer) window._membrosContainer.innerHTML = "";
}

// =========================
//  BUSCAR ESTUDANTES
// =========================
async function fetchProjects() {
  try {
    const res = await fetch('http://localhost:3000/projetos');
    
    if (!res.ok) {
      throw new Error('Erro ao buscar projetos');
    }
    
    const data = await res.json();
    console.log('📁 Projetos recebidos (raw):', data);
    
    // A API pode retornar array direto ou objeto com propriedade
    const projects = Array.isArray(data) ? data : (data.projetos || data.projects || []);
    
    return projects;
    
  } catch (err) {
    console.error("❌ Erro a buscar projetos:", err);
    return [];
  }
}

async function loadProjectsIntoSelect() {
  const select = document.getElementById('selectProjeto');
  if (!select) return;
  
  select.innerHTML = `<option value="">Carregando projetos...</option>`;
  
  const projects = await fetchProjects();
  
  if (!Array.isArray(projects) || projects.length === 0) {
    select.innerHTML = `<option value="">❌ Nenhum projeto disponível</option>`;
    alert('⚠️ Não existem projetos disponíveis!\n\nPor favor:\n1. Vá para Cursos\n2. Selecione uma Cadeira\n3. Crie um Projeto primeiro');
    return;
  }
  
  select.innerHTML = `<option value="">-- Selecionar projeto --</option>`;
  
  projects.forEach(p => {
    // Suporta ambos os formatos
    const projectId = p.id || p.P_ID;
    const projectName = p.name || p.P_Name;
    const projectDesc = p.description || p.P_Description || '';
    
    if (projectId && projectName) {
      const opt = document.createElement("option");
      opt.value = projectId;
      
      // Mostra nome + descrição curta
      const displayText = projectDesc 
        ? `${projectName} - ${projectDesc.substring(0, 40)}${projectDesc.length > 40 ? '...' : ''}`
        : projectName;
      
      opt.textContent = displayText;
      select.appendChild(opt);
    }
  });
  
  console.log('✅ Select de projetos preenchido com', projects.length, 'projetos');
}

async function fetchStudents() {
  try {
    const res = await fetch('http://localhost:3000/api/teams/students');
    const students = await res.json();
    console.log('📚 Estudantes recebidos:', students);
    return students;
  } catch (err) {
    console.error("❌ Erro a buscar estudantes:", err);
    return [];
  }
}

async function loadStudentsIntoSelect(select) {
  if (!select) return;
  
  const students = await fetchStudents();
  select.innerHTML = `<option value="">Selecionar aluno...</option>`;
  
  if (!Array.isArray(students) || students.length === 0) {
    select.innerHTML = `<option value="">Nenhum estudante disponível</option>`;
    return;
  }
  
  students.forEach(s => {
    // Suporta AMBOS os formatos (novo e antigo)
    const studentId = s.id || s.S_ID;
    const studentName = s.name || s.U_Name;
    
    if (studentId && studentName) {
      const opt = document.createElement("option");
      opt.value = studentId;
      opt.textContent = studentName;
      select.appendChild(opt);
    } else {
      console.warn('⚠️ Estudante com dados inválidos:', s);
    }
  });
  
  console.log('✅ Select preenchido com', students.length, 'estudantes');
}

// =========================
//  LISTAR EQUIPAS
// =========================
async function loadTeams() {
  try {
    const res = await fetch('http://localhost:3000/api/teams');
    const teams = await res.json();
    console.log('👥 Equipas recebidas:', teams);
    
    renderTeams(teams);
    renderPerformance(teams);
  } catch (err) {
    console.error("❌ Erro a carregar equipas:", err);
  }
}

// =========================
//  RENDERIZAR EQUIPAS
// =========================
function renderTeams(teams) {
  const container = document.querySelector(".teams");
  container.innerHTML = "";

  if (!Array.isArray(teams) || teams.length === 0) {
    container.innerHTML = `
      <div style="padding: 40px; text-align: center; color: #666;">
        <p>Nenhuma equipa criada ainda. Clique em "+ Nova Equipa" para começar!</p>
      </div>
    `;
    return;
  }

  teams.forEach(team => {
    const card = document.createElement("div");
    card.className = "team-card";
    card.style.padding = "18px";
    card.style.borderRadius = "10px";
    card.style.background = "#fff";
    card.style.boxShadow = "0 2px 8px rgba(0,0,0,0.05)";
    card.style.marginBottom = "18px";

    // Suporta AMBOS os formatos de membros
    const membersHTML = (team.members || []).map(m => {
      const memberName = m.name || m.U_Name || 'Sem nome';
      const memberRole = m.role || m.TM_Role || '';
      
      return `
        <li>
          <div class="circle">${memberName.slice(0,2).toUpperCase()}</div>
          <span>${escapeHtml(memberName)}</span>
          ${memberRole ? `<span class="role">${escapeHtml(memberRole)}</span>` : ''}
        </li>
      `;
    }).join("");

    // Suporta AMBOS os formatos de tarefas
    const tasksHTML = (team.tasks || []).map(t => {
      const taskId = t.id || t.T_ID;
      const taskName = t.name || t.T_Name || 'Sem nome';
      const taskDesc = t.description || t.T_Description || '';
      const taskCompleted = t.completed || t.T_Completed;
      const teamId = team.id || team.TE_ID;
      
      return `
        <li style="display:flex; align-items:center; gap:10px; margin-bottom:6px;">
          <input type="checkbox" data-taskid="${taskId}" ${taskCompleted ? "checked": ""} onchange="toggleTask(${taskId}, this.checked, ${teamId})" />
          <div style="flex:1">
            <div style="font-weight:600">${escapeHtml(taskName)}</div>
            ${taskDesc ? `<div style="font-size:13px; color:#666">${escapeHtml(taskDesc)}</div>` : ''}
          </div>
        </li>
      `;
    }).join("");

    const teamId = team.id || team.TE_ID;
    const teamName = team.name || team.TE_Name || 'Sem nome';

    card.innerHTML = `
      <div class="team-header" style="display:flex; justify-content:space-between; align-items:start;">
        <div>
          <h2 style="margin:0 0 6px 0">${escapeHtml(teamName)}</h2>
          <p style="margin:0; color:#666">${(team.members || []).length} membros</p>
        </div>
        <div>
          <button class="btn-delete-team" style="background:#ff6b6b;color:white;border:none;padding:8px 12px;border-radius:8px;cursor:pointer" onclick="deleteTeam(${teamId})">Eliminar</button>
        </div>
      </div>

      <div style="margin-top:12px">
        <h3 style="margin:6px 0">Membros da Equipa</h3>
        <ul class="member-list" style="list-style:none;padding:0;margin:8px 0">
          ${membersHTML || '<li style="color:#888">Sem membros</li>'}
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
//  ESCAPE HTML
// =========================
function escapeHtml(s) {
  if (!s && s !== 0) return "";
  return String(s).replace(/[&<>"']/g, function (m) {
    return { 
      '&': '&amp;', 
      '<': '&lt;', 
      '>': '&gt;', 
      '"': '&quot;', 
      "'": '&#39;' 
    }[m];
  });
}

// =========================
//  TOGGLE TASK
// =========================
async function toggleTask(taskId, checked, teamId) {
  try {
    const res = await fetch(`http://localhost:3000/api/teams/tasks/${taskId}/complete`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: checked ? 1 : 0 })
    });
    
    const data = await res.json();
    
    if (!res.ok) {
      throw new Error(data.message || "Erro a atualizar tarefa");
    }
    
    console.log('✅ Tarefa atualizada');
    loadTeams();
    
  } catch (err) {
    console.error("❌ Erro ao atualizar tarefa:", err);
    alert("Erro ao atualizar tarefa");
  }
}

// =========================
//  REMOVER EQUIPA
// =========================
async function deleteTeam(id) {
  if (!confirm("Deseja realmente eliminar esta equipa?")) return;
  
  try {
    const res = await fetch(`http://localhost:3000/api/teams/${id}`, { 
      method: "DELETE" 
    });
    
    const data = await res.json();
    
    if (!res.ok) {
      throw new Error(data.message || "Erro ao eliminar");
    }
    
    alert(data.message || "✅ Equipa eliminada!");
    loadTeams();
    
  } catch (err) {
    console.error("❌ Erro ao eliminar equipa:", err);
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
    const completed = (team.tasks || []).filter(t => (t.completed || t.T_Completed) == 1).length;
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

    const teamId = team.id || team.TE_ID;
    const teamName = team.name || team.TE_Name || 'Sem nome';

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
          <div style="font-weight:700">${escapeHtml(teamName)}</div>
          <div style="color:#666; font-size:13px">${completed}/${total} tarefas • 🏆 0</div>
        </div>
        <div style="font-weight:700">${percent}%</div>
      </div>

      <div style="margin-top:10px; background:#f1f5f9; height:12px; border-radius:8px; overflow:hidden;">
        <div style="width:${percent}%; height:100%; background:linear-gradient(90deg,#2b8aef,#0ac06a)"></div>
      </div>

      <ul style="margin-top:12px; list-style:none; padding:0;">
        ${(team.tasks || []).map(t => {
          const taskId = t.id || t.T_ID;
          const taskName = t.name || t.T_Name || 'Sem nome';
          const taskDesc = t.description || t.T_Description || '';
          const taskCompleted = t.completed || t.T_Completed;
          
          return `
            <li style="display:flex;align-items:center;gap:8px;padding:6px 0;">
              <input type="checkbox" data-taskid="${taskId}" ${taskCompleted ? "checked" : ""} onchange="toggleTask(${taskId}, this.checked, ${teamId})" />
              <div style="flex:1">
                <div style="font-weight:600">${escapeHtml(taskName)}</div>
                ${taskDesc ? `<div style="font-size:12px;color:#666">${escapeHtml(taskDesc)}</div>` : ''}
              </div>
            </li>
          `;
        }).join("")}
      </ul>
    `;
    
    container.appendChild(item);
  });
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