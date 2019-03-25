const express = require("express");
const app = express();
const http = require("http").Server(app);
const path = require("path");
const favicon = require("serve-favicon");
const publicPath = path.resolve(__dirname, "./public");
const io = require("socket.io")(http);

app.use(express.static(publicPath));
app.use(favicon(`${publicPath}/favicon.ico`));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index.ejs", {
    title: "Chat con Socket.IO"
  });
});

const getUsuarios = () => {
  let clients = io.sockets.clients().connected;
  let sockets = Object.values(clients);
  let users = sockets.map(socket => socket.user);

  return users;
};

const emitUsuarios = () => {
  io.emit("usuarios", getUsuarios());
};

io.on("connection", function(socket) {
  socket.on("ingresa", function(data) {
    this.username = data;
    socket.user = data;
    socket.broadcast.emit("ingresa", data);
    emitUsuarios();
  });

  socket.on("chat_msg", function(data) {
    data.username = this.username;
    socket.broadcast.emit("chat_msg", data);
  });

  socket.on("disconnect", function(data) {
    emitUsuarios();
    socket.broadcast.emit("deja_chat", this.username);
  });
});

http.listen(8080, () => console.log("escuchando desde puerto 8080"));
