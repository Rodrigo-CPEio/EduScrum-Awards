// ============================================
// VARIÁVEIS GLOBAIS
// ============================================
let userData = null;
let teacherId = null;
let estudantesSelecionados = [];
let equipasSelecionadas = [];
let awardIdAtual = null;
let targetAtual = null;

// ============================================
// INICIALIZAÇÃO
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  if (!verificarAutenticacao()) return;
  carregarPerfilSidebar();
  configurarBotaoSair();
  inicializarEventos();
  carregarPremios();
});

// ============================================
// AUTENTICAÇÃO
// ============================================
function verificarAutenticacao() {
  const userStr = localStorage.getItem('user');
  if (!userStr) {
    window.location.href = '/login';
    return false;
  }

  const user = JSON.parse(userStr);
  if (user.tipo !== 'docente') {
    alert('Acesso negado. Apenas professores podem acessar esta página.');
    window.location.href = '/login';
    return false;
  }

  userData = user;
  teacherId = user.teacherId;
  return true;
}

// ============================================
// CARREGAR SIDEBAR
// ============================================
function carregarPerfilSidebar() {
  const sidebarUserInfo = document.querySelector('.sidebar .user-info .user-top');
  if (!sidebarUserInfo) return;

  const img = sidebarUserInfo.querySelector('img');
  let avatar = sidebarUserInfo.querySelector('.avatar-placeholder');

  if (avatar) avatar.remove();

  avatar = document.createElement('div');
  avatar.className = 'avatar-placeholder';
  avatar.style.cssText = `
    width: 55px;
    height: 55px;
    border-radius: 50%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 24px;
    font-weight: bold;
  `;

  sidebarUserInfo.insertBefore(avatar, img);

  if (userData.foto) {
    img.src = userData.foto;
    img.style.display = 'block';
    avatar.style.display = 'none';
  } else {
    img.style.display = 'none';
    avatar.style.display = 'flex';
    avatar.textContent = (userData.nome || 'U')[0].toUpperCase();
  }

  const nameEl = sidebarUserInfo.querySelector('.user-details h3');
  const typeEl = sidebarUserInfo.querySelector('.user-details p');
  if (nameEl) nameEl.textContent = userData.nome;
  if (typeEl) typeEl.textContent = 'Docente';
}

// ============================================
// BOTÃO SAIR
// ============================================
function configurarBotaoSair() {
  const botaoSair = document.querySelector('.bottom-menu li:last-child a, .bottom-menu li:last-child');
  if (botaoSair) {
    botaoSair.style.cursor = 'pointer';
    botaoSair.addEventListener('click', (e) => {
      e.preventDefault();
      if (confirm('Tem certeza que deseja sair?')) {
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    });
  }
}

// ============================================
// INICIALIZAÇÃO DE EVENTOS
// ============================================
function inicializarEventos() {
  // Troca de tabs principais
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      tab.classList.add('active');
      document.querySelector(`#tab-${tab.dataset.tab}`).classList.add('active');
    });
  });

  // Subtabs (filtros)
  document.querySelectorAll('.subtab').forEach(subtab => {
    subtab.addEventListener('click', () => {
      const content = subtab.closest('.tab-content');
      const filter = subtab.dataset.filter;
      content.querySelectorAll('.subtab').forEach(s => s.classList.remove('active'));
      subtab.classList.add('active');
      content.querySelectorAll('.premio-card').forEach(card => {
        const show = filter === 'todos' ||
          (filter === 'automaticos' && card.classList.contains('automatico')) ||
          (filter === 'manuais' && card.classList.contains('manual'));
        card.style.display = show ? 'block' : 'none';
      });
    });
  });

  // Modal Novo Prémio
  const modal = document.getElementById('modalPremio');
  const abrir = document.getElementById('abrirModalPremio');
  const fechar = document.getElementById('fecharModalPremio');
  const cancelar = document.getElementById('cancelarPremio');
  
  if (abrir) abrir.onclick = () => modal.style.display = 'flex';
  if (fechar) fechar.onclick = () => modal.style.display = 'none';
  if (cancelar) cancelar.onclick = () => modal.style.display = 'none';
  window.onclick = e => { if (e.target === modal) modal.style.display = 'none'; };

  // Modal Atribuição de Prémios
  const modalAtribuicao = document.getElementById('modalAtribuicao');
  const fecharAtribuicao = document.getElementById('fecharModalAtribuicao');
  const cancelarAtribuicao = document.getElementById('cancelarAtribuicao');
  const btnConfirmarAtribuicao = document.getElementById('confirmarAtribuicao');
  
  if (fecharAtribuicao) fecharAtribuicao.onclick = fecharModalAtribuicao;
  if (cancelarAtribuicao) cancelarAtribuicao.onclick = fecharModalAtribuicao;
  if (btnConfirmarAtribuicao) btnConfirmarAtribuicao.onclick = confirmarAtribuicao;
  window.onclick = e => { 
    if (e.target === modal) modal.style.display = 'none';
    if (e.target === modalAtribuicao) fecharModalAtribuicao();
  };

  // Mostrar ou esconder campo "Condição"
  const tipoSelect = document.getElementById('tipo');
  const condicaoField = document.getElementById('condicaoField');
  tipoSelect.addEventListener('change', () => {
    if (tipoSelect.value === "Automático") {
      condicaoField.classList.remove('hidden');
    } else {
      condicaoField.classList.add('hidden');
    }
  });

  // Formulário para criar novo prémio
  document.getElementById("formPremio").addEventListener("submit", async (e) => {
    e.preventDefault();

    // Detectar qual aba está ativa para determinar o alvo
    const activeTab = document.querySelector('.tab.active');
    console.log('Tab ativa encontrada:', activeTab);
    console.log('Dataset da tab ativa:', activeTab?.dataset);
    
    const tabTarget = activeTab?.dataset.tab; // 'estudantes' ou 'equipas'
    console.log('tabTarget:', tabTarget);
    
    // Se não conseguir detetar, procura pela aba content ativa
    let targetValue = 'estudante'; // fallback padrão
    if (tabTarget === 'estudantes') {
      targetValue = 'estudante';
    } else if (tabTarget === 'equipas') {
      targetValue = 'equipa';
    } else {
      // Fallback: procura qual tab-content está ativo
      const activeContent = document.querySelector('.tab-content.active');
      console.log('Tab content ativa:', activeContent);
      if (activeContent?.id === 'tab-equipas') {
        targetValue = 'equipa';
      }
    }

    console.log('A_Target a enviar:', targetValue);

    const data = {
      A_Name: document.getElementById('nome').value,
      A_Description: document.getElementById('descricao').value,
      A_Points: document.getElementById('pontos').value,
      A_Type: document.getElementById('tipo').value,
      A_Trigger_Condition: document.getElementById('condicao').value || null,
      A_T_ID: teacherId || 2, // Usar teacherId do localStorage
      A_Target: targetValue
    };

    try {
      const res = await fetch('/awards', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
      });

      const out = await res.json();
      
      if (!res.ok) {
        console.error('Erro do servidor:', out);
        alert('Erro ao criar prémio: ' + (out.error || 'Erro desconhecido'));
        return;
      }
      
      alert("Prémio criado! ID = " + (out.id || 'sucesso'));
      
      // Limpar formulário
      document.getElementById("formPremio").reset();
      
      // Fechar modal
      modal.style.display = 'none';
      
      // Recarregar prémios
      carregarPremios();
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao criar prémio');
    }
  });
}

// ============================================
// FUNÇÕES DE ATRIBUIÇÃO DE PRÉMIOS
// ============================================

// Abrir modal de atribuição
async function abrirModalAtribuicao(awardId, awardName, target) {
  console.log('abrirModalAtribuicao chamada com:', { awardId, awardName, target });
  
  awardIdAtual = awardId;
  targetAtual = target;
  
  const modal = document.getElementById('modalAtribuicao');
  console.log('Modal encontrado:', modal);
  
  const titulo = document.getElementById('tituloAtribuicao');
  titulo.textContent = `Atribuir: ${awardName}`;
  
  // Limpar seleções anteriores
  estudantesSelecionados = [];
  equipasSelecionadas = [];
  
  // Mostrar lista apropriada
  if (target === 'estudante') {
    await carregarEstudantes();
    document.getElementById('listaEstudantes').style.display = 'block';
    document.getElementById('listaEquipas').style.display = 'none';
  } else {
    await carregarEquipas();
    document.getElementById('listaEstudantes').style.display = 'none';
    document.getElementById('listaEquipas').style.display = 'block';
  }
  
  modal.style.display = 'flex';
  console.log('Modal aberto');
}

// Fechar modal
function fecharModalAtribuicao() {
  const modal = document.getElementById('modalAtribuicao');
  modal.style.display = 'none';
}

// Carregar estudantes
async function carregarEstudantes() {
  try {
    const res = await fetch('/awardassignments/estudantes/lista');
    const estudantes = await res.json();
    
    console.log('Estudantes carregados:', estudantes);
    
    const container = document.getElementById('containerEstudantes');
    container.innerHTML = '';
    
    estudantes.forEach(estudante => {
      const label = document.createElement('label');
      label.className = 'checkbox-item';
      label.innerHTML = `
        <input type="checkbox" data-id="${estudante.S_ID}" data-name="${estudante.U_Name}">
        <span>${estudante.U_Name}</span>
      `;
      container.appendChild(label);
      
      // Adicionar listener para checkbox
      label.querySelector('input').addEventListener('change', (e) => {
        if (e.target.checked) {
          estudantesSelecionados.push({
            id: estudante.S_ID,
            name: estudante.U_Name
          });
        } else {
          estudantesSelecionados = estudantesSelecionados.filter(s => s.id !== estudante.S_ID);
        }
        console.log('Estudantes selecionados:', estudantesSelecionados);
      });
    });
  } catch (error) {
    console.error('Erro ao carregar estudantes:', error);
    alert('Erro ao carregar estudantes');
  }
}

// Carregar equipas
async function carregarEquipas() {
  try {
    const res = await fetch('/awardassignments/equipas/lista');
    const equipas = await res.json();
    
    console.log('Equipas carregadas:', equipas);
    
    const container = document.getElementById('containerEquipas');
    container.innerHTML = '';
    
    equipas.forEach(equipa => {
      const label = document.createElement('label');
      label.className = 'checkbox-item';
      label.innerHTML = `
        <input type="checkbox" data-id="${equipa.TE_ID}" data-name="${equipa.TE_Name}">
        <span>${equipa.TE_Name} (${equipa.MemberCount} membros)</span>
      `;
      container.appendChild(label);
      
      // Adicionar listener para checkbox
      label.querySelector('input').addEventListener('change', (e) => {
        if (e.target.checked) {
          equipasSelecionadas.push({
            id: equipa.TE_ID,
            name: equipa.TE_Name
          });
        } else {
          equipasSelecionadas = equipasSelecionadas.filter(t => t.id !== equipa.TE_ID);
        }
        console.log('Equipas selecionadas:', equipasSelecionadas);
      });
    });
  } catch (error) {
    console.error('Erro ao carregar equipas:', error);
    alert('Erro ao carregar equipas');
  }
}

// Confirmar atribuição
async function confirmarAtribuicao() {
  console.log('confirmarAtribuicao chamada');
  
  const motivo = document.getElementById('motivoAtribuicao').value || 'Sem motivo especificado';
  
  const selecionados = targetAtual === 'estudante' ? estudantesSelecionados : equipasSelecionadas;
  
  console.log('Selecionados:', selecionados);
  console.log('Award ID:', awardIdAtual);
  console.log('Target:', targetAtual);
  
  if (selecionados.length === 0) {
    alert('Por favor, selecione pelo menos um ' + (targetAtual === 'estudante' ? 'estudante' : 'equipa'));
    return;
  }
  
  try {
    for (const item of selecionados) {
      const endpoint = targetAtual === 'estudante' ? '/awardassignments/estudante' : '/awardassignments/equipa';
      const bodyData = {
        awardId: awardIdAtual,
        teacherId: teacherId || 2, // Usar teacherId do localStorage
        reason: motivo
      };
      
      if (targetAtual === 'estudante') {
        bodyData.studentId = item.id;
      } else {
        bodyData.teamId = item.id;
      }
      
      console.log('Enviando dados:', bodyData, 'para:', endpoint);
      
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData)
      });
      
      console.log('Resposta status:', res.status);
      
      if (!res.ok) {
        const error = await res.json();
        console.error('Erro do servidor:', error);
        throw new Error(error.error || 'Erro ao atribuir prémio');
      }
    }
    
    alert(`Prémio atribuído com sucesso a ${selecionados.length} ${targetAtual === 'estudante' ? 'estudante(s)' : 'equipa(s)'}`);
    fecharModalAtribuicao();
    carregarPremios(); // Recarregar prémios
  } catch (error) {
    console.error('Erro ao atribuir prémio:', error);
    alert('Erro ao atribuir prémio: ' + error.message);
  }
}

// ============================================
// GESTÃO DE PRÉMIOS
// ============================================

// Função para carregar prémios por alvo (global)
async function carregarPremiosPorAlvo(target) {
  try {
    console.log(`Iniciando carregamento de prémios para: ${target}`);
    const res = await fetch(`/awards/${target}`);
    const premios = await res.json();

    console.log(`Prémios carregados para ${target}:`, premios);

    if (!Array.isArray(premios)) {
      console.error('Resposta não é um array:', premios);
      return;
    }

    const grid = document.querySelector(`#tab-${target} .premio-grid`);
    console.log(`Grid encontrado para ${target}:`, grid);
    if (!grid) {
      console.error(`Grid não encontrado para #tab-${target} .premio-grid`);
      return;
    }
    
    // Remover prémios dinâmicos anteriores
    grid.querySelectorAll('.premio-card.dinamico').forEach(card => card.remove());
    
    // Adicionar novos prémios ao grid correspondente
    premios.forEach(premio => {
      const tipo = premio.A_Type === 'Automático' ? 'automatico' : 'manual';
      const tipoClass = premio.A_Type === 'Automático' ? 'auto' : 'manual';
      const tipoLabel = premio.A_Type === 'Automático' ? 'Automático' : 'Manual';
      
      const card = document.createElement('div');
      card.className = `premio-card dinamico ${tipo}`;
      card.innerHTML = `
        <button class="btn-delete-premio" onclick="apagarPremio(${premio.A_ID}, this)" title="Apagar prémio">
          <i class="fa-solid fa-trash"></i>
        </button>
        <button class="btn-atribuir-premio" onclick="abrirModalAtribuicao(${premio.A_ID}, '${premio.A_Name.replace(/'/g, "\\'")}', '${target === 'estudantes' ? 'estudante' : 'equipa'}')" title="Atribuir prémio">
          <i class="fa-solid fa-gift"></i>
        </button>
        <h3>${premio.A_Name}</h3>
        <p>${premio.A_Description}</p>
        <div class="premio-info"><span>+${premio.A_Points} pontos</span><span class="tipo ${tipoClass}">${tipoLabel}</span></div>
      `;
      
      grid.appendChild(card);
    });
  } catch (error) {
    console.error(`Erro ao carregar prémios de ${target}:`, error);
  }
}

// Função para carregar prémios (global)
async function carregarPremios() {
  carregarPremiosPorAlvo('estudantes');
  carregarPremiosPorAlvo('equipas');
}

// Função para apagar prémio (global)
async function apagarPremio(premioId, botao) {
  if (confirm('Tem certeza que deseja apagar este prémio?')) {
    try {
      const res = await fetch(`/awards/${premioId}`, {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'}
      });

      if (res.ok) {
        // Remover o card imediatamente do DOM
        const card = botao.closest('.premio-card');
        card.style.opacity = '0';
        card.style.transition = 'opacity 0.3s ease';
        setTimeout(() => {
          card.remove();
        }, 300);
        
        alert('Prémio apagado com sucesso!');
      } else {
        alert('Erro ao apagar prémio');
      }
    } catch (error) {
      console.error('Erro ao apagar prémio:', error);
      alert('Erro ao apagar prémio');
    }
  }
}