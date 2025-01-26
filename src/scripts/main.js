// import dice1 from './../assets/svg/dice-dots-1.svg';
// import dice2 from './../assets/svg/dice-dots-2.svg';
// import dice3 from './../assets/svg/dice-dots-3.svg';
// import dice4 from './../assets/svg/dice-dots-4.svg';
// import dice5 from './../assets/svg/dice-dots-5.svg';
// import dice6 from './../assets/svg/dice-dots-6.svg';

// const diceSides = [
//     { image: dice1, number: 1 },
//     { image: dice2, number: 2 },
//     { image: dice3, number: 3 },
//     { image: dice4, number: 4 },
//     { image: dice5, number: 5 },
//     { image: dice6, number: 6 },
// ];

document.documentElement.classList.add('js-enabled');
const $hamburger = document.querySelector('.hamburger');
const $navMenu = document.querySelector('.nav__menu');
const $choices = document.querySelectorAll('.interaction__choice');
const $dialog = document.getElementById('choiceDialog');
const $closeButton = document.querySelector('.popup__close');
const $closeButtonTwo = document.querySelector('.popup__close-two')
const $congratMsg = document.querySelector('.congrats__msg');
const $message = document.querySelector('.message');
const $answMsg = document.querySelector('.answ__msg')
const $result = document.querySelector('.result');
const $letters = Array.from(document.querySelectorAll('.letter'));
const $hintButtons = document.querySelectorAll('.hint__button');
const $hints = document.querySelectorAll('.hint');
const $dices = document.querySelector('.dices');
const $numberForm = document.getElementById('numberForm');
const $numberInput = document.getElementById('singleDigit');
const $choiceDialog = document.getElementById('numberDialog');
const $closeButtonThree = document.querySelector('.popup__close-three');
const $diceInstructions = document.querySelector('.dice__instru');
const $conChoices = document.querySelectorAll('.consequences__choice');
const $checkBtn = document.querySelector('.check');
const $feedback = document.querySelector('.feedback');

const correctAnswer = 5;
const correctChoices = ['death', 'heavy fines', 'prison'];
let draggedLetter = null;
let letterClone = null;
let isTouch;
let lastTap = 0;
let selectedChoices = [];

const getRandomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

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
}

const enableDragging = (letter) => {
    letter.addEventListener('mousedown', grabLetter);
    letter.addEventListener('touchstart', grabLetter);
    letter.addEventListener('dragstart', (e) => e.preventDefault());
}

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
}

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
}

const addListeners = () => {
    $letters.forEach((letter) => {
        letter.dataset.rotation = letter.dataset.rotation || 0;
        letter.addEventListener('click', () => handleRotation(letter));
        letter.addEventListener('mousedown', grabLetter);
        letter.addEventListener('touchstart', grabLetter);
        letter.addEventListener('dragstart', (e) => e.preventDefault());
    });
}

const checkCompletion = () => {
    const holders = document.querySelectorAll('.holder');
    let allCorrect = true;

    holders.forEach((holder) => {
        const child = holder.querySelector('.letter');
        if (!child || child.dataset.holder !== holder.dataset.holder) {
            allCorrect = false;
        }
    });

    if (allCorrect) {
        console.log('All letters set correctly!');
        $congratMsg.showModal();
    }
    $closeButtonTwo.addEventListener('click', () => {
        $congratMsg.close();
    });
}

const showHint = (index) => {
    $hints[index].classList.remove('hidden');
}

const hideHint = (index) => {
    $hints[index].classList.add('hidden');
}

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
}

const diceDevice = () => {
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) {
        $diceInstructions.textContent = 'Double tap to roll the dice!';
    } else {
        $diceInstructions.textContent = 'Press SPACE to roll the dice!';
    }
}

const handleDoubleTap = (event) => {
    const currentTime = new Date().getTime();
    const timeSince = currentTime - lastTap;

    if (timeSince < 300 && timeSince > 0) {
        rollDiceWithAnimation();
    }

    lastTap = currentTime;
}

const rollDiceWithAnimation = () => {
    let intervalId;

    const getRandomDiceSide = () => diceSides[Math.floor(Math.random() * diceSides.length)].image;

    let animationDuration = 2000;
    let animationInterval = 100;

    intervalId = setInterval(() => {
        $dices.innerHTML = `
            <img src="${getRandomDiceSide()}" alt="Dice 1" width="40%">
            <img src="${getRandomDiceSide()}" alt="Dice 2" width="40%">
        `;
    }, animationInterval);

    setTimeout(() => {
        clearInterval(intervalId);

        rollDice();
    }, animationDuration);
}

const rollDice = () => {
    const dice1 = diceSides[Math.floor(Math.random() * diceSides.length)];
    const dice2 = diceSides[Math.floor(Math.random() * diceSides.length)];

    $dices.innerHTML = `
        <img src="${dice1.image}" alt="Dice 1" width="40%">
        <img src="${dice2.image}" alt="Dice 2" width="40%">
    `;

    const explanationElement = document.querySelector('.explanation');

    if (dice1.number === dice2.number) {
        explanationElement.textContent = 'You would get away!';
        explanationElement.classList.add('explain__style');
    } else {
        explanationElement.textContent = 'You wouldn’t get away!';
        explanationElement.classList.add('explain__style');
    }
}

const handleFormSubmit = (event) => {
    event.preventDefault();
    const userAnswer = parseInt($numberInput.value);

    if (userAnswer === correctAnswer) {
        updateDialogMessage('Well done!');
        $choiceDialog.showModal();
    } else {
        updateDialogMessage('Oh no!');
        $choiceDialog.showModal();
    }
}

const updateDialogMessage = (message) => {
    $answMsg.textContent = message;
}

const handleChoice = () => {
    $conChoices.forEach((choice) => {
        choice.addEventListener('click', () => {
            const choiceIndex = selectedChoices.indexOf(choice);

            if (choiceIndex !== -1) {
                selectedChoices.splice(choiceIndex, 1);
                choice.style.opacity = '1';
            } else {
                if (selectedChoices.length < 3) {
                    selectedChoices.push(choice);
                    choice.style.opacity = '0.5';
                } else {
                    $feedback.textContent = 'You can only select 3 consequences.';
                }
            }

            if (selectedChoices.length === 3) {
                $checkBtn.classList.remove('hidden');
                $feedback.textContent = '';
            } else {
                $checkBtn.classList.add('hidden');
            }
        });
    });
}

const handleCheck = () => {
    if (selectedChoices.length === 3) {
        const selectedIds = selectedChoices.map((choice) =>
            choice.querySelector('p').textContent.trim().toLowerCase()
        );
        const isCorrect = correctChoices.every((answer) => selectedIds.includes(answer));

        if (isCorrect) {
            $feedback.textContent = 'You are RIGHT!';
            $feedback.classList.add('feedback__right');
        } else {
            $feedback.textContent = 'Right answers: Prison, Heavy fines, Death';
            $feedback.classList.remove('feedback__right');
        }
    } else {
        $feedback.textContent = 'Please select exactly 3 consequences.';
    }
}

const consequencesIntr = () => {
    $checkBtn.classList.add('hidden');
    handleChoice();
    $checkBtn.addEventListener('click', handleCheck);
}

const hamburgerMenu = () => {
    $hamburger.addEventListener('click', () => {
        const isExpanded = $hamburger.getAttribute('aria-expanded') === 'true';
        $hamburger.setAttribute('aria-expanded', !isExpanded);
        $navMenu.classList.toggle('active');
    });
}

const toggleHint = () => {
    $hintButtons.forEach((button, index) => {
        button.addEventListener('mousedown', () => showHint(index));
        button.addEventListener('touchstart', () => showHint(index));
        button.addEventListener('mouseup', () => hideHint(index));
        button.addEventListener('touchend', () => hideHint(index));

        button.addEventListener('click', (e) => e.preventDefault());
    });
}

const diceListeners = () => {
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space') {
            e.preventDefault();
            rollDiceWithAnimation();
        }
    });
}

const submitForm = () => {
    $numberForm.addEventListener('submit', handleFormSubmit);
    $closeButtonThree.addEventListener('click', () => {
        $choiceDialog.close();
    });
}

const diceActions = () => {
    diceListeners();
    $dices.addEventListener('touchstart', handleDoubleTap);
}

const interactions = () => {
    clickableChoice();
    addListeners();
    consequencesIntr();
    // diceActions();
    diceDevice();
    submitForm();
}

const headerAnimations = () => {
    gsap.from('header', {
        opacity: 0,
        y: -100,
        duration: 1,
        ease: 'power2.out',
    });

    gsap.from('.cta', {
        opacity: 0,
        scale: 0.8,
        duration: 1,
        ease: 'power2.out',
    });
}

const introAnimation = () => {
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: ".introduction",
            start: "top 90%",
            end: "top -80%",
            scrub: true,
            // markers: true,
            once: true,
        },
    })
    tl.from(".intro", {
        y: 150,
        opacity: 0,
        duration: 1,
    })
    tl.from(".born", {
        opacity: 0,
        scale: 0.2,
        duration: 1,
        y: 100,
    })
    tl.from('.antwerp__based img', {
        opacity: 0,
        x: 100,
        duration: 1,
    })
    tl.from('.antwerp', {
        opacity: 0.2,
        scale: 0.2,
        duration: 1,
    })
}

const officianaAnimation = () => {
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: ".officiana",
            start: "top center",
            end: "top -50%",
            scrub: true,
            // markers: true,
        },
    })
    tl.from('.house__image', {
        scale: 0.1,
        opacity: 0,
        duration: 1,
        delay: 1,
    })
    tl.to('.transition__map', {
        x: -200,
        scale: 2.4,
        duration: 1,
    })
        .to('.transition__map path', {
            fill: "#DBB78B",
        }, "<");

}

const qualityAnimation = () => {

    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: ".quality",
            start: "top 70%",
            end: "top -20%",
            scrub: true,
            // markers: true,
            once: true,
        },
    })

    tl.from('.quality>p', {
        x: "50%",
        y: "30%",
        ease: 'power2.out',
    })
        .from('.quality picture', {
            x: "-50%",
            y: "30%",
            ease: 'power2.out',
        }, "<")
}

const hustlesAnimation = () => {
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: ".hustles",
            start: "top center",
            end: "top top",
            scrub: true,
            // markers: true,
            once: true,
        },
    })

    tl.from('.hustles>p', {
        x: "-50%",
        y: "30%",
        ease: 'power2.out',
    })
        .from('.hustles picture', {
            x: "50%",
            y: "30%",
            ease: 'power2.out',
        }, "<")
}

const standardsAnimation = () => {
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: ".high__standards",
            start: "top 90%",
            end: "top top",
            scrub: true,
            // markers: true,
            once: true,
        },
    })
    tl.from('.standards__intro', {
        opacity: 0,
        ease: 'power2.out',
        duration: 1
    })
    tl.from('.standards__intro img', {
        rotation: -5,
        ease: "back.out(5)",
        duration: 1,
    })
    tl.from('.most', {
        scale: 0,
        opacity: 0,
        duration: 2,
        ease: "back.out(1.7)",
        delay: 2,
    })
}

const hrAnimation = () => {
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: '.polyglot',
            start: "top bottom",
            end: "50% center",
            scrub: true,
            // markers: true,
            once: true,
        }
    })
    tl.from('.top', {
        '--bible-width': '0',
        duration: 1,
    })
    tl.from('.bottom', {
        '--bible-width': '0',
        duration: 1,
    }, "<");
    tl.from('.polyglot', {
        opacity: 0,
        scale: 0.2,
        duration: 2,
    })
}

const starsAnimation = () => {
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: '.printing__stars',
            start: "-20% center",
            end: "bottom center",
            scrub: true,
            markers: true,
            once: true,
        }
    })

    tl.from('.printing__stars', {
        opacity: 0,
        scale: 0.5,
        duration: 1,
    })
    tl.from('.printing__stars p', {
        opacity: 0,
        y: "60%",
        duration: 2,
    })
}



gsap.registerPlugin(ScrollTrigger);
gsap.from(".letter", {
    scale: 0,
    opacity: 0,
    duration: 1,
    stagger: 0.2,
    ease: "back.out(1.7)",
    scrollTrigger: {
        trigger: ".metal__letters",
        start: "top 80%",
        end: "bottom center",
        // markers: true,
        scrub: false,
    },
});

gsap.from(".consequences__choice", {
    scale: 0.5,
    opacity: 0,
    duration: 1,
    stagger: 0.2,
    ease: "back.out(1.2)",
    scrollTrigger: {
        trigger: ".choices",
        start: "top 80%",
        end: "bottom center",
        // markers: true,
        scrub: false,
    },
});

gsap.from(".left__press", {
    scale: 0.5,
    x: "-50%",
    y: "20%",
    opacity: 0,
    duration: 1,
    ease: "power2.out",
    scrollTrigger: {
        trigger: ".risks",
        start: "top 80%",
        end: "bottom center",
        // markers: true,
        scrub: false,
    },
});

gsap.from(".right__press", {
    scale: 0.5,
    x: "50%",
    y: "20%",
    opacity: 0,
    duration: 1,
    ease: "power2.out",
    scrollTrigger: {
        trigger: ".risks",
        start: "top 80%",
        end: "bottom center",
        // markers: true,
        scrub: false,
    },
})

gsap.from(".dangerous", {
    scale: 0.5,
    opacity: 0,
    duration: 1,
    ease: "back.out(1.7)",
    scrollTrigger: {
        trigger: ".dangerous",
        start: "top 80%",
        end: "bottom top",
        // markers: true,
        scrub: false,
    },
})

gsap.from(".dices img", {
    scale: 0,
    opacity: 0,
    duration: 1,
    rotation: 360,
    ease: "back.out(1.2)",
    scrollTrigger: {
        trigger: ".dice__inter",
        start: "top center",
        end: "bottom top",
        // markers: true,
        scrub: false,
    },
})

gsap.from(".today__line,today", {
    opacity: 0,
    scale: 0.2,
    duration: 1,
    ease: "back.out(1.2)",
    scrollTrigger: {
        trigger: ".printing__house",
        start: "top 20%",
        end: "bottom top",
        markers: true,
        scrub: false,
    },
})

gsap.from(".museum p", {
    opacity: 0,
    scale: 0.2,
    duration: 1,
    ease: "back.out(1.2)",
    scrollTrigger: {
        trigger: ".museum",
        start: "top 80%",
        end: "bottom center",
        markers: true,
        scrub: false,
    },
})





const scrollAnimation = () => {
    headerAnimations();
    introAnimation();
    officianaAnimation();
    qualityAnimation();
    // lettersAnimation();
    standardsAnimation();
    hustlesAnimation();
    hrAnimation();
    starsAnimation();
}



const init = () => {
    gsap.registerPlugin(ScrollTrigger);
    hamburgerMenu();
    letters();
    toggleHint();
    interactions();
    scrollAnimation();
}

init();
