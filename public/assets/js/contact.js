document.getElementById('contactForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();
    const msg = document.getElementById('msg');
  
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        },
        body: JSON.stringify({ name, email, message })
      });
      const data = await res.json();
      if (data.error) {
        msg.textContent = data.error;
        msg.className = 'error';
      } else {
        msg.textContent = data.status || 'Message sent!';
        msg.className = 'success';
        e.target.reset();
      }
    } catch {
      msg.textContent = 'Server error. Please try again.';
      msg.className = 'error';
    }
  });
  
  function logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    location.href = 'login.html';
  }  