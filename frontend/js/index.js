let token = localStorage.getItem('token');
if (!token) window.location = 'login.html';

let goal;
let category;
let categories = ['luminate', 'personal', 'task app'];
let editing = false;

let goals = document.querySelector('.goals');
let categoryDivs = document.querySelector('.categories').children;

for (let i = 0; i < categoryDivs.length; i++) {
    categoryDivs[i].addEventListener('click', () => {
        selectCategory(i);
    })
}

async function addGoal(data) {
    const response = await fetch('http://localhost:5000/api/goals', { 
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(data)
    });
    return response.json();
}

async function deleteGoal(data) {
    const response = await fetch(`http://localhost:5000/api/goals/${data._id}`, { 
        method: 'DELETE',
        headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
        },
    });
    return response.json();
}

async function editGoal(data, text) {
    const response = await fetch(`http://localhost:5000/api/goals/${data._id}`, { 
        method: 'PUT',
        headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(data)
    });
    return response.json();
}

async function getGoals() {
    const response = await fetch('http://localhost:5000/api/goals', {
        method: 'GET',
        headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
        }
    });
    return response.json();
}

async function getMe() {
    const response = await fetch('http://localhost:5000/api/users/me', {
        method: 'GET',
        headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
        }
    });
    return response.json();
}

function addNewContainer() {
    appendGoal();
    let container = goals.lastElementChild;
    let newBtn = document.createElement('div');
    newBtn.classList.add('new-goal-button');
    newBtn.innerHTML = '+';
    newBtn.onclick = () => getInput(null, container);
    container.append(newBtn);
}

function appendGoal(data) {
    let container = document.createElement('div');
    let goalDiv = document.createElement('div');

    container.classList.add('goal-container')
    goalDiv.classList.add('goal');

    container.append(goalDiv);
    goals.append(container);

    if (data) {
        goalDiv.innerHTML = data.text;
        handleButtons(data, container);
    }
}

function getInput(data, container) {
    let goalDiv = container.children[0];
    let input = document.createElement('input');
    input.classList.add('edit-input');
    input.value = goalDiv.innerHTML;
    container.append(input);
    input.focus();
    input.addEventListener('keydown', (e) => {
        if (e.code === 'Enter') input.blur();
    })
    input.addEventListener('focusout', (e) => {
        if (input.value !== '') {
            let text = input.value;
            goalDiv.innerHTML = text;
            if (data) {
                data.text = text;
                editGoal(data);
            } else {
                addGoal({text, category}).then((data) => handleButtons(data, container));
                let newBtn = document.querySelector('.new-goal-button');
                newBtn.remove();
                addNewContainer();
            }
            input.remove();
        }
    });
}

function goHome() {
    let pageTitle = document.querySelector('.page-title');
    let categoryContainer = document.querySelector('.categories');
    pageTitle.textContent = '';
    categoryContainer.style.display = 'flex';

    let child = goals.lastElementChild; 
    while (child) {
        goals.removeChild(child);
        child = goals.lastElementChild;
    }
}

function handleButtons(data, container) {
    let optionsMenu = document.createElement('div');
    let optionsBtn = document.createElement('div');
    let editBtn = document.createElement('div');
    let deleteBtn = document.createElement('div');

    optionsMenu.classList.add('options-menu');
    optionsBtn.classList.add('options-button');
    editBtn.classList.add('edit-button');
    deleteBtn.classList.add('delete-button');

    optionsBtn.onclick = () => {
        if (optionsMenu.style.width === '80px') optionsMenu.style.width = '0px';
        else optionsMenu.style.width = '80px';
    }

    editBtn.onclick = () => getInput(data, container);
    deleteBtn.onclick = () => {
        deleteGoal(data)
        .then(data => {
            if (data.id) container.remove();
        })
    }

    optionsMenu.append(editBtn, deleteBtn);
    container.append(optionsMenu, optionsBtn);
}

function logout() {
    localStorage.removeItem('token');
    token = null;
    window.location = 'login.html';
}

function selectCategory(i) {
    category = categories[i];
    let pageTitle = document.querySelector('.page-title');
    let categoryContainer = document.querySelector('.categories');
    pageTitle.textContent = category.toUpperCase();
    categoryContainer.style.display = 'none';

    getGoals().then((data) => {
        let child = goals.lastElementChild; 
        while (child) {
            goals.removeChild(child);
            child = goals.lastElementChild;
        }

        data.forEach((e) => {
            if (e.category === category) appendGoal(e);
        })

        addNewContainer();
    })
}