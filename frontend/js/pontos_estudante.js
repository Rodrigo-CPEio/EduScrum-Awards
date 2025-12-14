(() => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const studentId = Number(user.studentId);

  console.log("📌 pontos_estudante.js -> user:", user);
  console.log("📌 pontos_estudante.js -> studentId:", studentId);

  if (!studentId) {
    console.warn("Sessão inválida (sem studentId).");
    return;
  }

  async function safeJson(res) { try { return await res.json(); } catch { return null; } }

  async function apiGet(url) {
    const res = await fetch(url);
    const data = await safeJson(res);
    if (!res.ok) throw new Error(data?.message || data?.error || `Erro GET ${url}`);
    return data;
  }

  const studentNameEl = document.getElementById("studentName");
  const sidebarPointsEl = document.getElementById("sidebarPoints");

  (async () => {
    try {
      const data = await apiGet(`/api/dashboard/me?studentId=${studentId}`);
      console.log("✅ pontos_estudante.js -> data:", data);

      if (studentNameEl) studentNameEl.textContent = data.name || "Estudante";
      if (sidebarPointsEl) sidebarPointsEl.textContent = String(data.totalPoints ?? 0);
    } catch (e) {
      console.error("❌ pontos_estudante.js error:", e);
    }
  })();
})();
