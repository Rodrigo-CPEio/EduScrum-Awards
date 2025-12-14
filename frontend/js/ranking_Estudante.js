// ========================
// Auth (localStorage)
// ========================
const user = JSON.parse(localStorage.getItem("user") || "{}");
const studentId = Number(user.studentId);
const studentName = user.nome || user.U_Name || user.name || "Estudante";

if (!studentId) {
  alert("Sessão inválida. Inicia sessão novamente.");
  window.location.href = "/login";
}

// ========================
// DOM (TU HTML)
// ========================
const studentNameEl = document.getElementById("studentName");
const sidebarPointsEl = document.getElementById("sidebarPoints");

const myPointsValueEl = document.getElementById("myPointsValue");
const pointsContainer = document.getElementById("pointsContainer");
const pointsTitle = document.getElementById("pointsTitle");

const topGrid = document.getElementById("topRankingGrid");

const btnIndividual = document.getElementById("btnViewIndividual");
const btnGroup = document.getElementById("btnViewGroup");
const btnRefresh = document.getElementById("btnRefreshPoints");

// Sidebar name
if (studentNameEl) studentNameEl.textContent = studentName;

// ========================
// Helpers
// ========================
async function safeJson(res) { try { return await res.json(); } catch { return null; } }

function unwrapArray(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.rows)) return data.rows;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.result)) return data.result;
  return [];
}

function pick(obj, keys, fallback = undefined) {
  for (const k of keys) {
    if (obj && obj[k] !== undefined && obj[k] !== null) return obj[k];
  }
  return fallback;
}

function toNumber(v, def = 0) {
  const n = Number(v);
  return Number.isFinite(n) ? n : def;
}

async function apiGet(url) {
  const res = await fetch(url);
  const data = await safeJson(res);
  if (!res.ok) throw new Error(data?.message || data?.error || `Erro GET ${url}`);
  return data;
}

function formatDate(d) {
  if (!d) return "—";
  const dt = new Date(d);
  if (isNaN(dt.getTime())) return String(d);
  return dt.toLocaleDateString("pt-PT");
}

// ========================
// Ranking UI
// ========================
function renderRow({ pos, name, points, isMe = false }) {
  return `
    <div class="rank-row ${isMe ? "me" : ""}"
      style="display:flex;justify-content:space-between;gap:12px;padding:12px 6px;border-top:1px solid #eee;">
      <span style="width:40px;">${pos}</span>
      <span style="flex:1;">${name}</span>
      <span style="min-width:120px;text-align:right;">${points} pts</span>
    </div>
  `;
}

function renderTop3(ranking) {
  if (!topGrid) return;

  const medals = ["🥇", "🥈", "🥉"];
  const classes = ["first-place", "second-place", "third-place"];

  topGrid.innerHTML = ranking.slice(0, 3).map((r, i) => `
    <article class="top-card ${classes[i]}">
      <div class="top-card-header">
        <span class="top-trophy">${medals[i]}</span>
      </div>

      <div class="top-card-body">
        <div class="top-avatar">
          <img src="https://randomuser.me/api/portraits/lego/${i + 1}.jpg" alt="avatar">
        </div>

        <h2 class="top-name">
          ${r.name}
          ${r.studentId === studentId ? `<span class="you-pill">Você</span>` : ""}
        </h2>

        <div class="top-stats">
          <div>
            <span class="top-value">${r.points}</span>
            <span class="top-label">Pontos</span>
          </div>
        </div>
      </div>
    </article>
  `).join("");
}

// ========================
// Points (ME)
// ========================
async function loadMyPoints() {
  const data = await apiGet(`/api/points/me?studentId=${studentId}`);
  const points = toNumber(pick(data, ["points", "pontos", "total", "sum"], 0), 0);

  if (sidebarPointsEl) sidebarPointsEl.textContent = points;
  if (myPointsValueEl) myPointsValueEl.textContent = points;
}

// ========================
// Ranking Students
// ========================
async function loadStudentsRanking() {
  if (pointsTitle) pointsTitle.textContent = "Ranking Individual";
  if (pointsContainer) pointsContainer.innerHTML = `<p class="muted">A carregar...</p>`;

  const raw = await apiGet("/api/points/students");
  const ranking = unwrapArray(raw);

  if (!ranking.length) {
    renderTop3([]);
    if (pointsContainer) pointsContainer.innerHTML = `<p class="muted">Sem dados.</p>`;
    return;
  }

  const normalized = ranking.map((r) => ({
    studentId: toNumber(pick(r, ["studentId", "S_ID", "AA_S_ID"], 0)),
    name: String(pick(r, ["name", "U_Name", "nome"], "Sem nome")),
    points: toNumber(pick(r, ["points", "pontos", "total"], 0))
  })).sort((a, b) => b.points - a.points);

  renderTop3(normalized);

  if (pointsContainer) {
    pointsContainer.innerHTML = normalized.map((r, i) =>
      renderRow({
        pos: i + 1,
        name: r.name,
        points: r.points,
        isMe: r.studentId === studentId
      })
    ).join("");
  }
}

// ========================
// Ranking Teams
// ========================
async function loadTeamsRanking() {
  if (pointsTitle) pointsTitle.textContent = "Ranking por Equipas";
  if (pointsContainer) pointsContainer.innerHTML = `<p class="muted">A carregar...</p>`;
  renderTop3([]); // top3 no aplica

  const raw = await apiGet("/api/points/teams");
  const ranking = unwrapArray(raw);

  if (!ranking.length) {
    if (pointsContainer) pointsContainer.innerHTML = `<p class="muted">Sem dados.</p>`;
    return;
  }

  const normalized = ranking.map((t) => ({
    teamId: toNumber(pick(t, ["teamId", "TE_ID", "T_ID", "id"], 0)),
    teamName: String(pick(t, ["teamName", "TE_Name", "T_Name", "name"], "Equipa")),
    points: toNumber(pick(t, ["points", "TE_Points", "pontos", "total"], 0), 0)
  })).sort((a, b) => b.points - a.points);

  if (pointsContainer) {
    pointsContainer.innerHTML = normalized
      .map((t, i) => renderRow({ pos: i + 1, name: t.teamName, points: t.points }))
      .join("");
  }
}

// ========================
// Toggle
// ========================
btnIndividual?.addEventListener("click", async () => {
  btnIndividual.classList.add("active");
  btnGroup?.classList.remove("active");
  await loadStudentsRanking();
});

btnGroup?.addEventListener("click", async () => {
  btnGroup.classList.add("active");
  btnIndividual?.classList.remove("active");
  await loadTeamsRanking();
});

btnRefresh?.addEventListener("click", async () => {
  await loadMyPoints();
  if (btnIndividual?.classList.contains("active")) {
    await loadStudentsRanking();
  } else {
    await loadTeamsRanking();
  }
});

// ========================
// INIT
// ========================
(async () => {
  try {
    await loadMyPoints();
    await loadStudentsRanking(); // default
  } catch (err) {
    console.error(err);
    if (pointsContainer) pointsContainer.innerHTML = `<p class="muted">Erro a carregar pontos.</p>`;
  }
})();
