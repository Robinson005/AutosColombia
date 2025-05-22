// vehicles.js - gestión de entrada y salida de vehículos

const data = window.data || (window.data = { users: [], cells: [], vehicles: [], novelties: [], payments: [] });

const vehicleEntryForm = document.getElementById('vehicle-entry-form');
const vehicleUserSelect = document.getElementById('vehicle-user');
const vehicleCellSelect = document.getElementById('vehicle-cell');
const vehiclesTableBody = document.querySelector('#vehicles-table tbody');
const vehicleExitForm = document.getElementById('vehicle-exit-form');
const exitVehiclePlateSelect = document.getElementById('exit-vehicle-plate');

vehicleEntryForm.addEventListener('submit', e => {
  e.preventDefault();
  const plate = vehicleEntryForm['vehicle-plate'].value.trim().toUpperCase();
  const userId = vehicleEntryForm['vehicle-user'].value;
  const cellCode = vehicleEntryForm['vehicle-cell'].value;
  if (!plate || !userId || !cellCode) {
    alert('Complete todos los campos para registrar la entrada del vehículo');
    return;
  }
  if (data.vehicles.find(v => v.plate === plate)) {
    alert('El vehículo ya está registrado dentro del parqueadero.');
    return;
  }
  // Validar celda disponible
  const cell = data.cells.find(c => c.code === cellCode);
  if (!cell) {
    alert('Celda no encontrada');
    return;
  }
  if (cell.occupied) {
    alert('La celda seleccionada ya está ocupada.');
    return;
  }
  cell.occupied = true;
  const now = new Date();
  data.vehicles.push({ plate, userId, cellCode, entryTime: now });
  vehicleEntryForm.reset();
  updateVehiclesTable();
  updateVehicleExitSelect();
  if (typeof populateNoveltyVehicleSelect === 'function') populateNoveltyVehicleSelect();
  if (typeof updateCellsTable === 'function') updateCellsTable();
});

function updateVehiclesTable() {
  vehiclesTableBody.innerHTML = '';
  data.vehicles.forEach(v => {
    const user = data.users.find(u => u.id === v.userId);
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${v.plate}</td><td>${user ? user.name : 'Desconocido'}</td><td>${v.cellCode}</td><td>${formatDate(new Date(v.entryTime))}</td><td><button class="btn-danger" onclick="registerVehicleExit('${v.plate}')">Salida</button></td>`;
    vehiclesTableBody.appendChild(tr);
  });
}

vehicleExitForm.addEventListener('submit', e => {
  e.preventDefault();
  const plate = exitVehiclePlateSelect.value;
  if (!plate) {
    alert('Seleccione un vehículo para registrar la salida');
    return;
  }
  registerVehicleExit(plate);
  vehicleExitForm.reset();
});

window.registerVehicleExit = function (plate) {
  const vehicleIndex = data.vehicles.findIndex(v => v.plate === plate);
  if (vehicleIndex === -1) {
    alert('Vehículo no encontrado en parqueadero');
    return;
  }
  const vehicle = data.vehicles[vehicleIndex];
  
  // Calcular duración en parqueadero
  const entryTime = new Date(vehicle.entryTime);
  const exitTime = new Date();
  const durationMs = exitTime - entryTime;

  // Liberar celda
  const cellCode = vehicle.cellCode;
  const cell = data.cells.find(c => c.code === cellCode);
  if (cell) {
    cell.occupied = false;
  }
  // Eliminar vehículo del array
  data.vehicles.splice(vehicleIndex, 1);
  updateVehiclesTable();
  updateVehicleExitSelect();
  if (typeof populateNoveltyVehicleSelect === 'function') populateNoveltyVehicleSelect();
  if (typeof updateCellsTable === 'function') updateCellsTable();

  // Mostrar tiempo transcurrido
  alert(`El vehículo ${plate} estuvo en el parqueadero por ${getDurationString(durationMs)}.`);
};

function getDurationString(durationMs) {
  const totalMinutes = Math.floor(durationMs / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  let result = '';
  if (hours > 0) {
    result += `${hours} ${hours === 1 ? 'hora' : 'horas'}`;
  }
  if (minutes > 0) {
    if (result) result += ' y ';
    result += `${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}`;
  }
  if (!result) result = 'menos de un minuto';
  return result;
}

function populateVehicleUserSelect() {
  vehicleUserSelect.innerHTML = `<option value="">Seleccione un usuario</option>`;
  data.users.forEach(u => {
    vehicleUserSelect.innerHTML += `<option value="${u.id}">${u.name} (${u.id})</option>`;
  });
}

function populateVehicleCellSelect() {
  vehicleCellSelect.innerHTML = `<option value="">Seleccione una celda</option>`;
  data.cells.filter(c => !c.occupied).forEach(c => {
    vehicleCellSelect.innerHTML += `<option value="${c.code}">${c.code} - ${c.description || ''}</option>`;
  });
}

function updateVehicleExitSelect() {
  exitVehiclePlateSelect.innerHTML = `<option value="">Seleccione vehículo</option>`;
  data.vehicles.forEach(v => {
    exitVehiclePlateSelect.innerHTML += `<option value="${v.plate}">${v.plate}</option>`;
  });
}

function formatDate(date) {
  return date.toLocaleString('es-CO', { dateStyle: 'short', timeStyle: 'short' });
}

// Inicializar tablas y selects
updateVehiclesTable();
populateVehicleUserSelect();
populateVehicleCellSelect();
updateVehicleExitSelect();

