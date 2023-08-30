import { Server } from "socket.io";
import { updateSocketId } from "./Controller/user.js";
import { newMessage } from "./Controller/message.js";

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

    socket.on(
      "sendMessage",
      ({ messageToSend, type, senderId, conversationId }) => {
        console.log(messageToSend);
        const result = newMessage(
          messageToSend,
          type,
          senderId,
          conversationId
        );
      }
    );
  });
}
