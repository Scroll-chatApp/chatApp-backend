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

const server = http.createServer(app);

const io = socketIo(server);
let a = 1;

io.on("connection", (socket) => {
  console.log("new connection", a++);
  socket.on("message", (message) => {
    console.log(message);
    io.emit("sendMessage", message);
  });
});

server.listen(port, () => {
  console.log(`server is worrking on http://localhost:${port}`);
});
