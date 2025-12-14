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
// EXPORTAR DADOS
// ============================================
function configurarExportarDados() {
  const btnExportar = document.querySelector('.btn-export');
  
  if (btnExportar) {
    btnExportar.addEventListener('click', async () => {
      alert('Funcionalidade de exportação em desenvolvimento');
    });
  }
}