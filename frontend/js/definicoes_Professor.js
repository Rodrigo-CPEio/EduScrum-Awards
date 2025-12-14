// ============================================
// VARIÁVEIS GLOBAIS
// ============================================
let userData = null;
let teacherId = null;

// ============================================
// INICIALIZAÇÃO
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  if (!verificarAutenticacao()) return;
  
  // Inicializar sidebar
  inicializarSidebar({
    userType: 'professor',
    activePage: '',
    userData: {
      nome: userData.nome,
      foto: userData.foto || null
    }
  });

  configurarBotaoSair();
  carregarPerfil();
  configurarFormularioPerfil();
  configurarFormularioSenha();
  configurarBotaoFoto();
  configurarNotificacoes();
  configurarExportarDados();
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
// BOTÃO SAIR
// ============================================
function configurarBotaoSair() {
  setTimeout(() => {
    const botaoSair = document.querySelector('.bottom-menu li:last-child');
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
  }, 100);
}

// ============================================
// CARREGAR PERFIL
// ============================================
async function carregarPerfil() {
  try {
    const response = await fetch(`/usuarios/profile/${userData.id}`);
    const data = await response.json();
    
    if (data.success) {
      const perfil = data.perfil;
      preencherFormulario(perfil);
    }
  } catch (err) {
    console.error('Erro ao carregar perfil:', err);
  }
}

// ============================================
// PREENCHER FORMULÁRIO
// ============================================
function preencherFormulario(perfil) {
  // Nome
  const inputNome = document.querySelector('.profile-form input[type="text"]');
  if (inputNome) {
    inputNome.value = perfil.nome || '';
    inputNome.removeAttribute('readonly');
  }

  // Email (readonly)
  const inputEmail = document.querySelector('.profile-form input[type="email"]');
  if (inputEmail) {
    inputEmail.value = perfil.email || '';
  }

  // Tipo (readonly)
  const inputTipo = document.querySelectorAll('.profile-form input[type="text"]')[1];
  if (inputTipo) {
    inputTipo.value = perfil.tipo === 'docente' ? 'Docente' : 'Estudante';
  }

  // Foto
  const photoContainer = document.querySelector('.photo-top');
  const imgCard = photoContainer.querySelector('img');
  let avatarCard = photoContainer.querySelector('.avatar-placeholder');

  if (avatarCard) {
    avatarCard.remove();
  }

  avatarCard = document.createElement('div');
  avatarCard.className = 'avatar-placeholder';
  avatarCard.style.cssText = `
    width: 120px;
    height: 120px;
    border-radius: 50%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 48px;
    font-weight: bold;
    border: 3px solid #f0f0f0;
  `;
  
  photoContainer.insertBefore(avatarCard, imgCard);

  if (perfil.foto) {
    imgCard.src = perfil.foto;
    imgCard.style.display = 'block';
    avatarCard.style.display = 'none';
  } else {
    imgCard.style.display = 'none';
    avatarCard.style.display = 'flex';
    avatarCard.textContent = (perfil.nome || 'U')[0].toUpperCase();
  }

  userData.nome = perfil.nome;
  userData.email = perfil.email;
  userData.foto = perfil.foto;
}

// ============================================
// FORMULÁRIO PERFIL
// ============================================
function configurarFormularioPerfil() {
  const form = document.querySelector('.profile-form');
  const btnSalvar = form.querySelector('.save-btn');
  
  btnSalvar.addEventListener('click', async (e) => {
    e.preventDefault();
    
    const nome = form.querySelector('input[type="text"]').value.trim();
    
    if (!nome) {
      alert('Por favor, preencha o nome');
      return;
    }
    
    try {
      const response = await fetch(`/usuarios/profile/${userData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome })
      });
      
      const data = await response.json();
      
      if (data.success) {
        alert('✅ Perfil atualizado com sucesso!');
        
        const user = JSON.parse(localStorage.getItem('user'));
        user.nome = nome;
        localStorage.setItem('user', JSON.stringify(user));
        
        const sidebarName = document.querySelector('.sidebar .user-details h3');
        if (sidebarName) sidebarName.textContent = nome;
        
        carregarPerfil();
      } else {
        alert(data.error || 'Erro ao atualizar perfil');
      }
    } catch (err) {
      console.error('Erro:', err);
      alert('Erro ao atualizar perfil');
    }
  });
}

// ============================================
// FORMULÁRIO SENHA
// ============================================
function configurarFormularioSenha() {
  const formSenha = document.querySelectorAll('.profile-form')[1];
  const btnSalvarSenha = formSenha.querySelector('.save-btn');
  
  btnSalvarSenha.addEventListener('click', async (e) => {
    e.preventDefault();
    
    const inputs = formSenha.querySelectorAll('input[type="password"]');
    const senhaAtual = inputs[0].value;
    const novaSenha = inputs[1].value;
    const confirmarSenha = inputs[2].value;
    
    if (!senhaAtual || !novaSenha || !confirmarSenha) {
      alert('Por favor, preencha todos os campos');
      return;
    }
    
    if (novaSenha !== confirmarSenha) {
      alert('As senhas não coincidem');
      return;
    }
    
    if (novaSenha.length < 6) {
      alert('A nova senha deve ter pelo menos 6 caracteres');
      return;
    }
    
    try {
      const response = await fetch(`/usuarios/password/${userData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          passwordAtual: senhaAtual,
          novaSenha: novaSenha
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        alert('✅ Senha alterada com sucesso!');
        formSenha.reset();
      } else {
        alert(data.error || 'Erro ao alterar senha');
      }
    } catch (err) {
      console.error('Erro:', err);
      alert('Erro ao alterar senha');
    }
  });
}

// ============================================
// BOTÃO FOTO
// ============================================
function configurarBotaoFoto() {
  const btnUpload = document.querySelector('.btn-upload');
  const photoContainer = document.querySelector('.photo-top');
  const imgCard = photoContainer.querySelector('img');
  
  btnUpload.addEventListener('click', () => {
    const inputFile = document.createElement('input');
    inputFile.type = 'file';
    inputFile.accept = 'image/*';
    inputFile.click();

    inputFile.onchange = async () => {
      const file = inputFile.files[0];
      if (!file) return;

      if (file.size > 2 * 1024 * 1024) {
        alert('A imagem deve ter no máximo 2MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64 = e.target.result;

        const avatarCard = photoContainer.querySelector('.avatar-placeholder');
        imgCard.src = base64;
        imgCard.style.display = 'block';
        if (avatarCard) avatarCard.style.display = 'none';

        const sidebarUserInfo = document.querySelector('.sidebar .user-info .user-top');
        if (sidebarUserInfo) {
          const sidebarImg = sidebarUserInfo.querySelector('img');
          const sidebarAvatar = sidebarUserInfo.querySelector('.avatar-placeholder');
          
          if (sidebarImg) {
            sidebarImg.src = base64;
            sidebarImg.style.display = 'block';
          }
          if (sidebarAvatar) {
            sidebarAvatar.style.display = 'none';
          }
        }

        try {
          const response = await fetch(`/usuarios/profile/${userData.id}/foto`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ foto: base64 })
          });

          const data = await response.json();
          if (data.success) {
            alert('✅ Foto atualizada com sucesso!');
            
            userData.foto = base64;
            const user = JSON.parse(localStorage.getItem('user'));
            user.foto = base64;
            localStorage.setItem('user', JSON.stringify(user));
          } else {
            alert(data.error || 'Erro ao atualizar foto');
          }
        } catch (err) {
          console.error('Erro ao atualizar foto:', err);
          alert('Erro ao atualizar foto');
        }
      };

      reader.readAsDataURL(file);
    };
  });
}

// ============================================
// NOTIFICAÇÕES
// ============================================
function configurarNotificacoes() {
  const btnSalvarNotif = document.querySelector('.notif-save');
  
  if (btnSalvarNotif) {
    btnSalvarNotif.addEventListener('click', () => {
      const switches = document.querySelectorAll('.notif-item input[type="checkbox"]');
      const preferencias = {};
      
      switches.forEach((sw, index) => {
        preferencias[`notif_${index}`] = sw.checked;
      });
      
      alert('✅ Preferências de notificações guardadas!');
    });
  }
}

// ============================================
// EXPORTAR DADOS - SUBSTITUIR A FUNÇÃO EXISTENTE
// ============================================
function configurarExportarDados() {
  const btnExportar = document.querySelector('.btn-export');
  
  if (btnExportar) {
    btnExportar.addEventListener('click', async () => {
      await exportarDadosCSV();
    });
  }
}

// ============================================
// FUNÇÃO DE EXPORTAÇÃO CSV
// ============================================
async function exportarDadosCSV() {
  try {
    // Mostrar loading
    const btnExportar = document.querySelector('.btn-export');
    const textoOriginal = btnExportar ? btnExportar.textContent : '';
    if (btnExportar) {
      btnExportar.textContent = 'Exportando...';
      btnExportar.disabled = true;
    }

    // Buscar todos os dados necessários
    const [equipas, cursos, premios] = await Promise.all([
      fetch('http://localhost:3000/api/teams').then(r => r.json()),
      fetch(`/cursos/professor/${teacherId}`).then(r => r.json()),
      fetch('/awardassignments/professor/' + teacherId).then(r => r.json()).catch(() => [])
    ]);

    // Processar dados dos cursos
    const cursosData = cursos.success ? cursos.cursos : [];
    
    // Criar CSV ÚNICO com todas as informações
    const csvCompleto = gerarCSVCompleto(equipas, cursosData, premios);

    // Baixar arquivo único
    const dataAtual = new Date().toISOString().split('T')[0];
    downloadCSV(csvCompleto, `dashboard_completo_${dataAtual}.csv`);

    alert('✅ Dados exportados com sucesso!\n\nArquivo: dashboard_completo_' + dataAtual + '.csv');

  } catch (error) {
    console.error('Erro ao exportar dados:', error);
    alert('❌ Erro ao exportar dados: ' + error.message);
  } finally {
    // Restaurar botão
    const btnExportar = document.querySelector('.btn-export');
    if (btnExportar) {
      btnExportar.textContent = textoOriginal || 'Exportar Dados';
      btnExportar.disabled = false;
    }
  }
}

// =========================
//  GERAR CSV COMPLETO - TODAS AS INFORMAÇÕES
// =========================
function gerarCSVCompleto(equipas, cursos, premios) {
  const linhas = [];
  const separador = '='.repeat(80);
  
  // ==========================================
  // SEÇÃO 1: RESUMO GERAL
  // ==========================================
  linhas.push('RESUMO GERAL DO DASHBOARD');
  linhas.push(separador);
  linhas.push('');
  
  // Estatísticas de Equipas
  const totalEquipas = equipas.length;
  const totalMembros = equipas.reduce((sum, t) => sum + (t.members?.length || 0), 0);
  const totalTarefas = equipas.reduce((sum, t) => sum + (t.tasks?.length || 0), 0);
  const tarefasConcluidas = equipas.reduce((sum, t) => 
    sum + (t.tasks?.filter(task => task.completed || task.T_Completed).length || 0), 0);
  
  linhas.push('Categoria,Métrica,Valor');
  linhas.push(`Equipas,Total de Equipas,${totalEquipas}`);
  linhas.push(`Equipas,Total de Membros,${totalMembros}`);
  linhas.push(`Equipas,Total de Tarefas,${totalTarefas}`);
  linhas.push(`Equipas,Tarefas Concluídas,${tarefasConcluidas}`);
  linhas.push(`Equipas,Taxa de Conclusão,${totalTarefas > 0 ? ((tarefasConcluidas/totalTarefas)*100).toFixed(1) : 0}%`);
  
  // Estatísticas de Cursos
  const totalCursos = cursos.length;
  const totalEstudantesCursos = cursos.reduce((sum, c) => sum + (c.totalEstudantes || 0), 0);
  
  linhas.push(`Cursos,Total de Cursos,${totalCursos}`);
  linhas.push(`Cursos,Total de Estudantes,${totalEstudantesCursos}`);
  
  // Estatísticas de Prêmios
  const totalPremios = Array.isArray(premios) ? premios.length : 0;
  
  linhas.push(`Prêmios,Total Atribuídos,${totalPremios}`);
  linhas.push(`Geral,Data de Exportação,${new Date().toLocaleString('pt-PT')}`);
  
  // ==========================================
  // SEÇÃO 2: CURSOS
  // ==========================================
  linhas.push('');
  linhas.push('');
  linhas.push('CURSOS');
  linhas.push(separador);
  linhas.push('');
  linhas.push('ID Curso,Nome do Curso,Descrição,Total Estudantes,Data de Criação');
  
  cursos.forEach(curso => {
    const id = curso.id || '';
    const nome = escapeCSV(curso.nome || '');
    const descricao = escapeCSV(curso.descricao || '');
    const totalEstudantes = curso.totalEstudantes || 0;
    const dataCriacao = curso.criadoEm || 'N/A';
    
    linhas.push(`${id},"${nome}","${descricao}",${totalEstudantes},"${dataCriacao}"`);
  });
  
  // ==========================================
  // SEÇÃO 3: EQUIPAS - RESUMO
  // ==========================================
  linhas.push('');
  linhas.push('');
  linhas.push('EQUIPAS - RESUMO');
  linhas.push(separador);
  linhas.push('');
  linhas.push('ID Equipa,Nome da Equipa,Projeto,Total Membros,Total Tarefas,Tarefas Concluídas,Progresso (%)');
  
  equipas.forEach(equipa => {
    const id = equipa.id || equipa.TE_ID || '';
    const nome = escapeCSV(equipa.name || equipa.TE_Name || '');
    const projeto = escapeCSV(equipa.project_name || 'N/A');
    const totalMembros = equipa.members?.length || 0;
    const totalTarefas = equipa.tasks?.length || 0;
    const tarefasConcluidas = equipa.tasks?.filter(t => t.completed || t.T_Completed).length || 0;
    const progresso = totalTarefas > 0 ? ((tarefasConcluidas / totalTarefas) * 100).toFixed(1) : 0;
    
    linhas.push(`${id},"${nome}","${projeto}",${totalMembros},${totalTarefas},${tarefasConcluidas},${progresso}%`);
  });
  
  // ==========================================
  // SEÇÃO 4: EQUIPAS - MEMBROS
  // ==========================================
  linhas.push('');
  linhas.push('');
  linhas.push('EQUIPAS - MEMBROS');
  linhas.push(separador);
  linhas.push('');
  linhas.push('ID Equipa,Nome da Equipa,Nome do Membro,Função');
  
  equipas.forEach(equipa => {
    const idEquipa = equipa.id || equipa.TE_ID || '';
    const nomeEquipa = escapeCSV(equipa.name || equipa.TE_Name || '');
    
    (equipa.members || []).forEach(membro => {
      const nomeMembro = escapeCSV(membro.name || membro.U_Name || '');
      const funcao = escapeCSV(membro.role || membro.TM_Role || 'N/A');
      
      linhas.push(`${idEquipa},"${nomeEquipa}","${nomeMembro}","${funcao}"`);
    });
  });
  
  // ==========================================
  // SEÇÃO 5: EQUIPAS - TAREFAS
  // ==========================================
  linhas.push('');
  linhas.push('');
  linhas.push('EQUIPAS - TAREFAS');
  linhas.push(separador);
  linhas.push('');
  linhas.push('ID Equipa,Nome da Equipa,ID Tarefa,Nome da Tarefa,Descrição,Status');
  
  equipas.forEach(equipa => {
    const idEquipa = equipa.id || equipa.TE_ID || '';
    const nomeEquipa = escapeCSV(equipa.name || equipa.TE_Name || '');
    
    (equipa.tasks || []).forEach(tarefa => {
      const idTarefa = tarefa.id || tarefa.T_ID || '';
      const nomeTarefa = escapeCSV(tarefa.name || tarefa.T_Name || '');
      const descricao = escapeCSV(tarefa.description || tarefa.T_Description || '');
      const status = (tarefa.completed || tarefa.T_Completed) ? 'Concluída' : 'Pendente';
      
      linhas.push(`${idEquipa},"${nomeEquipa}",${idTarefa},"${nomeTarefa}","${descricao}","${status}"`);
    });
  });
  
  // ==========================================
  // SEÇÃO 6: PRÊMIOS
  // ==========================================
  linhas.push('');
  linhas.push('');
  linhas.push('PRÊMIOS ATRIBUÍDOS');
  linhas.push(separador);
  linhas.push('');
  linhas.push('ID Atribuição,Nome do Prêmio,Tipo,Pontos,Destinatário,Tipo Destinatário,Motivo,Data Atribuição');
  
  if (Array.isArray(premios)) {
    premios.forEach(premio => {
      const id = premio.AA_ID || '';
      const nome = escapeCSV(premio.A_Name || '');
      const tipo = escapeCSV(premio.A_Type || '');
      const pontos = premio.A_Points || 0;
      const destinatario = escapeCSV(premio.recipient_name || 'N/A');
      const tipoDestinatario = premio.A_Target || 'N/A';
      const motivo = escapeCSV(premio.AA_Reason || 'N/A');
      const data = premio.AA_Assigned_Date ? new Date(premio.AA_Assigned_Date).toLocaleDateString('pt-PT') : 'N/A';
      
      linhas.push(`${id},"${nome}","${tipo}",${pontos},"${destinatario}","${tipoDestinatario}","${motivo}","${data}"`);
    });
  }
  
  // ==========================================
  // RODAPÉ
  // ==========================================
  linhas.push('');
  linhas.push('');
  linhas.push(separador);
  linhas.push('Fim do Relatório');
  linhas.push(`Exportado em: ${new Date().toLocaleString('pt-PT')}`);
  
  return linhas.join('\n');
}

// =========================
//  UTILITÁRIO - ESCAPE CSV
// =========================
function escapeCSV(text) {
  if (!text && text !== 0) return '';
  const str = String(text);
  // Remover aspas duplas e substituir por aspas simples
  return str.replace(/"/g, "'").replace(/\n/g, ' ').replace(/\r/g, '');
}

// =========================
//  UTILITÁRIO - DOWNLOAD CSV
// =========================
function downloadCSV(csvContent, filename) {
  // Adicionar BOM para UTF-8 (garante acentos corretos no Excel)
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Limpar URL
  setTimeout(() => URL.revokeObjectURL(url), 100);
}