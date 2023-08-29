import mongoose from "mongoose";
const userSchema = mongoose.Schema(
  {
    user_name: {
      type: String,
    },
    user_socket_id: {
      type: String,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

var userModel = mongoose.model("user", userSchema);
export default userModel;
