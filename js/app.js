// app.js - archivo principal para controlar navegación y carga inicial

// Obtener referencias a pestañas y secciones
const tabs = {
  users: document.getElementById('tab-users'),
  cells: document.getElementById('tab-cells'),
  vehicles: document.getElementById('tab-vehicles'),
  novelties: document.getElementById('tab-novelties'),
  payments: document.getElementById('tab-payments')
};
const sections = {
  users: document.getElementById('section-users'),
  cells: document.getElementById('section-cells'),
  vehicles: document.getElementById('section-vehicles'),
  novelties: document.getElementById('section-novelties'),
  payments: document.getElementById('section-payments')
};

// Función para mostrar pestaña activa
function showTab(key) {
  Object.keys(tabs).forEach(k => {
    if (k === key) {
      tabs[k].classList.add('active');
      sections[k].style.display = '';
    } else {
      tabs[k].classList.remove('active');
      sections[k].style.display = 'none';
    }
  });

  // Refrescar selects y tablas según pestaña mostrada
  switch (key) {
    case 'vehicles':
      populateVehicleUserSelect();
      populateVehicleCellSelect();
      populateVehicleExitSelect();
      break;
    case 'novelties':
      populateNoveltyVehicleSelect();
      break;
    case 'payments':
      populatePaymentUserSelect();
      break;
  }
}

// Añadir eventos click a botones de pestañas
Object.entries(tabs).forEach(([key, btn]) => {
  btn.addEventListener('click', () => showTab(key));
});

// Inicializar mostrando la pestaña de usuarios
showTab('users');

// Exportar funciones para módulos si es necesario
// (En esta estructura no usamos módulos ES6, así que funciones globales)
// Las funciones populate... y update... se definen en sus módulos respectivos y están en scope global

