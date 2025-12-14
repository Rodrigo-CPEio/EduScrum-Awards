const sessionUser = JSON.parse(localStorage.getItem("user") || "{}");
const studentId = Number(sessionUser.studentId);

if (!studentId) {
  alert("Sessão inválida. Inicia sessão novamente.");
  window.location.href = "/login";
}

// DOM
const studentNameEl = document.getElementById("studentName");

const fullNameEl = document.getElementById("fullName");
const emailEl = document.getElementById("email");
const yearEl = document.getElementById("year");
const classNameEl = document.getElementById("className");

const btnSave = document.getElementById("btnSaveProfile");

const nameHelp = document.getElementById("nameHelp");
const emailHelp = document.getElementById("emailHelp");

function setHelp(el, msg, isError=false){
  if(!el) return;
  el.textContent = msg || "";
  el.classList.toggle("error", !!isError);
}

async function safeJson(res){ try { return await res.json(); } catch { return null; } }

async function apiGet(url){
  const res = await fetch(url);
  const data = await safeJson(res);
  if(!res.ok) throw new Error(data?.message || `Erro GET ${url}`);
  return data;
}

async function apiPut(url, body){
  const res = await fetch(url, {
    method: "PUT",
    headers: { "Content-Type":"application/json" },
    body: JSON.stringify(body)
  });
  const data = await safeJson(res);
  if(!res.ok) throw new Error(data?.message || `Erro PUT ${url}`);
  return data;
}

async function loadProfile(){
  const data = await apiGet(`/api/students/me?studentId=${studentId}`);

  // sidebar name
  if(studentNameEl) studentNameEl.textContent = data.name || "Estudante";

  // form
  fullNameEl.value = data.name || "";
  emailEl.value = data.email || "";
  yearEl.value = data.year || "";
  classNameEl.value = data.className || "";
}

btnSave?.addEventListener("click", async () => {
  setHelp(nameHelp, "");
  setHelp(emailHelp, "");

  const payload = {
    name: fullNameEl.value.trim(),
    email: emailEl.value.trim(),
    year: yearEl.value.trim() || null,
    className: classNameEl.value.trim() || null
  };

  if(payload.name.length < 2){
    setHelp(nameHelp, "Nome muito curto.", true);
    return;
  }
  if(!payload.email.includes("@")){
    setHelp(emailHelp, "Email inválido.", true);
    return;
  }

  try{
    await apiPut(`/api/students/me?studentId=${studentId}`, payload);
    alert("✅ Perfil atualizado com sucesso!");
    await loadProfile();
  }catch(err){
    console.error(err);
    alert("Erro ao guardar: " + err.message);
  }
});

loadProfile().catch(err => {
  console.error(err);
  alert("Erro ao carregar perfil: " + err.message);
});
