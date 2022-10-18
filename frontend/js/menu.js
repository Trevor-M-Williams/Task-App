let navOpen = false;
let nav = document.querySelector('.nav-container');
let navLogoOverlay = document.querySelector('.nav-logo-overlay');
let navItems = document.querySelectorAll('.nav-item');
let navLabels = document.querySelectorAll('.nav-label');
let navHandle = document.querySelector('.nav-handle');
let navHandleTop = document.querySelector('.handle.top');
let navHandleBot = document.querySelector('.handle.bottom');

closeNav();

let wait = (ms) => new Promise(resolve => setTimeout(resolve, ms))
let labelStrings = ['Home', 'Logout'];

navHandle.addEventListener('click', handleNav)

navHandle.addEventListener('mouseenter', () => {
    let n = navOpen * 2 - 1;
    navHandleTop.style.transform = `rotate(${n * 24}deg)`;
    navHandleBot.style.transform = `rotate(${-n * 24}deg)`;
})

navHandle.addEventListener('mouseleave', () => {
    navHandleTop.style.transform = `rotate(0deg)`;
    navHandleBot.style.transform = `rotate(0deg)`;
})

function handleNav() {
    if (navOpen) closeNav();
    else openNav();
    navOpen = !navOpen;
}

function closeNav() {
    nav.style.width = '60px';
    navLogoOverlay.style.width = '18px';
    navHandleTop.style.margin = '-2px 0';
    navHandleBot.style.margin = '-2px 0';
    navLabels.forEach((e) => {
        e.innerHTML = '';
        e.style.display = 'none';
    })
}

function openNav() {
    nav.style.width = '240px';
    navHandleTop.style.margin = '-0.5px 0';
    navHandleBot.style.margin = '-0.5px 0';
    setTimeout(() => {
        navLabels.forEach((e, i) => {
            e.style.display = 'block';
            let str = labelStrings[i];
            let loop = async () => {
                for (let letter of str) {
                    e.innerHTML += letter;
                    await wait(10);
                    if (!navOpen) break;
                }
            }
            loop();
        })
    }, 200)
}

let menuKeys = [false, false];

window.addEventListener('keydown', (e) => {
    if (e.key === 'Alt' && menuKeys[0] === false) menuKeys[0] = true;
    else if (e.key === 'm' && menuKeys[1] === false) menuKeys[1] = true;
    else menuKeys = [false, false];
    
    if (menuKeys[0] === true && menuKeys[1] === true) handleNav();
})

window.addEventListener('keyup', (e) => {
    if (e.key === 'm') menuKeys = [true, false];
    else menuKeys = [false, false];
})