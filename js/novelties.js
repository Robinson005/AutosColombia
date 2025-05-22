// novelties.js - gestión de novedades

const data = window.data || (window.data = { users: [], cells: [], vehicles: [], novelties: [], payments: [] });

const noveltyForm = document.getElementById('novelty-form');
const noveltyVehicleSelect = document.getElementById('novelty-vehicle');
const noveltiesTableBody = document.querySelector('#novelties-table tbody');

noveltyForm.addEventListener('submit', e => {
  e.preventDefault();
  const plate = noveltyVehicleSelect.value;
  const description = noveltyForm['novelty-description'].value.trim();
  if (!plate || !description) {
    alert('Complete todos los campos para registrar la novedad');
    return;
  }
  const now = new Date();
  data.novelties.push({ plate, description, time: now });
  noveltyForm.reset();
  updateNoveltiesTable();
});

function populateNoveltyVehicleSelect() {
  noveltyVehicleSelect.innerHTML = `<option value="">Seleccione vehículo</option>`;
  data.vehicles.forEach(v => {
    noveltyVehicleSelect.innerHTML += `<option value="${v.plate}">${v.plate}</option>`;
  });
}

function updateNoveltiesTable() {
  noveltiesTableBody.innerHTML = '';
  data.novelties.forEach(n => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${n.plate}</td><td>${n.description}</td><td>${formatDate(new Date(n.time))}</td>`;
    noveltiesTableBody.appendChild(tr);
  });
}

function formatDate(date) {
  return date.toLocaleString('es-CO', { dateStyle: 'short', timeStyle: 'short' });
}

// Inicializar tabla y select
updateNoveltiesTable();
populateNoveltyVehicleSelect();
