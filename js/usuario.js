const apiUrl = 'https://seu-backend.com/api/usuarios'; // Altere para sua URL real
const usersContainer = document.getElementById('users-list-container');
const userForm = document.getElementById('userForm');
const modal = document.getElementById('userModal');
const modalTitle = document.getElementById('modalTitle');

document.getElementById('menu-toggle').addEventListener('click', () => {
  document.querySelector('.sidebar').classList.toggle('active');
});

function openUserModal(mode, userId = null) {
  userForm.reset();
  document.getElementById('userId').value = '';

  if (mode === 'new') {
    modalTitle.textContent = 'Novo Usuário';
    document.getElementById('deleteBtn').style.display = 'none';
  } else if (mode === 'view') {
    fetch(`${apiUrl}/${userId}`)
      .then(res => res.json())
      .then(data => {
        modalTitle.textContent = 'Editar Usuário';
        document.getElementById('userId').value = data.id;
        document.getElementById('userName').value = data.nome;
        document.getElementById('userEmail').value = data.email;
        document.getElementById('userRole').value = data.tipo;
        document.getElementById('deleteBtn').style.display = 'inline-block';
      });
  }

  modal.style.display = 'block';
}

function closeUserModal() {
  modal.style.display = 'none';
}

function deleteUser() {
  const id = document.getElementById('userId').value;
  if (confirm('Deseja realmente excluir este usuário?')) {
    fetch(`${apiUrl}/${id}`, {
      method: 'DELETE'
    }).then(() => {
      closeUserModal();
      loadUsers();
    });
  }
}

userForm.addEventListener('submit', function (e) {
  e.preventDefault();

  const id = document.getElementById('userId').value;
  const data = {
    nome: document.getElementById('userName').value,
    email: document.getElementById('userEmail').value,
    tipo: document.getElementById('userRole').value,
    senha: document.getElementById('userPassword').value
  };

  const method = id ? 'PUT' : 'POST';
  const endpoint = id ? `${apiUrl}/${id}` : apiUrl;

  fetch(endpoint, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(() => {
    closeUserModal();
    loadUsers();
  });
});

function loadUsers() {
  fetch(apiUrl)
    .then(res => res.json())
    .then(users => {
      usersContainer.innerHTML = '';
      users.forEach(user => {
        const item = document.createElement('div');
        item.className = 'user-list-item';
        item.innerHTML = `
          <div class="user-list-content" onclick="openUserModal('view', '${user.id}')">
            <div class="user-list-main">
              <span class="user-id">#${user.id}</span>
              <h3 class="user-name">${user.nome}</h3>
              <span class="user-role role-${user.tipo}">${user.tipo.charAt(0).toUpperCase() + user.tipo.slice(1)}</span>
            </div>
            <div class="user-list-details">
              <p class="user-email">${user.email}</p>
              <div class="user-meta">
                <span><i class="fas fa-id-card"></i> Matrícula: ${user.matricula || 'N/A'}</span>
              </div>
            </div>
          </div>
        `;
        usersContainer.appendChild(item);
      });
    });
}

// Carregar usuários ao iniciar
loadUsers();
