document.documentElement.classList.add('js-enabled'); // Add a class to `<html>` for JavaScript-specific styles

const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav__menu');

const init = () => {
    hamburger.addEventListener('click', () => {
        const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
        hamburger.setAttribute('aria-expanded', !isExpanded); // Toggle ARIA state
        navMenu.classList.toggle('active');
    });
}

init();
