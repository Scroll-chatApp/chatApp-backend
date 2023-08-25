import mongoose from "mongoose";

const messageSchema = mongoose.Schema(
  {
    message_data: {
      type: String,
    },
    message_type: {
      type: String,
    },
    Conversation_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

var messageModel = mongoose.model("message", messageSchema);
export default messageModel;
