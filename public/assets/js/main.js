// Shared navigation renderer
function updateNav() {
  const user = JSON.parse(localStorage.getItem('user'));
  const nav = document.querySelector('nav');
  if (!nav) return;

  if (user) {
    nav.innerHTML = `
      <a href="index.html">Dashboard</a>
      <a href="loans.html">My Loans</a>
      <a href="contact.html">Contact Us</a>
      ${user.role === 'admin' ? '<a href="admin.html">Admin Panel</a>' : ''}
      <a href="#" onclick="logout()">Logout</a>
    `;
  } else {
    nav.innerHTML = `
      <a href="index.html">Dashboard</a>
      <a href="loans.html">My Loans</a>
      <a href="contact.html">Contact Us</a>
      <a href="login.html">Login</a>
      <a href="register.html">Register</a>
    `;
  }
}

function logout() {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
  location.href = 'login.html';
}

updateNav();

// Dashboard data
async function loadBalance() {
  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user ? user.id : null;
  const balanceEl = document.getElementById('balance');
  if (!balanceEl) return;

  try {
    const res = await fetch('/api/balance');
    const balances = await res.json(); // array
    const record = balances.find(b => b.userId === userId);
    balanceEl.textContent = record ? `${record.balance} PHP` : 'Please login to view balance.';
  } catch {
    balanceEl.textContent = 'Failed to load balance.';
  }
}

async function loadTransactions() {
  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user ? user.id : null;
  const list = document.getElementById('transactions');
  if (!list) return;

  try {
    const res = await fetch('/api/transactions');
    const txs = await res.json();
    const userTxs = txs.filter(t => t.userId === userId);

    if (!userTxs.length) {
      list.innerHTML = '<li class="empty">No transactions found.</li>';
      return;
    }

    list.innerHTML = userTxs.map(t => `<li>${t.description} — ${t.amount} PHP</li>`).join('');
  } catch {
    list.innerHTML = '<li class="empty">Failed to load transactions.</li>';
  }
}

async function loadUserName() {
  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user ? user.id : null;
  const el = document.getElementById('welcome');
  if (!el || !userId) return;

  try {
    const res = await fetch('/api/users');
    const users = await res.json();
    const current = users.find(u => u.id === userId);
    if (current) el.textContent = `Welcome back, ${current.name}!`;
  } catch {
    // leave default
  }
}

loadBalance();
loadTransactions();
loadUserName();

// LOGIN
document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const msg = document.getElementById('msg');

  try {
    const res = await fetch('/api/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();

    if (data.error) {
      msg.textContent = data.error;
      msg.className = 'error';
    } else {
      msg.textContent = 'Login successful!';
      msg.className = 'success';
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('token', data.token || '');
      setTimeout(() => location.href = 'index.html', 500);
    }
  } catch {
    msg.textContent = 'Server error. Please try again.';
    msg.className = 'error';
  }
});

// REGISTER
document.getElementById('registerForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const msg = document.getElementById('msg');

  try {
    const res = await fetch('/api/users/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    const data = await res.json();

    if (data.error) {
      msg.textContent = data.error;
      msg.className = 'error';
    } else {
      msg.textContent = 'Registration successful! Please login.';
      msg.className = 'success';
      setTimeout(() => location.href = 'login.html', 800);
    }
  } catch {
    msg.textContent = 'Server error. Please try again.';
    msg.className = 'error';
  }
});