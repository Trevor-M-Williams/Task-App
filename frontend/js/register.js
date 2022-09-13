let form1 = document.querySelector('#form1');

let inputs = form1.children;
let userData = [];
for (let i = 0; i < inputs.length - 1; i++) {
    inputs[i].addEventListener('input', () => {
        userData[i] = inputs[i].value;
    })
}

form1.addEventListener('submit', (e) => {
    e.preventDefault();
    register({
        name: userData[0],
        email: userData[1],
        password: userData[2]
    })
    .then((data) => {
        token = data.token;
        if (token) {
            localStorage.setItem('token', token);
            window.location = 'index.html';
        } else console.log('Registration failed')
    });
})

async function register(data) {
    const response = await fetch('http://localhost:5000/api/users', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    return response.json();
}