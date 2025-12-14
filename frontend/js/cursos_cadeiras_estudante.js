// frontend/js/cursos_cadeiras_estudante.js

// ========================
// Auth (localStorage)
// ========================
const user = JSON.parse(localStorage.getItem("user") || "{}");
const studentId = Number(user.studentId);
const studentName = user.nome || "Estudante";

if (!studentId) {
  alert("Inicia sesión como estudiante (no hay studentId).");
  window.location.href = "/login";
}

// pintar nombre (si existe en el HTML)
const nameEl = document.getElementById("studentName");
if (nameEl) nameEl.textContent = studentName;

// ========================
// DOM
// ========================
const cursosEl = document.getElementById("cursosContainer");
const cadeirasEl = document.getElementById("cadeirasContainer");
const projetosEl = document.getElementById("projetosContainer");

const btnRefresh = document.getElementById("btnRefreshAcad");
const btnMinhasCadeiras = document.getElementById("btnVerMinhasCadeiras");

// ========================
// Estado
// ========================
let selectedCourseId = null;
let selectedDiscId = null;

// cache para mostrar "Matriculado" rápido
let myDisciplinesSet = new Set(); // D_ID que el estudiante ya tiene

// ========================
// Helpers UI (NO usar .badge)
// ========================
function chip(text, kind = "") {
  // kind: "chip-ok" | "chip-team" | "chip-ind"
  return `<span class="chip ${kind}">${text}</span>`;
}

function acadCard({ title, desc, rightHtml = "", footerHtml = "", active = false, dataAttrs = "" }) {
  return `
    <div class="acad-card ${active ? "active" : ""}" ${dataAttrs}>
      <div class="acad-card-top">
        <div class="acad-card-text">
          <h3 class="acad-card-title">${title}</h3>
          ${desc ? `<p class="acad-card-desc">${desc}</p>` : ""}
        </div>
        ${rightHtml ? `<div class="acad-card-right">${rightHtml}</div>` : ""}
      </div>
      ${footerHtml ? `<div class="acad-card-actions">${footerHtml}</div>` : ""}
    </div>
  `;
}

async function safeJson(res) {
  try { return await res.json(); } catch { return null; }
}

// ========================
// API helpers
// ========================
async function apiGet(url) {
  const res = await fetch(url);
  const data = await safeJson(res);
  if (!res.ok) throw new Error(data?.message || data?.error || `Erro GET ${url}`);
  return data;
}

async function apiPost(url, body) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body || {})
  });
  const data = await safeJson(res);
  if (!res.ok) throw new Error(data?.message || data?.error || `Erro POST ${url}`);
  return data;
}

// ========================
// Load: Minhas cadeiras (para saber matriculados)
// ========================
async function refreshMyDisciplinesSet() {
  try {
    const cadeiras = await apiGet(`/api/cadeiras/me?studentId=${studentId}`);
    myDisciplinesSet = new Set(
      Array.isArray(cadeiras) ? cadeiras.map(d => Number(d.D_ID)) : []
    );
  } catch (err) {
    // si falla no bloquea
    console.warn("No pude cargar /api/cadeiras/me para matriculas:", err.message);
    myDisciplinesSet = new Set();
  }
}

// ========================
// Load cursos
// ========================
async function loadCursos() {
  cursosEl.innerHTML = `<p class="muted">A carregar cursos...</p>`;
  try {
    // para poder pintar "Matriculado" en cadeiras
    await refreshMyDisciplinesSet();

    const cursos = await apiGet("/api/cursos");

    if (!Array.isArray(cursos) || cursos.length === 0) {
      cursosEl.innerHTML = `<p class="muted">Sem cursos.</p>`;
      return;
    }

    cursosEl.innerHTML = cursos.map(c => {
      const active = Number(c.C_ID) === Number(selectedCourseId);
      return acadCard({
        title: c.C_Name,
        desc: c.C_Description || "",
        rightHtml: chip(`#${c.C_ID}`),
        footerHtml: `
          <button class="btn sm" data-action="verCadeiras" data-course="${c.C_ID}">Ver cadeiras</button>
          <button class="btn sm primary" data-action="joinCurso" data-course="${c.C_ID}">Unirme</button>
        `,
        active,
        dataAttrs: `data-course-card="${c.C_ID}"`
      });
    }).join("");

  } catch (err) {
    console.error(err);
    cursosEl.innerHTML = `<p class="muted">Erro a carregar cursos.</p>`;
  }
}

// ========================
// Load cadeiras por curso
// ========================
async function loadCadeiras(courseId) {
  selectedCourseId = Number(courseId);
  selectedDiscId = null;

  cadeirasEl.innerHTML = `<p class="muted">A carregar cadeiras...</p>`;
  projetosEl.innerHTML = `<p class="muted">Escolhe uma cadeira</p>`;

  try {
    const cadeiras = await apiGet(`/api/cursos/${courseId}/cadeiras`);

    if (!Array.isArray(cadeiras) || cadeiras.length === 0) {
      cadeirasEl.innerHTML = `<p class="muted">Este curso não tem cadeiras.</p>`;
      return;
    }

    cadeirasEl.innerHTML = cadeiras.map(d => {
      const discId = Number(d.D_ID);
      const isEnrolled = myDisciplinesSet.has(discId);

      const active = discId === Number(selectedDiscId);

      const rightHtml = isEnrolled
        ? chip("Matriculado", "chip-ok")
        : chip(`D#${discId}`);

      const joinBtn = isEnrolled
        ? `<button class="btn sm" disabled style="opacity:.6; cursor:not-allowed;">Matriculado</button>`
        : `<button class="btn sm primary" data-action="joinCadeira" data-disc="${discId}">Unirme</button>`;

      return acadCard({
        title: d.D_Name,
        desc: d.D_Description || "",
        rightHtml,
        footerHtml: `
          <button class="btn sm" data-action="verProjetos" data-disc="${discId}">Ver projetos</button>
          ${joinBtn}
        `,
        active,
        dataAttrs: `data-disc-card="${discId}"`
      });
    }).join("");

    // marca visual no curso selecionado
    document.querySelectorAll("[data-course-card]").forEach(el => el.classList.remove("active"));
    const courseCard = document.querySelector(`[data-course-card="${courseId}"]`);
    if (courseCard) courseCard.classList.add("active");

  } catch (err) {
    console.error(err);
    cadeirasEl.innerHTML = `<p class="muted">Erro a carregar cadeiras.</p>`;
  }
}

// ========================
// Load minhas cadeiras (studentcourse)
// ========================
async function loadMinhasCadeiras() {
  selectedCourseId = null;
  selectedDiscId = null;

  cadeirasEl.innerHTML = `<p class="muted">A carregar as tuas cadeiras...</p>`;
  projetosEl.innerHTML = `<p class="muted">Escolhe uma cadeira</p>`;

  try {
    const cadeiras = await apiGet(`/api/cadeiras/me?studentId=${studentId}`);

    myDisciplinesSet = new Set(
      Array.isArray(cadeiras) ? cadeiras.map(d => Number(d.D_ID)) : []
    );

    if (!Array.isArray(cadeiras) || cadeiras.length === 0) {
      cadeirasEl.innerHTML = `<p class="muted">Ainda não estás matriculado em cadeiras.</p>`;
      return;
    }

    cadeirasEl.innerHTML = cadeiras.map(d => {
      const discId = Number(d.D_ID);
      return acadCard({
        title: d.D_Name,
        desc: d.D_Description || "",
        rightHtml: chip("Matriculado", "chip-ok"),
        footerHtml: `
          <button class="btn sm" data-action="verProjetos" data-disc="${discId}">Ver projetos</button>
        `,
        dataAttrs: `data-disc-card="${discId}"`
      });
    }).join("");

  } catch (err) {
    console.error(err);
    cadeirasEl.innerHTML = `<p class="muted">Erro a carregar as tuas cadeiras.</p>`;
  }
}

// ========================
// Load projetos por cadeira (separa Individual/Equipa)
// ========================
async function loadProjetos(disciplinaId) {
  selectedDiscId = Number(disciplinaId);
  projetosEl.innerHTML = `<p class="muted">A carregar projetos...</p>`;

  try {
    const projetos = await apiGet(`/api/cadeiras/${disciplinaId}/projetos`);

    if (!Array.isArray(projetos) || projetos.length === 0) {
      projetosEl.innerHTML = `<p class="muted">Sem projetos nesta cadeira.</p>`;
      return;
    }

    const indiv = projetos.filter(p => String(p.P_Mode || "Equipa") === "Individual");
    const team = projetos.filter(p => String(p.P_Mode || "Equipa") !== "Individual");

    const renderList = (arr) => arr.map(p => {
      const mode = String(p.P_Mode || "Equipa");
      const isInd = mode === "Individual";

      return acadCard({
        title: p.P_Name,
        desc: p.P_Description || "",
        rightHtml: isInd ? chip("Individual", "chip-ind") : chip("Equipa", "chip-team")
      });
    }).join("");

    projetosEl.innerHTML = `
      <div class="proj-group">
        <div class="proj-group-head">
          <h3>👥 Projetos de Equipa</h3>
          <span class="count">${team.length}</span>
        </div>
        ${team.length ? renderList(team) : `<p class="muted">Nenhum projeto de equipa.</p>`}
      </div>

      <div class="proj-group">
        <div class="proj-group-head">
          <h3>🧍 Projetos Individuais</h3>
          <span class="count">${indiv.length}</span>
        </div>
        ${indiv.length ? renderList(indiv) : `<p class="muted">Nenhum projeto individual.</p>`}
      </div>
    `;

    // marca visual na cadeira selecionada
    document.querySelectorAll("[data-disc-card]").forEach(el => el.classList.remove("active"));
    const discCard = document.querySelector(`[data-disc-card="${disciplinaId}"]`);
    if (discCard) discCard.classList.add("active");

  } catch (err) {
    console.error(err);
    projetosEl.innerHTML = `<p class="muted">Erro a carregar projetos.</p>`;
  }
}

// ========================
// Actions
// ========================
document.addEventListener("click", async (e) => {
  const btn = e.target.closest("button[data-action]");
  if (!btn) return;

  const action = btn.dataset.action;

  try {
    if (action === "verCadeiras") {
      await loadCadeiras(btn.dataset.course);
    }

    if (action === "joinCurso") {
      const courseId = Number(btn.dataset.course);
      const data = await apiPost(`/api/cursos/${courseId}/join`, { studentId });
      alert(data.message || "OK");
      await refreshMyDisciplinesSet();
      await loadCadeiras(courseId);
    }

    if (action === "joinCadeira") {
      const discId = Number(btn.dataset.disc);
      const data = await apiPost(`/api/cadeiras/${discId}/join`, { studentId });
      alert(data.message || "OK");
      await refreshMyDisciplinesSet();
      // refresca el panel actual
      if (selectedCourseId) await loadCadeiras(selectedCourseId);
    }

    if (action === "verProjetos") {
      await loadProjetos(btn.dataset.disc);
    }
  } catch (err) {
    console.error(err);
    alert(err.message || "Erro");
  }
});

btnRefresh?.addEventListener("click", async () => {
  await loadCursos();
  cadeirasEl.innerHTML = `<p class="muted">Escolhe um curso à esquerda</p>`;
  projetosEl.innerHTML = `<p class="muted">Escolhe uma cadeira</p>`;
});

btnMinhasCadeiras?.addEventListener("click", async () => {
  await loadMinhasCadeiras();
});

// init
loadCursos();
