import { Server } from "socket.io";
import { updateSocketId } from "./Controller/user.js";
import { newMessage } from "./Controller/message.js";

import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: "dubwggg4a",
  api_key: "431517811498724",
  api_secret: "eoejYyKRwg1jg6EBHzh2evyjkEE",
});

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
      updateSocketId(user, socket.id); // Update user socket id
    });

    socket.on(
      "sendMessage",
      async ({
        messageToSend,
        type,
        senderId,
        conversationId,
        receiverName,
      }) => {
        try {
          newMessage(messageToSend, type, senderId, conversationId);
          // Emit the message to the receiver and sender
          socket.to(users[receiverName]).emit("receiverMessage");
          socket.emit("senderMessage");
        } catch (error) {
          console.error("Error handling text message:", error);
        }
      }
    );

    socket.on(
      "sendFile",
      async ({ fileToSend, type, senderId, conversationId, receiverName }) => {
        try {
          const uploadResult = await uploadFile(fileToSend);
          const fileUrl = uploadResult.secure_url;

          newMessage(fileUrl, "file", senderId, conversationId);
          // Emit the message with the updated messageToSend (file URL)
          socket.to(users[receiverName]).emit("receiverMessage");
          socket.emit("senderMessage");
        } catch (error) {
          console.error("Error handling file upload:", error);
        }
      }
    );
  });
}
async function uploadFile(bufferToUpload) {
  return new Promise((resolve, reject) => {
    // Create a read stream from the Buffer
    const readStream = cloudinary.uploader.upload_stream(
      {
        resource_type: "auto", // Let Cloudinary auto-detect the file type
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
    // Pipe the Buffer to the Cloudinary upload stream
    readStream.write(bufferToUpload);
    readStream.end();
  });
}
