// Global Theme Toggle Script
document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.getElementById('themeToggle');
    if (!toggle) return;
  
    const isLight = localStorage.getItem('theme') === 'light';
    if (isLight) applyLightMode();
  
    toggle.addEventListener('click', () => {
      const light = document.body.classList.toggle('light-mode');
      document.querySelectorAll(
        'header, nav a, .card, .loan-card, .register-card, .contact-card, .verify-card, .analytics-card, input, textarea, a.button-secondary, .progress-container, .contact-details'
      ).forEach(el => el.classList.toggle('light-mode'));
      localStorage.setItem('theme', light ? 'light' : 'dark');
      toggle.textContent = light ? '🌙 Dark Mode' : '☀️ Light Mode';
    });
  
    function applyLightMode() {
      document.body.classList.add('light-mode');
      document.querySelectorAll(
        'header, nav a, .card, .loan-card, .register-card, .contact-card, .verify-card, .analytics-card, input, textarea, a.button-secondary, .progress-container, .contact-details'
      ).forEach(el => el.classList.add('light-mode'));
      toggle.textContent = '🌙 Dark Mode';
    }
  });  