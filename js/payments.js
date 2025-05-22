// payments.js - gestión de pagos

const data = window.data || (window.data = { users: [], cells: [], vehicles: [], novelties: [], payments: [] });

const paymentForm = document.getElementById('payment-form');
const paymentUserSelect = document.getElementById('payment-user');
const paymentsTableBody = document.querySelector('#payments-table tbody');

paymentForm.addEventListener('submit', e => {
  e.preventDefault();
  const userId = paymentUserSelect.value;
  const amount = Number(paymentForm['payment-amount'].value);
  if (!userId || !amount || amount < 1000) {
    alert('Seleccione usuario y escriba un monto válido (mínimo 1000 COP)');
    return;
  }
  const now = new Date();
  data.payments.push({ userId, amount, time: now });
  paymentForm.reset();
  updatePaymentsTable();
});

function populatePaymentUserSelect() {
  paymentUserSelect.innerHTML = `<option value="">Seleccione usuario</option>`;
  data.users.forEach(u => {
    paymentUserSelect.innerHTML += `<option value="${u.id}">${u.name} (${u.id})</option>`;
  });
}

function updatePaymentsTable() {
  paymentsTableBody.innerHTML = '';
  data.payments.forEach(p => {
    const user = data.users.find(u => u.id === p.userId);
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${user ? user.name : 'Desconocido'}</td><td>${p.amount.toLocaleString('es-CO', {style:'currency', currency:'COP'})}</td><td>${formatDate(new Date(p.time))}</td>`;
    paymentsTableBody.appendChild(tr);
  });
}

function formatDate(date) {
  return date.toLocaleString('es-CO', { dateStyle: 'short', timeStyle: 'short' });
}

// Inicializar tabla y select
updatePaymentsTable();
populatePaymentUserSelect();
