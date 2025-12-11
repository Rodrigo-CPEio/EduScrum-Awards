// =========================
//  ABRIR E FECHAR MODAL
// =========================
const btnAbrirModal = document.getElementById("btnAbrirModal");
const modal = document.getElementById("modalNovaEquipa");
const fechar = document.getElementById("fecharModal");
const numMembrosInput = document.getElementById("numMembros");
const membrosContainer = document.getElementById("membrosContainer");

btnAbrirModal.addEventListener("click", () => modal.style.display = "flex");
fechar.addEventListener("click", () => modal.style.display = "none");
window.addEventListener("click", (e) => {
    if (e.target === modal) modal.style.display = "none";
});


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


// =========================
//  INICIAR PÁGINA
// =========================
loadTeams();
