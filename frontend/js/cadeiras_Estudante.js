const user = JSON.parse(localStorage.getItem("user") || "{}");
const studentId = Number(user.studentId);

if (!studentId) {
  alert("Inicia sesión como estudiante.");
  window.location.href = "/login";
}

const cursosEl = document.getElementById("cursosContainer");
const cadeirasEl = document.getElementById("cadeirasContainer");
const projetosEl = document.getElementById("projetosContainer");

// ------------------
// cargar cursos
// ------------------
async function loadCursos() {
  cursosEl.innerHTML = "A carregar cursos...";
  const res = await fetch("/api/cursos");
  const cursos = await res.json();

  cursosEl.innerHTML = cursos.map(c => `
    <div class="card">
      <div style="display:flex;justify-content:space-between;align-items:center;gap:12px;">
        <div>
          <h3>${c.C_Name}</h3>
          <p style="opacity:.8">${c.C_Description || ""}</p>
        </div>
        <div style="display:flex;gap:10px;">
          <button class="btn" data-action="verCadeiras" data-course="${c.C_ID}">Ver cadeiras</button>
          <button class="btn primary" data-action="joinCurso" data-course="${c.C_ID}">Unirme al curso</button>
        </div>
      </div>
    </div>
  `).join("");
}

// ------------------
// cargar cadeiras por curso
// ------------------
async function loadCadeirasByCurso(courseId) {
  cadeirasEl.innerHTML = "A carregar cadeiras...";
  projetosEl.innerHTML = "";

  const res = await fetch(`/api/cursos/${courseId}/cadeiras`);
  const cadeiras = await res.json();

  if (!Array.isArray(cadeiras) || cadeiras.length === 0) {
    cadeirasEl.innerHTML = "<em>Este curso não tem cadeiras.</em>";
    return;
  }

  cadeirasEl.innerHTML = cadeiras.map(d => `
    <div class="card">
      <div style="display:flex;justify-content:space-between;align-items:center;gap:12px;">
        <div>
          <h3>${d.D_Name}</h3>
          <p style="opacity:.8">${d.D_Description || ""}</p>
        </div>
        <div style="display:flex;gap:10px;">
          <button class="btn" data-action="verProjetos" data-disc="${d.D_ID}">Ver projetos</button>
          <button class="btn primary" data-action="joinCadeira" data-disc="${d.D_ID}">Unirme</button>
        </div>
      </div>
    </div>
  `).join("");
}

// ------------------
// cargar proyectos por cadeira
// ------------------
async function loadProjetos(disciplinaId) {
  projetosEl.innerHTML = "A carregar projetos...";

  const res = await fetch(`/api/cadeiras/${disciplinaId}/projetos`);
  const projetos = await res.json();

  if (!Array.isArray(projetos) || projetos.length === 0) {
    projetosEl.innerHTML = "<em>Sem projetos nesta cadeira.</em>";
    return;
  }

  projetosEl.innerHTML = projetos.map(p => `
    <div class="card">
      <div style="display:flex;justify-content:space-between;align-items:center;gap:12px;">
        <div>
          <h3>${p.P_Name}</h3>
          <p style="opacity:.8">${p.P_Description || ""}</p>
        </div>
        <span class="badge ${p.P_Mode === "Individual" ? "ind" : "team"}">
          ${p.P_Mode === "Individual" ? "🧍 Individual" : "👥 Equipa"}
        </span>
      </div>
    </div>
  `).join("");
}

// ------------------
// clicks
// ------------------
document.addEventListener("click", async (e) => {
  const btn = e.target.closest("button[data-action]");
  if (!btn) return;

  const action = btn.dataset.action;

  if (action === "verCadeiras") {
    await loadCadeirasByCurso(btn.dataset.course);
  }

  if (action === "joinCurso") {
    const courseId = Number(btn.dataset.course);
    const res = await fetch(`/api/cursos/${courseId}/join`, {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({ studentId })
    });
    const data = await res.json().catch(() => ({}));
    alert(data.message || "OK");
  }

  if (action === "joinCadeira") {
    const discId = Number(btn.dataset.disc);
    const res = await fetch(`/api/cadeiras/${discId}/join`, {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({ studentId })
    });
    const data = await res.json().catch(() => ({}));
    alert(data.message || "OK");
  }

  if (action === "verProjetos") {
    await loadProjetos(btn.dataset.disc);
  }
});

loadCursos();
