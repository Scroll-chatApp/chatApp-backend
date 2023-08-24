const http = require("http");
const express = require("express");
const cors = require("cors");
const socketIo = require("socket.io");

const app = express();
const port = 4500 || process.env.PORT;

app.use(cors());

app.get("/", (req, res) => {
  res.send("Thanks God its working");
});
let users = {};
const server = http.createServer(app);

const io = socketIo(server);

io.on("connection", (socket) => {
  let sender;
  console.log("new connection", " with id ", socket.id);

  socket.on("userJoined", ({ user }) => {
    console.log(user, "  has joioned on ", socket.id);
    users[user] = socket.id;
    sender = user;
    console.log(users);
  });

  socket.on("message", (message, receiverName) => {
    //console.log(message);
    socket.to(users[receiverName]).emit("sendMessage", message, sender);
    socket.emit("sendMessage", message, "You");
  });
});

server.listen(port, () => {
  console.log(`server is worrking on http://localhost:${port}`);
});
