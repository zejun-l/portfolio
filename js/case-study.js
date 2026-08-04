const themeToggle = document.getElementById('themeToggle');
const sunIcon = themeToggle?.querySelector('.sun-icon');
const moonIcon = themeToggle?.querySelector('.moon-icon');

function applyTheme(theme) {
    const dark = theme === 'dark';
    document.body.classList.toggle('dark-mode', dark);
    if (sunIcon) sunIcon.style.display = dark ? 'none' : 'block';
    if (moonIcon) moonIcon.style.display = dark ? 'block' : 'none';
}

applyTheme(localStorage.getItem('theme') || 'light');

themeToggle?.addEventListener('click', () => {
    const theme = document.body.classList.contains('dark-mode') ? 'light' : 'dark';
    localStorage.setItem('theme', theme);
    applyTheme(theme);
});
