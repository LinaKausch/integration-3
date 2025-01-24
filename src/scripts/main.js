document.documentElement.classList.add('js-enabled');
const $hamburger = document.querySelector('.hamburger');
const $navMenu = document.querySelector('.nav__menu');
const $choices = document.querySelectorAll('.interaction__choice');
const $dialog = document.getElementById('choiceDialog');
const $closeButton = document.querySelector('.popup__close');
const $closeButtonTwo = document.querySelector('.popup__close-two')
const $congratMsg = document.querySelector('.congrats__msg');
const $message = $dialog.querySelector('.message');
const $result = $dialog.querySelector('.result');
const $lettersContainer = document.querySelector('.metal__letters');
const $letters = Array.from($lettersContainer.querySelectorAll('.letter'));
const $holders = document.querySelectorAll('.holder');

let draggedLetter = null;
let letterClone = null;
let isTouch;

const getRandomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

const letters = () => {
    const shuffledLetters = shuffleArray($letters);
    shuffledLetters.forEach((letter) => {
        const randomRotation = getRandomNumber(-8, 8);
        letter.style.transform = `rotate(${randomRotation}deg)`;
        letter.dataset.rotation = randomRotation;
    });
}

const handleRotation = (letter) => {
    const currentRotation = parseInt(letter.dataset.rotation) || 0;
    const newRotation = (currentRotation + 90) % 360;
    letter.style.transform = `rotate(${newRotation}deg)`;
    letter.dataset.rotation = newRotation;

    console.log('Rotation after update:', letter.dataset.rotation);
    if (newRotation === 180) {
        enableDragging(letter);
    }
};

const enableDragging = (letter) => {
    letter.addEventListener('mousedown', grabLetter);
    letter.addEventListener('touchstart', grabLetter);
    letter.addEventListener('dragstart', (e) => e.preventDefault());
};


const grabLetter = (e) => {
    const isTouch = e.type === 'touchstart';
    const pointerX = isTouch ? e.touches[0].pageX : e.pageX;
    const pointerY = isTouch ? e.touches[0].pageY : e.pageY;

    const rotation = parseInt(e.target.dataset.rotation);
    if (rotation < 172 || rotation > 188) return;

    draggedLetter = e.target;


    letterClone = draggedLetter.cloneNode(true);
    document.body.appendChild(letterClone);

    const rect = draggedLetter.getBoundingClientRect();
    letterClone.style.position = 'absolute';
    letterClone.style.zIndex = 990;
    letterClone.style.left = `${rect.left + window.scrollX}px`;
    letterClone.style.top = `${rect.top + window.scrollY}px`;
    draggedLetter.style.opacity = 0.5;

    document.addEventListener(isTouch ? 'touchmove' : 'mousemove', moveLetter);
    document.addEventListener(isTouch ? 'touchend' : 'mouseup', releaseLetter);

    e.preventDefault();
};

const moveLetter = (e) => {
    if (!letterClone) return;

    const isTouch = e.type === 'touchmove';
    const pointerX = isTouch ? e.touches[0].pageX : e.pageX;
    const pointerY = isTouch ? e.touches[0].pageY : e.pageY;

    letterClone.style.left = `${pointerX - letterClone.offsetWidth / 2}px`;
    letterClone.style.top = `${pointerY - letterClone.offsetHeight / 2}px`;
}

const releaseLetter = () => {
    if (!draggedLetter || !letterClone) return;

    const letterKey = draggedLetter.dataset.holder;

    const matchingHolder = document.querySelector(`.holder[data-holder="${letterKey}"]`);


    if (matchingHolder) {
        const holderRect = matchingHolder.getBoundingClientRect();
        const cloneRect = letterClone.getBoundingClientRect();

        console.log(`Holder Rect:`, holderRect);
        console.log(`Clone Rect:`, cloneRect);

        const tolerance = 5;
        const isDroppedInHolder =
            cloneRect.left < holderRect.right + tolerance &&
            cloneRect.right > holderRect.left - tolerance &&
            cloneRect.top < holderRect.bottom + tolerance &&
            cloneRect.bottom > holderRect.top - tolerance;

        console.log(`Is Dropped in Holder: ${isDroppedInHolder}`);

        if (isDroppedInHolder) {
            console.log('Correct drop!');
            matchingHolder.appendChild(draggedLetter);
            draggedLetter.style.position = 'static';
            draggedLetter.style.opacity = 1;

            checkCompletion();
        } else {
            console.log('Incorrect drop. Resetting position.');
            draggedLetter.style.opacity = 1;
        }
    } else {
        console.log('No matching holder found. Resetting position.');
        draggedLetter.style.opacity = 1;
    }

    letterClone.remove();
    letterClone = null;
    draggedLetter = null;

    document.removeEventListener(isTouch ? 'touchmove' : 'mousemove', moveLetter);
    document.removeEventListener(isTouch ? 'touchend' : 'mouseup', releaseLetter);
};


const addListeners = () => {
    $letters.forEach((letter) => {
        letter.dataset.rotation = letter.dataset.rotation || 0;
        letter.addEventListener('click', () => handleRotation(letter));
        letter.addEventListener('mousedown', grabLetter);
        letter.addEventListener('touchstart', grabLetter);
        letter.addEventListener('dragstart', (e) => e.preventDefault());
    });
};

const initCloseButton = () => {
    $closeButton.addEventListener('click', () => {
        $congratMsg.close();
    });
};

const checkCompletion = () => {
    const holders = document.querySelectorAll('.holder');
    let allCorrect = true;

    holders.forEach((holder) => {
        const child = holder.querySelector('.letter');
        if (!child || child.dataset.holder !== holder.dataset.holder) {
            allCorrect = false; // If any holder doesn't have the correct letter
        }
    });

    if (allCorrect) {
        console.log('All letters set correctly!');
        $congratMsg.showModal(); // Show the congratulatory dialog
    }
};

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
    letters();
    addListeners();
    initCloseButton();
}

init();
