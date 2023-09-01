import { Server } from "socket.io";
import { updateSocketId } from "./Controller/user.js";
import { newMessage } from "./Controller/message.js";

let user = {}
export default function socketModule(server) {
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    socket.on("userJoined", ({ user }) => {
      updateSocketId(user, socket.id); //update user socket id
    });

    socket.on(
      "sendMessage",
      ({ messageToSend, type, senderId, conversationId, receiverSocketId }) => {
        const result = newMessage(
          messageToSend,
          type,
          senderId,
          conversationId
        );
        socket.to(receiverSocketId).emit("receiverMessage");
        
      }
    );
  });
}
