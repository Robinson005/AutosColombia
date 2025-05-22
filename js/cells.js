// cells.js - gestión de celdas

const data = window.data || (window.data = { users: [], cells: [], vehicles: [], novelties: [], payments: [] });

const cellForm = document.getElementById('cell-form');
const cellsTableBody = document.querySelector('#cells-table tbody');

cellForm.addEventListener('submit', e => {
  e.preventDefault();
  const code = cellForm['cell-code'].value.trim().toUpperCase();
  const description = cellForm['cell-description'].value.trim();
  if (!code) {
    alert('Ingrese el código de la celda');
    return;
  }
  if (data.cells.find(c => c.code === code)) {
    alert('Ya existe una celda con ese código');
    return;
  }
  data.cells.push({ code, description, occupied: false });
  cellForm.reset();
  updateCellsTable();
  // Actualizar selects dependientes
  if (typeof populateVehicleCellSelect === 'function') populateVehicleCellSelect();
});

function updateCellsTable() {
  cellsTableBody.innerHTML = '';
  data.cells.forEach(c => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${c.code}</td><td>${c.description || ''}</td><td>${c.occupied ? 'Ocupada' : 'Disponible'}</td><td><button class="btn-danger" onclick="deleteCell('${c.code}')">Eliminar</button></td>`;
    cellsTableBody.appendChild(tr);
  });
}

// Función para eliminar celda - expuesta globalmente para uso en botón
window.deleteCell = function (code) {
  // No eliminar si tiene vehículo estacionado
  if (data.vehicles.find(v => v.cellCode === code)) {
    alert('No se puede eliminar una celda con vehículo estacionado.');
    return;
  }
  data.cells = data.cells.filter(c => c.code !== code);
  updateCellsTable();
  if (typeof populateVehicleCellSelect === 'function') populateVehicleCellSelect();
};

// Inicializar tabla al cargar
updateCellsTable();
