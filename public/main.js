const form = document.querySelector("form");
const input = document.querySelector(".input");
const messages = document.querySelector(".messages");
const usuarios = document.getElementById("usuarios");
const username = prompt("Please enter a nickname: ", "");
const socket = io();

form.addEventListener(
  "submit",
  function(event) {
    event.preventDefault();

    if (input.value !== "") {
      let msg = {
        message: input.value,
        username: username
      };

      addChat(msg);

      socket.emit("chat_msg", {
        message: input.value
      });

      input.value = "";
    }
    return false;
  },
  false
);

socket.on("chat_msg", function(data) {
  addChat(data);
});

socket.on("ingresa", function(data) {
  addMessage(
    `<i class="fas fa-user-plus text-warning"></i>&nbsp; ${data} se ha unido al chat!`
  );
});

socket.on("usuarios", us => {
  let users = us;

  while (usuarios.firstChild) {
    usuarios.removeChild(usuarios.firstChild);
  }

  users.forEach(elemento => {
    const div = document.createElement("div");
    const cardBody = document.createElement("div");
    const cardTitle = document.createElement("div");
    cardTitle.innerHTML = elemento;

    div.className = "card text-white bg-success mb-3 ";
    cardBody.className = "card-body";
    cardTitle.className = "card-title text-center";

    cardBody.appendChild(cardTitle);
    div.appendChild(cardBody);
    usuarios.appendChild(div);
  });
});

socket.on("deja_chat", function(data) {
  addMessage(
    `<i class="fas fa-user-slash text-danger"></i>&nbsp; ${data} ha abandonado el chat`
  );
});

addMessage(
  `<i class="fas fa-long-arrow-alt-right text-success"></i>&nbsp; has ingresado al chat como: ${username}`
);
socket.emit("ingresa", username);

function addMessage(message) {
  const li = document.createElement("li");
  li.innerHTML = message;
  li.className = "animated flipInX";
  messages.appendChild(li);
  messages.scrollTop = messages.scrollHeight;
}

function addChat(obj) {
  console.log(`username: ${obj.username} - usernameApp: ${username}`);

  const li = document.createElement("li");

  if (obj.username === username) {
    li.innerHTML = `${
      obj.message
    }&nbsp;&nbsp;<span class="badge badge-success">${obj.username}</span>`;
    li.className = "text-right animated fadeIn";
  } else {
    li.innerHTML = `<span class="badge badge-info animated fadeIn">${
      obj.username
    }</span>&nbsp;&nbsp;  ${obj.message}`;
  }

  messages.appendChild(li);
  messages.scrollTop = messages.scrollHeight;
}
