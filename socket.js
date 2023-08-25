import { Server as SocketIo } from "socket.io";

export default function socketModule(server) {
  const io = new SocketIo(server);

  let users = {};

  io.on("connection", (socket) => {
    let sender;
    console.log("new connection", " with id ", socket.id);

    socket.on("userJoined", ({ user }) => {
      console.log(user, "  has joined on ", socket.id);
      users[user] = socket.id;
      sender = user;
      console.log(users);
    });

    socket.on("message", (message, receiverName) => {
      socket.to(users[receiverName]).emit("sendMessage", message, sender);
      socket.emit("sendMessage", message, "You");
    });
  });
}
