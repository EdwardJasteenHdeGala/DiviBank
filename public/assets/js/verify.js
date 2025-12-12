function updateProgress(percent) {
    document.getElementById('progressBar').style.width = percent + '%';
  }
  
  document.getElementById('verifyBtn').addEventListener('click', async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const msg = document.getElementById('msg');
  
    if (!user) {
      msg.textContent = 'Please login first.';
      msg.className = 'error';
      return;
    }
  
    try {
      updateProgress(30); // start request
      const res = await fetch(`/api/users/${user.id}/verify`, { method: 'PUT' });
      const data = await res.json();
  
      if (data.error) {
        msg.textContent = data.error;
        msg.className = 'error';
        updateProgress(0);
      } else {
        msg.textContent = data.message;
        msg.className = 'success';
        user.verified = true;
        localStorage.setItem('user', JSON.stringify(user));
        updateProgress(100); // verified
      }
    } catch {
      msg.textContent = 'Server error. Please try again.';
      msg.className = 'error';
      updateProgress(0);
    }
  });
  
  function logout() {
    localStorage.removeItem('user');
    location.href = 'login.html';
  }  