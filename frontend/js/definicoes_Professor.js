let userData = null;

document.addEventListener('DOMContentLoaded', () => {
  carregarPerfil();
  configurarFormularioPerfil();
  configurarFormularioSenha();
  configurarBotaoFoto();
});

// ==================== CARREGAR PERFIL ====================
async function carregarPerfil() {
  const userStr = localStorage.getItem('user');
  
  if (!userStr) {
    window.location.href = '/login';
    return;
  }

  const user = JSON.parse(userStr);
  
  try {
    const response = await fetch(`/usuarios/profile/${user.id}`);
    const data = await response.json();
    
    if (data.success) {
      userData = data.perfil;
      preencherFormulario(userData);
    }
  } catch (err) {
    console.error('❌ Erro ao carregar perfil:', err);
  }
}

// ==================== PREENCHER FORMULÁRIO ====================
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

  // ===== FOTO CARD (Preview grande) =====
  const photoContainer = document.querySelector('.photo-top');
  const imgCard = photoContainer.querySelector('img');
  let avatarCard = photoContainer.querySelector('.avatar-placeholder');

  // Remove avatar antigo se existir
  if (avatarCard) {
    avatarCard.remove();
  }

  // Cria novo avatar
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
    margin-top: 15px;
  `;
  
  // Insere ANTES da imagem
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

  // ===== FOTO SIDEBAR =====
  const sidebarUserInfo = document.querySelector('.sidebar .user-info');
  const sidebarImg = sidebarUserInfo.querySelector('img');
  let sidebarAvatar = sidebarUserInfo.querySelector('.avatar-placeholder');

  // Remove avatar antigo se existir
  if (sidebarAvatar) {
    sidebarAvatar.remove();
  }

  // Cria novo avatar
  sidebarAvatar = document.createElement('div');
  sidebarAvatar.className = 'avatar-placeholder';
  sidebarAvatar.style.cssText = `
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
  
  // Insere ANTES da imagem
  sidebarUserInfo.insertBefore(sidebarAvatar, sidebarImg);

  if (perfil.foto) {
    sidebarImg.src = perfil.foto;
    sidebarImg.style.display = 'block';
    sidebarAvatar.style.display = 'none';
  } else {
    sidebarImg.style.display = 'none';
    sidebarAvatar.style.display = 'flex';
    sidebarAvatar.textContent = (perfil.nome || 'U')[0].toUpperCase();
  }

  // Atualiza texto da sidebar
  document.querySelector('.sidebar .user-details h3').textContent = perfil.nome;
  document.querySelector('.sidebar .user-details p').textContent = perfil.tipo === 'docente' ? 'Docente' : 'Estudante';
}

// ==================== FORMULÁRIO PERFIL ====================
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
        carregarPerfil();
      } else {
        alert(data.error || 'Erro ao atualizar perfil');
      }
    } catch (err) {
      console.error('❌ Erro:', err);
      alert('Erro ao atualizar perfil');
    }
  });
}

// ==================== FORMULÁRIO SENHA ====================
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
      console.error('❌ Erro:', err);
      alert('Erro ao alterar senha');
    }
  });
}

// ==================== BOTÃO FOTO ====================
function configurarBotaoFoto() {
  const btnUpload = document.querySelector('.btn-upload');
  const photoContainer = document.querySelector('.photo-top');
  const imgCard = photoContainer.querySelector('img');
  
  const sidebarUserInfo = document.querySelector('.sidebar .user-info');
  const sidebarImg = sidebarUserInfo.querySelector('img');

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

        // Atualiza foto do card
        const avatarCard = photoContainer.querySelector('.avatar-placeholder');
        imgCard.src = base64;
        imgCard.style.display = 'block';
        if (avatarCard) avatarCard.style.display = 'none';

        // Atualiza foto da sidebar
        const sidebarAvatar = sidebarUserInfo.querySelector('.avatar-placeholder');
        sidebarImg.src = base64;
        sidebarImg.style.display = 'block';
        if (sidebarAvatar) sidebarAvatar.style.display = 'none';

        // Enviar para backend
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
          console.error('❌ Erro ao atualizar foto:', err);
          alert('Erro ao atualizar foto');
        }
      };

      reader.readAsDataURL(file);
    };
  });
}