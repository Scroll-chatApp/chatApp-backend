import express from "express";
import { getMessage, newMessage } from "../Controller/message.js";
const router = express.Router();

router.post("/newmessage", newMessage);
router.get("/getmessage/:conversation_id", getMessage);

export default router;
