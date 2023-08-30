import mongoose from "mongoose";

const conversationSchema = mongoose.Schema(
  {
    members: {
      type: Array,
    },
  },
  {
    timestamps: true,
  }
);

const conversationModel = mongoose.model("conversation", conversationSchema);
export default conversationModel;
