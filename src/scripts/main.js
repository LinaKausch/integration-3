const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

const init = () => {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
}

init();