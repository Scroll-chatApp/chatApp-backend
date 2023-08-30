import { Server } from "socket.io";
import { updateSocketId } from "./Controller/user.js";

export default function socketModule(server) {
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    socket.on("userJoined", ({ user }) => {
      updateSocketId(user, socket.id); //update user socket id
      socket.emit("scoketid", socket.id);
    });

    socket.on("message", (message, receiverName) => {
      socket.to(users[receiverName]).emit("sendMessage", message);
      socket.emit("sendMessage", message);
    });
  });
}
