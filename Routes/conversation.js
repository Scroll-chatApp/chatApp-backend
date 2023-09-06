import express from "express";
import {
  getAllConversationOfUser,
  getConversationsByUserId,
  newConversation,
} from "../Controller/conversation.js";
const router = express.Router();

router.post("/newconversation/:sender_id/:receiver_id", newConversation);
router.get("/getconversationsbyuserid", getConversationsByUserId);
router.get(
  "/getallconversationofuser/:sender_id/:receiver_id",
  getAllConversationOfUser
);

export default router;
