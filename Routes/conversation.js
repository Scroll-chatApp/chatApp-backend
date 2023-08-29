import express from "express";
import {
  getAllConversationOfUser,
  getConversationsByUserId,
  newConversation,
} from "../Controller/conversation.js";
const router = express.Router();

router.post("/newconversation", newConversation);
router.get("/getconversationsbyuserid", getConversationsByUserId);
router.get("/getallconversationofuser", getAllConversationOfUser);

export default router;
