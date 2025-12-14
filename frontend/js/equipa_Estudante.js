// frontend/js/equipa_Estudante.js

// ========================
// Auth (localStorage)
// ========================
const user = JSON.parse(localStorage.getItem("user") || "{}");
const studentId = Number(user.studentId);
const studentName = user.nome || "Estudante";

// Si no hay studentId, no seguimos
if (!studentId) {
  alert("No hay studentId. Inicia sesión como estudiante.");
  window.location.href = "/login";
  throw new Error("Missing studentId");
}

// (opcional) atualizar nome no HTML se tiveres <h3 id="studentName">
const nameEl = document.getElementById("studentName");
if (nameEl) nameEl.textContent = studentName;

// ========================
// Elementos
// ========================
const btnAbrirModal = document.getElementById("btnAbrirModal");
const modal = document.getElementById("modalNovaEquipa");
const fecharModal = document.getElementById("fecharModal");

const form = document.getElementById("formNovaEquipa");
const projectSelect = document.getElementById("projectSelect");
const teamNameInput = document.getElementById("teamName");
const capacityInput = document.getElementById("capacity");
const teamTypeSelect = document.getElementById("teamType");
const manualMembersBlock = document.getElementById("manualMembersBlock");
const eligibleMembersDiv = document.getElementById("eligibleMembers");
const myRoleSelect = document.getElementById("myRole");
const teamsGrid = document.getElementById("teamsGrid");

// ========================
// Helpers
// ========================
function getMemberStudentId(m) {
  return Number(
    m.studentId ??
    m.S_ID ??
    m.TM_S_ID ??
    m.student_id ??
    m.id_student ??
    m.id // en tu backend actual, id = S_ID (ok)
  );
}

function getTeamType(team) {
  return String(team.type ?? team.TE_Type ?? team.teamType ?? "Aberta").trim();
}
function getTeamId(team) {
  return Number(team.id ?? team.TE_ID ?? team.teamId);
}
function getTeamName(team) {
  return String(team.name ?? team.TE_Name ?? team.teamName ?? "Equipa").trim();
}

// ========================
// Modal open/close
// ========================
btnAbrirModal?.addEventListener("click", () => modal?.classList.add("show"));
fecharModal?.addEventListener("click", () => modal?.classList.remove("show"));
modal?.addEventListener("click", (e) => {
  if (e.target === modal) modal.classList.remove("show");
});

// ========================
// Load projects
// ========================
async function loadProjects() {
  const urls = [
    `/projetos/me?studentId=${studentId}`,
    `/projetos`
  ];

  projectSelect.innerHTML = `<option value="">A carregar...</option>`;

  for (const url of urls) {
    try {
      const res = await fetch(url);

      // ✅ DEBUG correcto
      console.log("[loadProjects] GET", url, "status:", res.status);

      if (!res.ok) continue;

      const data = await res.json().catch(() => null);

      const projects =
        Array.isArray(data) ? data :
        Array.isArray(data?.rows) ? data.rows :
        Array.isArray(data?.projects) ? data.projects :
        [];

      if (!projects.length) continue;

      projectSelect.innerHTML = projects.map(p => {
        const id = p.P_ID ?? p.id;
        const name = p.P_Name ?? p.name;
        return `<option value="${id}">${name}</option>`;
      }).join("");

      return;
    } catch (err) {
      console.error("[loadProjects] erro:", err);
    }
  }

  projectSelect.innerHTML = `<option value="">Sem projetos</option>`;
}

// ========================
// Eligible members (Manual)
// ========================
async function loadEligibleMembers() {
  eligibleMembersDiv.innerHTML = "A carregar alunos...";

  try {
    const res = await fetch("/api/teams/students");
    if (!res.ok) throw new Error("Falha ao buscar students");

    const students = await res.json();
    if (!Array.isArray(students) || students.length === 0) {
      eligibleMembersDiv.innerHTML = "<em>Sem alunos disponíveis</em>";
      return;
    }

    eligibleMembersDiv.innerHTML = students.map(s => `
      <label style="display:flex; gap:8px; align-items:center; margin:6px 0;">
        <input type="checkbox" value="${s.id}">
        <span>${s.name}</span>
      </label>
    `).join("");
  } catch (err) {
    console.error(err);
    eligibleMembersDiv.innerHTML = "<em>Erro ao carregar alunos</em>";
  }
}

teamTypeSelect?.addEventListener("change", async () => {
  const type = teamTypeSelect.value;
  if (type === "Manual") {
    manualMembersBlock.style.display = "block";
    await loadEligibleMembers();
  } else {
    manualMembersBlock.style.display = "none";
    eligibleMembersDiv.innerHTML = "";
  }
});

// ========================
// Create team
// ========================
form?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const projectId = Number(projectSelect.value);
  const teamName = teamNameInput.value.trim();
  const teamType = teamTypeSelect.value; // Aberta | Manual
  const myRole = myRoleSelect.value;
  const capacity = Number(capacityInput?.value) || 4;

  if (!projectId) return alert("Seleciona um projeto.");
  if (!teamName) return alert("Escreve o nome da equipa.");
  if (capacity < 2 || capacity > 10) return alert("Capacidade inválida (2-10).");

  const members = [{ studentId, role: myRole }];

  if (teamType === "Manual") {
    const checked = [...eligibleMembersDiv.querySelectorAll("input[type=checkbox]:checked")]
      .map(i => Number(i.value))
      .filter(Boolean);

    checked.forEach(id => {
      if (id !== studentId) members.push({ studentId: id, role: "Membro" });
    });

    if (members.length < 2) {
      return alert("Em Manual tens de selecionar pelo menos 1 membro além de ti.");
    }
  }

  const payload = { projectId, teamName, teamType, capacity, members, tasks: [] };
  console.log("[createTeam] payload:", payload);

  try {
    const res = await fetch("/api/teams/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) return alert(data.message || "Erro ao criar equipa.");

    alert(data.message || "Equipa criada com sucesso!");
    modal?.classList.remove("show");
    await loadTeams();
  } catch (err) {
    console.error(err);
    alert("Erro de rede ao criar equipa.");
  }
});

// ========================
// Render cards
// ========================
function renderTeamCard(team) {
  const type = getTeamType(team);
  const id = getTeamId(team);
  const name = getTeamName(team);

  const members = Array.isArray(team.members) ? team.members : [];
  const isMember = members.some(m => getMemberStudentId(m) === Number(studentId));

  const membersCount = members.length;
  const capacity = Number(team.capacity ?? team.TE_Capacity ?? 4);

  const tasks = Array.isArray(team.tasks) ? team.tasks : [];
  const totalTasks = tasks.length;
  const doneTasks = tasks.filter(t => t?.completed).length;
  const percent = totalTasks ? Math.round((doneTasks / totalTasks) * 100) : 0;

  const points = Number(team.points ?? 0);

  const membersHtml = members.map(m => {
    const nm = String(m.name ?? "Sem nome");
    const role = String(m.role ?? "Membro");
    const initials = nm.slice(0, 2).toUpperCase();
    return `
      <div class="member">
        <div class="member-avatar">${initials}</div>
        <div class="member-info">
          <span class="member-name">${nm}</span>
          <span class="member-role pill pill-neutral">${role}</span>
        </div>
      </div>
    `;
  }).join("");

  let joinBtn = "";
  if (isMember) {
    joinBtn = `<button class="btn-join-team disabled" disabled>Já és membro</button>`;
  } else if (type === "Aberta") {
    joinBtn = `<button class="btn-join-team" data-team-id="${id}" data-team-type="Aberta">Juntar-me à equipa</button>`;
  } else {
    joinBtn = `<button class="btn-join-team disabled" disabled>Equipa fechada</button>`;
  }

  return `
    <article class="team-card">
      <div class="team-card-header">
        <div class="team-info">
          <div class="team-title-row">
            <span class="team-icon-circle">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#3056d3" stroke-width="2">
                <circle cx="12" cy="8" r="3"></circle>
                <path d="M6 20a6 6 0 0 1 12 0"></path>
              </svg>
            </span>
            <div>
              <h2 class="team-name">${name}</h2>
              <span class="team-members-count">${membersCount} de ${capacity} membros</span>
            </div>
          </div>
        </div>

        <div class="team-meta">
          <div class="points-badge">
            <span class="trophy">🏆</span>
            <span class="points-value">${points}</span>
          </div>
          <span class="team-status ${type === "Aberta" ? "open" : "closed"}">${type}</span>
        </div>
      </div>

      <div class="tasks-section">
        <div class="tasks-header">
          <span class="tasks-title">Tarefas Completadas</span>
          <span class="tasks-total">${doneTasks}/${totalTasks}</span>
        </div>
        <span class="tasks-percent">${percent}% completo</span>
        <div class="progress-bar">
          <div class="progress-fill" style="width:${percent}%;"></div>
        </div>
      </div>

      <div class="members-section">
        <h3>Membros da Equipa</h3>
        <div class="members-list">
          ${membersHtml || "<em>Sem membros</em>"}
        </div>
      </div>

      <div class="team-footer">
        <span class="team-capacity">${membersCount} / ${capacity} membros</span>
        ${joinBtn}
      </div>
    </article>
  `;
}

// ========================
// Load teams
// ========================
async function loadTeams() {
  if (!teamsGrid) return;
  teamsGrid.innerHTML = "<p>A carregar equipas...</p>";

  try {
    const res = await fetch("/api/teams");
    if (!res.ok) throw new Error("Falha ao buscar equipas");

    const teams = await res.json();

    if (!Array.isArray(teams) || teams.length === 0) {
      teamsGrid.innerHTML = "<p>Sem equipas ainda. Cria a primeira 🙂</p>";
      return;
    }

    teamsGrid.innerHTML = teams.map(renderTeamCard).join("");
  } catch (err) {
    console.error(err);
    teamsGrid.innerHTML = "<p>Erro a carregar equipas.</p>";
  }
}

// ========================
// Join open team
// ========================
document.addEventListener("click", async (e) => {
  const btn = e.target.closest(".btn-join-team");
  if (!btn) return;
  if (btn.disabled) return;

  const teamId = Number(btn.dataset.teamId);
  const teamType = btn.dataset.teamType;

  if (!teamId) return alert("TeamId inválido.");
  if (teamType !== "Aberta") return alert("Esta equipa não é aberta.");

  try {
    const res = await fetch("/api/teams/join-open", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ teamId, studentId, role: "Membro" })
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) return alert(data.message || "Erro ao entrar na equipa.");

    alert(data.message || "Entraste na equipa!");
    await loadTeams();
  } catch (err) {
    console.error(err);
    alert("Erro de rede ao entrar na equipa.");
  }
});

// init
loadProjects();
loadTeams();
