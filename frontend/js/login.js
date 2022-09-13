let form2 = document.querySelector('#form2');

let logins = form2.children;
let loginData = [];
for (let i = 0; i < logins.length - 1; i++) {
    logins[i].addEventListener('input', () => {
        loginData[i] = logins[i].value;
    })
}

form2.addEventListener('submit', (e) => {
    e.preventDefault();
    login({
        email: loginData[0],
        password: loginData[1]
    })
    .then((data) => {
        token = data.token;
        if (token) {
            localStorage.setItem('token', token);
            window.location = 'index.html';
        } else console.log('Invalid credentials')
    });
})

async function login(data) {
    const response = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    return response.json();
}