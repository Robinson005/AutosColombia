// users.js - gestión de usuarios

const data = window.data || (window.data = { users: [], cells: [], vehicles: [], novelties: [], payments: [] });

const userForm = document.getElementById('user-form');
const usersTableBody = document.querySelector('#users-table tbody');

userForm.addEventListener('submit', e => {
  e.preventDefault();
  const name = userForm['user-name'].value.trim();
  const id = userForm['user-id'].value.trim();
  if (!name || !id) {
    alert('Por favor, complete todos los campos para registrar un usuario.');
    return;
  }
  if (data.users.find(u => u.id === id)) {
    alert('Ya existe un usuario con esta identificación.');
    return;
  }
  data.users.push({ id, name });
  userForm.reset();
  updateUsersTable();
  // Actualizar selects dependientes
  if (typeof populateVehicleUserSelect === 'function') populateVehicleUserSelect();
  if (typeof populatePaymentUserSelect === 'function') populatePaymentUserSelect();
});

function updateUsersTable() {
  usersTableBody.innerHTML = '';
  data.users.forEach(u => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${u.name}</td><td>${u.id}</td><td><button class="btn-danger" onclick="deleteUser('${u.id}')">Eliminar</button></td>`;
    usersTableBody.appendChild(tr);
  });
}

// Función para eliminar usuario - expuesta globalmente para uso en botón
window.deleteUser = function (id) {
  // No eliminar si usuario tiene vehículos o pagos
  if (data.vehicles.find(v => v.userId === id)) {
    alert('No se puede eliminar un usuario con vehículos activos.');
    return;
  }
  if (data.payments.find(p => p.userId === id)) {
    alert('No se puede eliminar un usuario con pagos registrados.');
    return;
  }
  data.users = data.users.filter(u => u.id !== id);
  updateUsersTable();
  if (typeof populateVehicleUserSelect === 'function') populateVehicleUserSelect();
  if (typeof populatePaymentUserSelect === 'function') populatePaymentUserSelect();
};

// Inicializar tabla al cargar
updateUsersTable();
