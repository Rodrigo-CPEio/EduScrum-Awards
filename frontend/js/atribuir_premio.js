// Variáveis globais
let estudantesSelecionados = [];
let equipasSelecionadas = [];
let awardIdAtual = null;
let targetAtual = null;

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
  document.getElementById('modalAtribuicao').style.display = 'none';
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
  const motivo = document.getElementById('motivoAtribuicao').value;
  
  if (!motivo.trim()) {
    alert('Por favor, insira um motivo');
    return;
  }
  
  const selecionados = targetAtual === 'estudante' ? estudantesSelecionados : equipasSelecionadas;
  
  if (selecionados.length === 0) {
    alert('Por favor, selecione pelo menos um ' + (targetAtual === 'estudante' ? 'estudante' : 'equipa'));
    return;
  }
  
  try {
    for (const item of selecionados) {
      const endpoint = targetAtual === 'estudante' ? '/awardassignments/estudante' : '/awardassignments/equipa';
      const bodyData = {
        awardId: awardIdAtual,
        teacherId: 2, // Professor logado (hardcoded por enquanto)
        reason: motivo
      };
      
      if (targetAtual === 'estudante') {
        bodyData.studentId = item.id;
      } else {
        bodyData.teamId = item.id;
      }
      
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData)
      });
      
      if (!res.ok) {
        const error = await res.json();
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

// Inicializar quando DOM está pronto
document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('modalAtribuicao');
  const fecharBtn = document.getElementById('fecharModalAtribuicao');
  const cancelarBtn = document.getElementById('cancelarAtribuicao');
  const confirmarBtn = document.getElementById('confirmarAtribuicao');
  
  if (fecharBtn) fecharBtn.onclick = fecharModalAtribuicao;
  if (cancelarBtn) cancelarBtn.onclick = fecharModalAtribuicao;
  if (confirmarBtn) confirmarBtn.onclick = confirmarAtribuicao;
  
  window.onclick = (e) => {
    if (e.target === modal) fecharModalAtribuicao();
  };
});