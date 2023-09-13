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
      origin: "*:*",
      methods: ["GET", "POST"],
      allowedHeaders: ["Content-Type"],
      credentials: true
    },
  });

  const handleUserJoined = async ({ user, socket }) => {
    users[user] = socket.id;
  
    // Update user socket id and get the updated user data
    const updatedUserData = await updateSocketId(user, socket.id);
  
    // Emit the updated user data back to the frontend
    socket.emit("userUpdated", { user: updatedUserData });
  };

  io.on("connection", (socket) => {
    socket.on("userJoined", ({ user }) => {
      users[user] = socket.id;
      handleUserJoined({ user, socket });
    });

    socket.on(
      "sendMessage",
      async ({
        messageToBeSend,
        type,
        senderId,
        conversationId,
        receiverName,
      }) => {
        try {
          const incomingMessage = await newMessage(messageToBeSend, type, senderId, conversationId);
          // Emit the message to receiver and sender
          socket.emit("senderMessage", incomingMessage);
          socket.to(users[receiverName]).emit("receiverMessage", incomingMessage);
        } catch (error) {
          console.error("Error handling text message:", error);
        }
      }
    );

    socket.on(
      "sendFile",
      async ({ messageToBeSend, type, senderId, conversationId, receiverName }) => {
        if (type === "pic") {
          try {
            const uploadResult = await uploadFile(messageToBeSend);
            const fileUrl = uploadResult.secure_url;

            const incomingMessage = await newMessage(fileUrl, "pic", senderId, conversationId);
            // Emit the message to receiver and sender
            socket.to(users[receiverName]).emit("receiverMessage", incomingMessage);
            socket.emit("senderMessage", incomingMessage);
          } catch (error) {
            console.error("Error handling file upload:", error);
          }
        } else {
          try {
            const uploadResult = await uploadFile(messageToBeSend, "pdf");
            const fileUrl = uploadResult.url;

            const incomingMessage = await newMessage(fileUrl, "pdf", senderId, conversationId);
            // Emit the message to receiver and sender
            socket.to(users[receiverName]).emit("receiverMessage", incomingMessage);
            socket.emit("senderMessage", incomingMessage);
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
      resource_type: fileType === "pdf" ? "raw" : "auto",
      public_id: fileType === "pdf" ? "chatApp.pdf" : "chatApp", // Set a meaningful public ID for your PDF
    };

    // Create a read stream from the Buffer
    const readStream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result); // Resolve with the URL of the uploaded PDF
        }
      }
    );

    // Pipe the Buffer to the Cloudinary upload stream
    readStream.end(bufferToUpload);

  });
}