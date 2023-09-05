import { Server } from "socket.io";
import { updateSocketId } from "./Controller/user.js";
import { newMessage } from "./Controller/message.js";
import { v2 as cloudinary } from "cloudinary";
import { api_key, api_secret, cloud_name } from "./constant/constant.js";

cloudinary.config({
  cloud_name: cloud_name,
  api_key: api_key,
  api_secret: api_secret,
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
          // Emit the message to receiver and sender
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
        if (type === "pic") {
          try {
            const uploadResult = await uploadFile(fileToSend);
            const fileUrl = uploadResult.secure_url;

            newMessage(fileUrl, "pic", senderId, conversationId);
            // Emit the message to receiver and sender
            socket.to(users[receiverName]).emit("receiverMessage");
            socket.emit("senderMessage");
          } catch (error) {
            console.error("Error handling file upload:", error);
          }
        } else {
          try {
            const uploadResult = await uploadFile(fileToSend, "pdf");
            const fileUrl = uploadResult.secure_url;

            newMessage(fileUrl, "pdf", senderId, conversationId);
            // Emit the message to receiver and sender
            socket.to(users[receiverName]).emit("receiverMessage");
            socket.emit("senderMessage");
          } catch (error) {
            console.error("Error handling file upload:", error);
          }
        }
      }
    );
  });
}
async function uploadFile(bufferToUpload, fileType) {
  return new Promise((resolve, reject) => {
    const uploadOptions = {
      resource_type: fileType === "pdf" ? "raw" : "auto", //'raw' for PDF files 'auto' for images
    };
    // Create a read stream from the Buffer
    const readStream = cloudinary.uploader.upload_stream(
      uploadOptions,
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