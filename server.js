import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./Routes/user.js";
import conversationRouter from "./Routes/conversation.js";
import messageRouter from "./Routes/message.js";
import { createServer } from "http";
import socketio from "./socket.js";

// dot evn package
dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());
app.use(userRouter);
app.use(conversationRouter);
app.use(messageRouter);

app.get("/", (req, res) => {
  res.send("Thanks God its working");
});

const port = 4500;
const server = createServer(app);
socketio(server);

// database connection
mongoose
  .connect(process.env.MONGO_DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() =>
    server.listen(port, () => console.log(`Server listening at ${port}`))
  )
  .catch((error) => console.log("database ", error));
