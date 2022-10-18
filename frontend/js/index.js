let url = "https://task-app-3kig.onrender.com";
if (window.location.origin === "http://127.0.0.1:5500")
  url = "http://localhost:5000";

let token = localStorage.getItem("token");
if (!token) window.location = "login.html";

let container = document.querySelector(".container");
container.style.display = "flex";

let goal;
let category = "test";
let categories = [];
let editing = false;

getGoals().then((data) => {
  data.forEach((e) => {
    createGoal(e);
  });
  createGoal();
});

let goals = document.querySelector(".goals");
let categoryDivs = document.querySelector(".categories").children;

for (let i = 0; i < categoryDivs.length; i++) {
  categoryDivs[i].addEventListener("click", () => {
    selectCategory(i);
  });
}

async function addGoal(data) {
  const response = await fetch(`${url}/api/goals`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify(data),
  });
  return response.json();
}

async function deleteGoal(data) {
  const response = await fetch(`${url}/api/goals/${data._id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  });
  return response.json();
}

async function editGoal(data, text) {
  const response = await fetch(`${url}/api/goals/${data._id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify(data),
  });
  return response.json();
}

async function getGoals() {
  const response = await fetch(`${url}/api/goals`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  });
  return response.json();
}

async function getMe() {
  const response = await fetch(`${url}/api/users/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  });
  return response.json();
}

function createCategory(cat) {
  let categoriesDiv = document.querySelector(".categories");
  let categoryDiv = document.createElement("div");
  categoryDiv.classList.add("category");
  categoryDiv.textContent = cat.toUpperCase();
  categoryDiv.addEventListener("click", () => selectCategory(cat));
  categoriesDiv.append(categoryDiv);
}

function createGoal(data) {
  let container = document.createElement("div");
  let background = document.createElement("div");
  let goalDiv = document.createElement("div");

  container.classList.add("goal-container");
  background.classList.add("goal-background");
  goalDiv.classList.add("goal");

  container.addEventListener("click", () => selectGoal(container));

  container.append(background, goalDiv);
  goals.append(container);

  if (data) {
    container.addEventListener("dblclick", () => getInput(data, container));
    goalDiv.textContent = data.text;
    handleButtons(data, container);
  } else {
    let newBtn = document.createElement("div");
    newBtn.classList.add("new-goal-button");
    newBtn.textContent = "+";
    newBtn.onclick = () => getInput(null, container);
    container.append(newBtn);
  }
}

function getCategories() {
  getGoals().then((data) => {
    data.forEach((e) => {
      if (!categories.includes(e.category)) categories.push(e.category);
    });

    categories.sort();
    categories.forEach((cat) => createCategory(cat));
  });
}

function getInput(data, container) {
  let goalDiv = container.children[1];
  let input = document.createElement("input");
  input.classList.add("edit-input");
  input.value = goalDiv.textContent;
  container.append(input);
  input.focus();
  input.addEventListener("keydown", (e) => {
    if (e.code === "Enter") input.blur();
  });
  input.addEventListener("focusout", () => {
    if (input.value !== "") {
      let text = input.value;
      goalDiv.textContent = text;
      container.style.outline = "none";
      if (data) {
        data.text = text;
        editGoal(data);
      } else {
        addGoal({ text, category }).then((data) => {
          console.log(data);
          handleButtons(data, container);
          container.addEventListener("click", () => selectGoal(container));
          container.addEventListener("dblclick", () =>
            getInput(data, container)
          );
        });
        let newBtn = document.querySelector(".new-goal-button");
        newBtn.remove();
        createGoal();
      }
    }
    input.remove();
  });
}

function goHome() {
  let pageTitle = document.querySelector(".page-title");
  let categoryContainer = document.querySelector(".categories");
  pageTitle.textContent = "";
  categoryContainer.style.display = "flex";

  let child = goals.lastElementChild;
  while (child) {
    goals.removeChild(child);
    child = goals.lastElementChild;
  }
}

function handleButtons(data, container) {
  let optionsMenu = document.createElement("div");
  let optionsBtn = document.createElement("div");
  let deleteBtn = document.createElement("div");

  optionsMenu.classList.add("options-menu");
  optionsBtn.classList.add("options-button");
  deleteBtn.classList.add("delete-button");

  optionsBtn.onclick = () => {
    if (optionsMenu.style.width === "50px") optionsMenu.style.width = "0px";
    else optionsMenu.style.width = "50px";
  };

  deleteBtn.onclick = () => {
    deleteGoal(data).then((data) => {
      if (data.id) container.remove();
    });
  };

  optionsMenu.append(deleteBtn);
  container.children[1].append(optionsMenu, optionsBtn);
}

function logout() {
  localStorage.removeItem("token");
  token = null;
  window.location = "login.html";
}

function selectCategory(cat) {
  category = cat;
  let pageTitle = document.querySelector(".page-title");
  let categoryContainer = document.querySelector(".categories");
  pageTitle.textContent = cat.toUpperCase();
  categoryContainer.style.display = "none";

  getGoals().then((data) => {
    let child = goals.lastElementChild;
    while (child) {
      goals.removeChild(child);
      child = goals.lastElementChild;
    }

    data.forEach((e) => {
      if (e.category === category) createGoal(e);
    });

    createGoal();
  });
}

function selectGoal(selectedGoal) {
  let allGoals = goals.children;
  for (let i = 0; i < allGoals.length; i++) {
    allGoals[i].children[1].style.outline = "1px solid #ddd";
  }
  selectedGoal.children[1].style.outline = "1px solid blue";
  if (selectedGoal === goals.lastElementChild) getInput(null, selectedGoal);
}
