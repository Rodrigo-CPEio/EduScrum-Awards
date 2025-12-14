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

let selectedCourseId = null;
let selectedDiscId = null;

// ========================
// UI helpers (sin badges)
// ========================
function card({ title, desc, footerHtml = "", active = false, dataAttrs = "" }) {
  return `
    <div class="acad-card ${active ? "active" : ""}" ${dataAttrs}>
      <div class="acad-card-body">
        <h3 class="acad-card-title">${title}</h3>
        ${desc ? `<p class="acad-card-desc">${desc}</p>` : `<p class="acad-card-desc muted">Sem descrição</p>`}
      </div>
      ${footerHtml ? `<div class="acad-card-actions">${footerHtml}</div>` : ""}
    </div>
  `;
}

async function safeJson(res) {
  try { return await res.json(); } catch { return null; }
}

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
// Cursos
// ========================
async function loadCursos() {
  cursosEl.innerHTML = `<p class="muted">A carregar cursos...</p>`;
  try {
    const cursos = await apiGet("/api/cursos");

    if (!Array.isArray(cursos) || cursos.length === 0) {
      cursosEl.innerHTML = `<p class="muted">Sem cursos.</p>`;
      return;
    }

    cursosEl.innerHTML = cursos.map(c => {
      const active = Number(c.C_ID) === Number(selectedCourseId);
      return card({
        title: c.C_Name,
        desc: c.C_Description || "",
        active,
        dataAttrs: `data-course-card="${c.C_ID}"`,
        footerHtml: `
          <button class="btn sm ghost" data-action="verCadeiras" data-course="${c.C_ID}">Ver cadeiras</button>
          <button class="btn sm primary" data-action="joinCurso" data-course="${c.C_ID}">Unirme</button>
        `
      });
    }).join("");
  } catch (err) {
    console.error(err);
    cursosEl.innerHTML = `<p class="muted">Erro a carregar cursos.</p>`;
  }
}

// ========================
// Cadeiras por curso
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
      return card({
        title: d.D_Name,
        desc: d.D_Description || "",
        dataAttrs: `data-disc-card="${d.D_ID}"`,
        footerHtml: `
          <button class="btn sm ghost" data-action="verProjetos" data-disc="${d.D_ID}">Ver projetos</button>
          <button class="btn sm primary" data-action="joinCadeira" data-disc="${d.D_ID}">Unirme</button>
        `
      });
    }).join("");

    // resaltar curso seleccionado
    document.querySelectorAll("[data-course-card]").forEach(el => el.classList.remove("active"));
    const courseCard = document.querySelector(`[data-course-card="${courseId}"]`);
    if (courseCard) courseCard.classList.add("active");

  } catch (err) {
    console.error(err);
    cadeirasEl.innerHTML = `<p class="muted">Erro a carregar cadeiras.</p>`;
  }
}

// ========================
// Minhas Cadeiras
// ========================
async function loadMinhasCadeiras() {
  selectedCourseId = null;
  selectedDiscId = null;

  cadeirasEl.innerHTML = `<p class="muted">A carregar as tuas cadeiras...</p>`;
  projetosEl.innerHTML = `<p class="muted">Escolhe uma cadeira</p>`;

  try {
    const cadeiras = await apiGet(`/api/cadeiras/me?studentId=${studentId}`);

    if (!Array.isArray(cadeiras) || cadeiras.length === 0) {
      cadeirasEl.innerHTML = `<p class="muted">Ainda não estás matriculado em cadeiras.</p>`;
      return;
    }

    cadeirasEl.innerHTML = cadeiras.map(d => card({
      title: d.D_Name,
      desc: d.D_Description || "",
      dataAttrs: `data-disc-card="${d.D_ID}"`,
      footerHtml: `
        <button class="btn sm ghost" data-action="verProjetos" data-disc="${d.D_ID}">Ver projetos</button>
      `
    })).join("");

  } catch (err) {
    console.error(err);
    cadeirasEl.innerHTML = `<p class="muted">Erro a carregar as tuas cadeiras.</p>`;
  }
}

// ========================
// Projetos por cadeira (separa Individual / Equipa)
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

    const renderProj = (arr) => arr.map(p => card({
      title: p.P_Name,
      desc: p.P_Description || "",
      footerHtml: `
        <span class="chip ${p.P_Mode === "Individual" ? "chip-ind" : "chip-team"}">
          ${p.P_Mode === "Individual" ? "Individual" : "Equipa"}
        </span>
      `
    })).join("");

    projetosEl.innerHTML = `
      <div class="proj-group">
        <div class="proj-group-head">
          <h3>Projetos de Equipa</h3>
          <span class="count">${team.length}</span>
        </div>
        ${team.length ? renderProj(team) : `<p class="muted">Nenhum projeto de equipa.</p>`}
      </div>

      <div class="proj-group">
        <div class="proj-group-head">
          <h3>Projetos Individuais</h3>
          <span class="count">${indiv.length}</span>
        </div>
        ${indiv.length ? renderProj(indiv) : `<p class="muted">Nenhum projeto individual.</p>`}
      </div>
    `;

    // resaltar cadeira seleccionada
    document.querySelectorAll("[data-disc-card]").forEach(el => el.classList.remove("active"));
    const discCard = document.querySelector(`[data-disc-card="${disciplinaId}"]`);
    if (discCard) discCard.classList.add("active");

  } catch (err) {
    console.error(err);
    projetosEl.innerHTML = `<p class="muted">Erro a carregar projetos.</p>`;
  }
}

// ========================
// Click actions
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
      alert(data.message || "Matriculado no curso!");
      await loadCadeiras(courseId);
    }

    if (action === "joinCadeira") {
      const discId = Number(btn.dataset.disc);
      const data = await apiPost(`/api/cadeiras/${discId}/join`, { studentId });
      alert(data.message || "Matriculado na cadeira!");
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
