const user = JSON.parse(localStorage.getItem("user") || "{}");
const studentId = Number(user.studentId);

// DOM

const studentNameEl = document.getElementById("studentName");
const sidebarPointsEl = document.getElementById("sidebarPoints");
const welcomeNameEl = document.getElementById("welcomeName");

const dashTotalPointsEl = document.getElementById("dashTotalPoints");
const dashPointsExtraEl = document.getElementById("dashPointsExtra");

const dashAwardsCountEl = document.getElementById("dashAwardsCount");
const dashAwardsExtraEl = document.getElementById("dashAwardsExtra");

const dashTeamsCountEl = document.getElementById("dashTeamsCount");
const dashTeamsExtraEl = document.getElementById("dashTeamsExtra");

const dashRankPosEl = document.getElementById("dashRankPos");
const dashRankExtraEl = document.getElementById("dashRankExtra");

const courseCircleEl = document.getElementById("courseCircle");
const coursePctEl = document.getElementById("coursePct");
const tasksDoneEl = document.getElementById("tasksDone");
const tasksTotalEl = document.getElementById("tasksTotal");

const barProjectsEl = document.getElementById("barProjects");
const barParticipationEl = document.getElementById("barParticipation");
const barDeliveriesEl = document.getElementById("barDeliveries");
const pctProjectsEl = document.getElementById("pctProjects");
const pctParticipationEl = document.getElementById("pctParticipation");
const pctDeliveriesEl = document.getElementById("pctDeliveries");

if (!studentId) {
  alert("Sessão inválida. Inicia sessão novamente.");
  window.location.href = "/login";
}

async function safeJson(res) { try { return await res.json(); } catch { return null; } }

async function apiGet(url) {
  const res = await fetch(url);
  const data = await safeJson(res);
  if (!res.ok) throw new Error(data?.message || data?.error || `Erro GET ${url}`);
  return data;
}

function setText(el, value, fallback = "—") {
  if (!el) return;
  el.textContent = (value === null || value === undefined || value === "") ? fallback : value;
}

function clampPct(n) {
  n = Number(n);
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(100, n));
}

(async () => {
  try {
    const data = await apiGet(`/api/dashboard/me?studentId=${studentId}`);
    console.log("✅ dashboard data:", data);

    // Nombre
    setText(studentNameEl, data.name || "Estudante");
    setText(welcomeNameEl, (data.name || "Estudante").split(" ")[0]);

    // KPIs
    setText(sidebarPointsEl, data.totalPoints ?? 0);
    setText(dashTotalPointsEl, data.totalPoints ?? 0);
    setText(dashAwardsCountEl, data.awardsWon ?? 0);
    setText(dashTeamsCountEl, data.activeTeams ?? 0);
    setText(dashRankPosEl, data.rankPos || "—");

    // Extras (opcional)
    setText(dashPointsExtraEl, `+${data.awardsWon ?? 0} prémios`);
    setText(dashAwardsExtraEl, "Prémios conquistados");
    setText(dashTeamsExtraEl, "Equipas ativas");
    setText(dashRankExtraEl, "Ranking geral");

    // Progresso (tarefas)
    const done = Number(data.tasksCompleted || 0);
    const total = Number(data.tasksTotal || 0);
    const pct = clampPct(data.courseProgressPct);

    setText(tasksDoneEl, done);
    setText(tasksTotalEl, total);
    setText(coursePctEl, `${pct}%`);
    if (courseCircleEl) courseCircleEl.style.setProperty("--percent", pct);

    // Objetivos (de momento: usa percentagens simples baseadas no que tens)
    // ✅ Projetos: se tens projetos ativos, usa isso como “atividade”
    const projPct = clampPct((Number(data.activeProjects || 0) > 0) ? 67 : 0);
    const partPct = 0;     // si luego creas endpoint de participação, lo conectamos
    const delivPct = 0;    // si luego creas endpoint de entregas, lo conectamos

    if (barProjectsEl) barProjectsEl.style.width = `${projPct}%`;
    if (barParticipationEl) barParticipationEl.style.width = `${partPct}%`;
    if (barDeliveriesEl) barDeliveriesEl.style.width = `${delivPct}%`;

    setText(pctProjectsEl, `${projPct}%`);
    setText(pctParticipationEl, `${partPct}%`);
    setText(pctDeliveriesEl, `${delivPct}%`);

  } catch (err) {
    console.error("Dashboard load error:", err);
  }
})();
