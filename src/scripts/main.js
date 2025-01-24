document.documentElement.classList.add('js-enabled');
const $hamburger = document.querySelector('.hamburger');
const $navMenu = document.querySelector('.nav__menu');
const $choices = document.querySelectorAll('.interaction__choice');
const $dialog = document.getElementById('choiceDialog');
const $closeButton = document.getElementById('closeDialog');
const $message = $dialog.querySelector('.message');
const $result = $dialog.querySelector('.result');


const clickableChoice = () => {

    $choices.forEach(choice => {
        choice.addEventListener('click', () => {
            let message = '';
            let result = '';

            if (choice.classList.contains('multiple__books')) {
                message = 'You chose quantity!';
                result = 'You are like all other printers of those days.';
            } else if (choice.classList.contains('one__book')) {
                message = 'You chose quality!';
                result = 'You are just like Christophe Plantin!';
            }
            $message.textContent = message;
            $result.textContent = result;
            $dialog.showModal();
        });
    });
    
    $closeButton.addEventListener('click', () => {
        $dialog.close();
    });
};


const hamburgerMenu = () => {
    $hamburger.addEventListener('click', () => {
        const isExpanded = $hamburger.getAttribute('aria-expanded') === 'true';
        $hamburger.setAttribute('aria-expanded', !isExpanded);
        $navMenu.classList.toggle('active');
    });
}

const init = () => {
    hamburgerMenu();
    clickableChoice();
}

init();
