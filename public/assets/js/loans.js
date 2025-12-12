function logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    location.href = 'login.html';
  }
  
  async function loadUserLoans() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) return location.href = 'login.html';
  
    try {
      const res = await fetch(`/api/loans/${user.id}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token') || ''}` }
      });
      const loans = await res.json();
      const list = document.getElementById('loanList');
  
      if (!loans.length) {
        list.innerHTML = '<li class="empty">No loans found.</li>';
        return;
      }
  
      list.innerHTML = loans.map(l => `
        <li>
          <span><strong>Loan #${l.id}</strong> — ₱${l.amount}</span>
          <span class="loan-status">${l.status}</span>
        </li>
      `).join('');
    } catch {
      document.getElementById('loanList').innerHTML = '<li class="empty">Failed to load loans</li>';
    }
  }
  
  document.getElementById('loanForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const amount = Number(document.getElementById('amount').value);
    const user = JSON.parse(localStorage.getItem('user'));
    const msg = document.getElementById('loanMsg');
  
    if (!user) {
      msg.textContent = 'Please login first.';
      msg.className = 'error';
      return;
    }
    if (!amount || amount <= 0) {
      msg.textContent = 'Please enter a valid loan amount.';
      msg.className = 'error';
      return;
    }
  
    try {
      const res = await fetch('/api/loans', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        },
        body: JSON.stringify({ userId: user.id, amount })
      });
      const data = await res.json();
      if (data.error) {
        msg.textContent = data.error;
        msg.className = 'error';
      } else {
        msg.textContent = data.message;
        msg.className = 'success';
        e.target.reset();
        loadUserLoans();
      }
    } catch {
      msg.textContent = 'Server error. Please try again.';
      msg.className = 'error';
    }
  });
  
  loadUserLoans();  