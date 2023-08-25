import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import user from "./Routes/user.js";

import { createServer } from "http";
import * as socketIo from "socket.io";

// dot evn package
dotenv.config();

const app = express();

app.use(cors());

app.get("/", (req, res) => {
  res.send("Thanks God its working");
});

app.use("/newuser", user);

// database connection
mongoose
  .connect(process.env.MONGO_DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() =>
    app.listen(process.env.PORT, () =>
      console.log(`Database listening at ${process.env.PORT}`)
    )
  )
  .catch((error) => console.log(error));

const port = 4500 || process.env.PORT;
const server = createServer(app);

const io = new socketIo.Server(server);

server.listen(port, () => {
  console.log(`Server is working on http://localhost:${port}`);
});
