let token = localStorage.getItem('token');
if (!token) window.location = 'login.html';

let user;
getMe().then((data) => {
    user = data;
    let userName = document.querySelector('#user-name');
    userName.innerHTML = `${user.name.toUpperCase()}`;
})

let goals = document.querySelector('.goals');
getGoals().then((data) => {
    data.forEach((e) => {
        appendGoal(e);
    })
})

let form3 = document.querySelector('#form3');
let goal;
let goalInput = form3.children[0];
goalInput.addEventListener('input', () => {
    goal = goalInput.value;
})

form3.addEventListener('submit', (e) => {
    e.preventDefault();
    addGoal({text: goal})
    .then((data) => {
        if (data.text) {
            appendGoal(data);
        } else console.log('Please enter a goal')
    })
})

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

async function editGoal(data, container) {
    // const response = await fetch(`http://localhost:5000/api/goals/${data._id}`, { 
    //     method: 'PUT',
    //     headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': 'Bearer ' + token
    //     },
    // });
    // return response.json();

    let input = document.createElement('input');
    input.classList.add('edit-input');
    container.append(input);

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

function appendGoal(data) {
    let container = document.createElement('div');
    let goal = document.createElement('div');
    let editDelete = document.createElement('div');
    let editBtn = document.createElement('div');
    let deleteBtn = document.createElement('div');
    container.classList.add('goal-container')
    goal.classList.add('goal');
    goal.innerHTML = data.text;
    editDelete.classList.add('edit-delete');
    editBtn.classList.add('edit-goal');
    editBtn.onclick = () => {
        editGoal(data, container);
    }
    deleteBtn.classList.add('delete-goal');
    deleteBtn.onclick = () => {
        deleteGoal(data)
        .then(data => {
            if (data.id) {
                container.remove();
            }
        })
    }
    editDelete.append(editBtn, deleteBtn);
    container.append(goal, editDelete);
    goals.append(container);
    goalInput.value = '';
}

function logout() {
    localStorage.removeItem('token');
    token = null;
    window.location = 'login.html';
}