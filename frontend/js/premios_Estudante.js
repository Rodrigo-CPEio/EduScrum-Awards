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
// DOM
// ========================
const studentNameEl = document.getElementById("studentName");
const sidebarPointsEl = document.getElementById("sidebarPoints");

const btnAwardIndividual = document.getElementById("btnAwardIndividual");
const btnAwardGroup = document.getElementById("btnAwardGroup");
const btnRefreshAwards = document.getElementById("btnRefreshAwards");

const awardsTitle = document.getElementById("awardsTitle");
const awardsSubtitle = document.getElementById("awardsSubtitle");
const awardsGrid = document.getElementById("awardsGrid");
const awardsTotal = document.getElementById("awardsTotal");

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
  for (const k of keys) if (obj && obj[k] !== undefined && obj[k] !== null) return obj[k];
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

function iconForAward(name = "") {
  const n = name.toLowerCase();
  if (n.includes("ouro") || n.includes("gold")) return "🥇";
  if (n.includes("prata") || n.includes("silver")) return "🥈";
  if (n.includes("bronze")) return "🥉";
  if (n.includes("melhor") || n.includes("best")) return "🏆";
  return "🎖️";
}

function renderAwardCard(a, mode) {
  const awardName = String(pick(a, ["A_Name","name","awardName","titulo"], "Prémio"));
  const desc = String(pick(a, ["A_Description","description","desc"], ""));
  const points = toNumber(pick(a, ["A_Points","points","pontos"], 0), 0);

  // fecha / momento de atribuição (si existe)
  const assignedAt = pick(a, ["createdAt","AA_Date","date","assignedAt"], null);

  // en grupo, puedes mostrar nombre de la equipa si viene
  const teamName = String(pick(a, ["teamName","TE_Name","equipa"], ""));

  return `
    <article class="award-card">
      <div class="award-icon">${iconForAward(awardName)}</div>

      <div class="award-body">
        <div class="award-name">${awardName}</div>
        ${desc ? `<div class="award-desc">${desc}</div>` : ""}

        <div class="award-meta">
          <span class="award-points">+${points} pts</span>
          <span>${formatDate(assignedAt)}</span>
        </div>

        ${mode === "group" && teamName ? `<div style="margin-top:8px;"><span class="award-pill">${teamName}</span></div>` : ""}
      </div>
    </article>
  `;
}

// ========================
// Puntos del usuario (si ya tienes endpoint)
// ========================
async function loadMyPoints() {
  try {
    const data = await apiGet(`/api/points/me?studentId=${studentId}`);
    const points = toNumber(pick(data, ["points","pontos","total","sum"], 0), 0);
    if (sidebarPointsEl) sidebarPointsEl.textContent = points;
  } catch (e) {
    // no rompe la página si no existe endpoint
  }
}

// ========================
// Load premios
// ========================
async function loadAwardsIndividual() {
  awardsTitle.textContent = "Prémios Individuais";
  awardsSubtitle.textContent = "A carregar...";
  awardsGrid.innerHTML = "";

  // ✅ Cambia esta URL si tu backend usa otra
  const raw = await apiGet(`/api/awards/me?studentId=${studentId}`);
  const arr = unwrapArray(raw);

  awardsTotal.textContent = arr.length;

  if (!arr.length) {
    awardsSubtitle.textContent = "Ainda não tens prémios individuais.";
    awardsGrid.innerHTML = `<div class="empty-state">Sem prémios atribuídos (Individual).</div>`;
    return;
  }

  awardsSubtitle.textContent = `Encontrados ${arr.length} prémios.`;
  awardsGrid.innerHTML = arr.map(a => renderAwardCard(a, "individual")).join("");
}

async function loadAwardsGroup() {
  awardsTitle.textContent = "Prémios de Grupo";
  awardsSubtitle.textContent = "A carregar...";
  awardsGrid.innerHTML = "";

  // ✅ Cambia esta URL si tu backend usa otra
  const raw = await apiGet(`/api/awards/teams/me?studentId=${studentId}`);
  const arr = unwrapArray(raw);

  awardsTotal.textContent = arr.length;

  if (!arr.length) {
    awardsSubtitle.textContent = "Ainda não tens prémios em grupo.";
    awardsGrid.innerHTML = `<div class="empty-state">Sem prémios atribuídos (Grupo).</div>`;
    return;
  }

  awardsSubtitle.textContent = `Encontrados ${arr.length} prémios.`;
  awardsGrid.innerHTML = arr.map(a => renderAwardCard(a, "group")).join("");
}

// ========================
// Toggle
// ========================
btnAwardIndividual?.addEventListener("click", async () => {
  btnAwardIndividual.classList.add("active");
  btnAwardGroup?.classList.remove("active");
  await loadAwardsIndividual();
});

btnAwardGroup?.addEventListener("click", async () => {
  btnAwardGroup.classList.add("active");
  btnAwardIndividual?.classList.remove("active");
  await loadAwardsGroup();
});

btnRefreshAwards?.addEventListener("click", async () => {
  await loadMyPoints();
  if (btnAwardIndividual?.classList.contains("active")) {
    await loadAwardsIndividual();
  } else {
    await loadAwardsGroup();
  }
});

// ========================
// INIT
// ========================
(async () => {
  try {
    await loadMyPoints();
    await loadAwardsIndividual();
  } catch (err) {
    console.error(err);
    awardsSubtitle.textContent = "Erro a carregar prémios.";
    awardsGrid.innerHTML = `<div class="empty-state">Erro a carregar dados.</div>`;
  }
})();
    