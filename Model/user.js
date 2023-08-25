import mongoose from "mongoose";
const userSchema = mongoose.Schema(
  {
    user_name: {
      type: String,
      unique: true,
    },
    user_socket_id: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

var userModel = mongoose.model("user", userSchema);
export default userModel;
