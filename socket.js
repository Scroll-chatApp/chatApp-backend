import { Server } from "socket.io";
import { updateSocketId } from "./Controller/user.js";
import { newMessage } from "./Controller/message.js";

let users = {};
export default function socketModule(server) {
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    socket.on("userJoined", ({ user }) => {
      users[user] = socket.id;
      updateSocketId(user, socket.id); //update user socket id
    });

    socket.on(
      "sendMessage",
      ({ messageToSend, type, senderId, conversationId, receiverName }) => {
        const result = newMessage(
          messageToSend,
          type,
          senderId,
          conversationId
        );
        socket.to(users[receiverName]).emit("receiverMessage");
        
      }
    );
  });
}
