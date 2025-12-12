// ===== Progress Bar Helper =====
function updateLoanProgress(percent) {
  const bar = document.getElementById('loanProgressBar');
  if (bar) bar.style.width = percent + '%';
}

// ===== Load Users with Filters =====
async function loadUsers() {
  try {
    const res = await fetch('/api/users', { headers: { 'Content-Type': 'application/json' } });
    let users = await res.json();

    // Apply filters
    const search = document.getElementById('searchUser')?.value.toLowerCase() || '';
    const roleFilter = document.getElementById('filterRole')?.value || '';
    const verifiedFilter = document.getElementById('filterVerified')?.value || '';

    users = users.filter(u => {
      const matchesSearch =
        u.name.toLowerCase().includes(search) ||
        u.email.toLowerCase().includes(search);

      const matchesRole = roleFilter ? u.role === roleFilter : true;
      const matchesVerified = verifiedFilter ? String(u.verified) === verifiedFilter : true;

      return matchesSearch && matchesRole && matchesVerified;
    });

    document.getElementById('userList').innerHTML = users.length
      ? users.map(u => `
        <li>
          ${u.name} (${u.email}) — Role: <span class="role-${u.role}">${u.role}</span>
          <span class="verified-badge ${u.verified ? 'verified-true' : 'verified-false'}">
            ${u.verified ? 'Verified' : 'Not Verified'}
          </span>
          ${!u.verified ? `<button onclick="verifyUser(${u.id})">Verify</button>` : ''}
        </li>
      `).join('')
      : '<li class="empty">No users found</li>';
  } catch {
    document.getElementById('userList').innerHTML = '<li class="empty">Failed to load users</li>';
  }
}

// ===== Verify User =====
async function verifyUser(id) {
  try {
    const res = await fetch(`/api/users/${id}/verify`, { method: 'PUT' });
    const data = await res.json();
    alert(data.message || 'User verified');
    loadUsers();
  } catch {
    alert('Failed to verify user');
  }
}

// ===== Load Loans =====
async function loadLoans() {
  try {
    const res = await fetch('/api/loans');
    const loans = await res.json();

    document.getElementById('loanApprovals').innerHTML = loans.length
      ? loans.map(l => `
        <li>
          <span>Loan #${l.id} — User: ${l.userId}, Amount: ₱${l.amount}, Status: ${l.status}</span>
          <span class="button-group">
            <button class="approve-btn" onclick="approveLoan(${l.id})">Approve</button>
            <button class="reject-btn" onclick="rejectLoan(${l.id})">Reject</button>
          </span>
        </li>
      `).join('')
      : '<li class="empty">No loans found</li>';
  } catch {
    document.getElementById('loanApprovals').innerHTML = '<li class="empty">Failed to load loans</li>';
  }
}

// ===== Approve Loan with Progress =====
async function approveLoan(id) {
  try {
    updateLoanProgress(30);
    const res = await fetch(`/api/loans/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'Approved' })
    });
    updateLoanProgress(70);
    const data = await res.json();
    updateLoanProgress(100);
    alert(data.message || 'Approved');
    loadLoans();
    setTimeout(() => updateLoanProgress(0), 1000);
  } catch {
    alert('Failed to approve loan');
    updateLoanProgress(0);
  }
}

// ===== Reject Loan with Progress =====
async function rejectLoan(id) {
  try {
    updateLoanProgress(30);
    const res = await fetch(`/api/loans/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'Rejected' })
    });
    updateLoanProgress(70);
    const data = await res.json();
    updateLoanProgress(100);
    alert(data.message || 'Rejected');
    loadLoans();
    setTimeout(() => updateLoanProgress(0), 1000);
  } catch {
    alert('Failed to reject loan');
    updateLoanProgress(0);
  }
}

// ===== Load Contact Messages =====
async function loadMessages() {
  try {
    const res = await fetch('/api/contact');
    const msgs = await res.json();
    const el = document.getElementById('messageList');
    if (!el) return;
    el.innerHTML = msgs.length
      ? msgs.map(m => `<li>${m.name} (${m.email}): ${m.message}</li>`).join('')
      : '<li class="empty">No messages</li>';
  } catch {
    const el = document.getElementById('messageList');
    if (el) el.innerHTML = '<li class="empty">Failed to load messages</li>';
  }
}

// ===== Load Reports & Analytics =====
async function loadReports() {
  try {
    const res = await fetch('/api/admin/stats'); // updated endpoint
    const r = await res.json();
    document.getElementById('totalLoans').textContent = r.totalLoans;
    document.getElementById('approvedLoans').textContent = r.approvedLoans;
    document.getElementById('activeUsers').textContent = r.activeUsers;
    document.getElementById('pendingMessages').textContent = r.pendingMessages;
  } catch {
    document.getElementById('totalLoans').textContent = '—';
    document.getElementById('approvedLoans').textContent = '—';
    document.getElementById('activeUsers').textContent = '—';
    document.getElementById('pendingMessages').textContent = '—';
  }
}

// ===== Initialize =====
function initAdmin() {
  loadUsers();
  loadLoans();
  loadMessages();
  loadReports();

  // Attach filter events
  document.getElementById('searchUser')?.addEventListener('input', loadUsers);
  document.getElementById('filterRole')?.addEventListener('change', loadUsers);
  document.getElementById('filterVerified')?.addEventListener('change', loadUsers);

  // Auto-refresh stats every 30s
  setInterval(loadReports, 30000);
}

document.addEventListener('DOMContentLoaded', initAdmin);

// ===== Logout =====
function logout() {
  localStorage.removeItem('user');
  location.href = 'login.html';
}