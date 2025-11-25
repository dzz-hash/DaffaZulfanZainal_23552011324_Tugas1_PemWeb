// theme-toggle.js - toggle light/dark + persist in localStorage
document.addEventListener('DOMContentLoaded', () => {
  const themeToggle = document.getElementById('themeToggle');
  const body = document.body;

  // restore
  if(localStorage.getItem('vt-theme') === 'light'){
    body.classList.add('light-mode');
    themeToggle.checked = true;
  } else {
    body.classList.remove('light-mode');
    themeToggle.checked = false;
  }

  themeToggle.addEventListener('change', () => {
    body.classList.toggle('light-mode');
    localStorage.setItem('vt-theme', body.classList.contains('light-mode') ? 'light' : 'dark');
  });
});
