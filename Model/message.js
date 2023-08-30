import mongoose from "mongoose";

const messageSchema = mongoose.Schema(
  {
    message_data: {
      type: String,
    },
    message_type: {
      type: String,
    },
    sender_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user", // Reference the user model
      required: true,
    },
    conversation_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "conversation", // Reference the conversation model
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

var messageModel = mongoose.model("message", messageSchema);
export default messageModel;
