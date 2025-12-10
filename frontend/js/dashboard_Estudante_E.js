document.addEventListener('DOMContentLoaded', () => {
  const btnCreate = document.querySelector('.btn-create-team');
  const capacitySelect = document.querySelector('.team-capacity-select');
  const roleSelect = document.querySelector('.team-role-select');
  const typeChips = document.querySelectorAll('.team-type-chips .chip-type');
  const teamsGrid = document.querySelector('.teams-grid');
  const toolbarText = document.querySelector('.teams-toolbar-text');

  if (!btnCreate || !capacitySelect || !roleSelect || !teamsGrid) {
    console.warn('Alguns elementos não foram encontrados. Verifica as classes no HTML.');
    return;
  }

  let selectedType = 'Aberta'; // valor inicial

  // ---- seleccionar Aberta / Fechada ----
  typeChips.forEach(chip => {
    chip.addEventListener('click', () => {
      typeChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      selectedType = chip.dataset.type || chip.textContent.trim();
    });
  });

  function updateTeamsCount() {
    const count = teamsGrid.querySelectorAll('.team-card').length;
    if (toolbarText) {
      toolbarText.textContent = `${count} equipas ativas`;
    }
  }

  updateTeamsCount();

  // ---- criar nova equipa ao clicar no botão do topo ----
  btnCreate.addEventListener('click', () => {
    const teamName = prompt('Nome da nova equipa:');

    if (!teamName || !teamName.trim()) {
      return; // cancelado
    }

    const maxMembers = parseInt(capacitySelect.value, 10) || 3;
    const myRole = roleSelect.value || 'Frontend';
    const isOpen = selectedType === 'Aberta';

    const currentMembers = 1;
    const statusClass = isOpen ? 'open' : 'closed';
    const statusLabel = selectedType;
    const joinBtnLabel = isOpen ? 'Juntar-me à equipa' : 'Equipa fechada';
    const joinBtnDisabledAttr = isOpen ? '' : 'disabled';
    const joinBtnExtraClass = isOpen ? '' : 'disabled';

    const article = document.createElement('article');
    article.classList.add('team-card');

    article.innerHTML = `
      <div class="team-card-header">
        <div class="team-info">
          <div class="team-title-row">
            <span class="team-icon-circle">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#3056d3" stroke-width="2">
                <circle cx="12" cy="8" r="3"></circle>
                <path d="M6 20a6 6 0 0 1 12 0"></path>
              </svg>
            </span>
            <div>
              <h2 class="team-name">${teamName}</h2>
              <span class="team-members-count">${currentMembers} de ${maxMembers} membros</span>
            </div>
          </div>
        </div>
        <div class="team-meta">
          <div class="points-badge">
            <span class="trophy">🏆</span>
            <span class="points-value">0</span>
          </div>
          <span class="team-status ${statusClass}">${statusLabel}</span>
        </div>
      </div>

      <div class="tasks-section">
        <div class="tasks-header">
          <span class="tasks-title">Tarefas Completadas</span>
          <span class="tasks-total">0/0</span>
        </div>
        <span class="tasks-percent">0% completo</span>
        <div class="progress-bar">
          <div class="progress-fill" style="width: 0%;"></div>
        </div>
      </div>

      <div class="members-section">
        <h3>Membros da Equipa</h3>
        <div class="members-list">
          <div class="member">
            <div class="member-avatar">JS</div>
            <div class="member-info">
              <span class="member-name">João Santos (tu)</span>
              <span class="member-role pill pill-primary">${myRole}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="team-footer">
        <span class="team-capacity">${currentMembers} / ${maxMembers} membros</span>
        <button class="btn-join-team ${joinBtnExtraClass}" ${joinBtnDisabledAttr}>
          ${joinBtnLabel}
        </button>
      </div>
    `;

    // puedes usar appendChild si quieres que se añada al final
    teamsGrid.appendChild(article);

    updateTeamsCount();
  });
});
