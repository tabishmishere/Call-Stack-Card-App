let addNote = document.querySelector("#add-note");
let formContainer = document.querySelector(".form-container");
let closeForm = document.querySelector(".closeForm");

const stack = document.querySelector(".stack");
const upBtn = document.querySelector("#upBtn");
const downBtn = document.querySelector("#downBtn");

const form = document.querySelector("form");

const imageUrlInput = form.querySelector("input[placeholder='https://example.com/photo.jpg']");
const fullNameInput = form.querySelector("input[placeholder='Enter full name']");
const homeTownInput = form.querySelector("input[placeholder='Enter home town']");
const purposeInput = form.querySelector("input[placeholder='e.g., Quick appointment note']");
const categoryButtons = document.querySelectorAll(".category-btn");
const categoryInput = document.querySelector("#categoryInput");

addNote.addEventListener("click", () => {
  formContainer.style.display = "initial";
});

closeForm.addEventListener("click", () => {
  formContainer.style.display = "none";
});

// Handle category button selection
categoryButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    categoryButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    categoryInput.value = btn.dataset.value;
  });
});

form.addEventListener("submit", function (evt) {
  evt.preventDefault();

  const imageUrl = imageUrlInput.value.trim();
  const fullName = fullNameInput.value.trim();
  const homeTown = homeTownInput.value.trim();
  const purpose = purposeInput.value.trim();
  const selected = categoryInput.value;

  if (!imageUrl || !fullName || !homeTown || !purpose || !selected) {
    alert("Please fill out all fields and select a category.");
    return;
  }

  saveToLocalStorage({
    imageUrl,
    fullName,
    homeTown,
    purpose,
    selected,
  });

  form.reset();
  categoryButtons.forEach(b => b.classList.remove("active"));
  categoryInput.value = "";
  formContainer.style.display = "none";
  showCards();
});

function saveToLocalStorage(obj) {
  let oldTasks = JSON.parse(localStorage.getItem("tasks")) || [];
  oldTasks.push(obj);
  localStorage.setItem("tasks", JSON.stringify(oldTasks));
}

function showCards() {
  stack.innerHTML = "";
  let allTasks = JSON.parse(localStorage.getItem("tasks")) || [];

  if (allTasks.length === 0) {
    stack.innerHTML = "<p style='text-align:center; color:#aaa'>No notes yet. Click + to add.</p>";
    return;
  }

  allTasks.forEach(task => {
    const card = document.createElement("div");
    card.classList.add("card");

    const avatar = document.createElement("img");
    avatar.src = task.imageUrl;
    avatar.alt = "profile";
    avatar.classList.add("avatar");
    card.appendChild(avatar);

    const name = document.createElement("h2");
    name.textContent = task.fullName;
    card.appendChild(name);

    const hometownInfo = document.createElement("div");
    hometownInfo.classList.add("info");
    hometownInfo.innerHTML = `<span>Home town</span><span>${task.homeTown}</span>`;
    card.appendChild(hometownInfo);

    const purposeInfo = document.createElement("div");
    purposeInfo.classList.add("info");
    purposeInfo.innerHTML = `<span>Purpose</span><span>${task.purpose}</span>`;
    card.appendChild(purposeInfo);

    const buttonsDiv = document.createElement("div");
    buttonsDiv.classList.add("buttons");

    const callBtn = document.createElement("button");
    callBtn.classList.add("call");
    callBtn.innerHTML = '<i class="ri-phone-line"></i> Call';

    const msgBtn = document.createElement("button");
    msgBtn.classList.add("msg");
    msgBtn.textContent = "Message";

    buttonsDiv.appendChild(callBtn);
    buttonsDiv.appendChild(msgBtn);
    card.appendChild(buttonsDiv);

    stack.appendChild(card);
  });
  updateStack();
}

function updateStack() {
  const cards = document.querySelectorAll(".stack .card");
  cards.forEach((card, i) => {
    card.style.zIndex = cards.length - i;
    card.style.transform = `translateY(${i * 10}px) scale(${1 - i * 0.02})`;
    card.style.opacity = `${1 - i * 0.1}`;
  });
}

upBtn.addEventListener("click", () => {
  let lastChild = stack.lastElementChild;
  if (lastChild) {
    stack.insertBefore(lastChild, stack.firstElementChild);
    updateStack();
  }
});

downBtn.addEventListener("click", () => {
  let firstChild = stack.firstElementChild;
  if (firstChild) {
    stack.appendChild(firstChild);
    updateStack();
  }
});

showCards();
