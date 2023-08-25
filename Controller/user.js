import userModel from "../Model/user.js";

export const newUser = async (req, res) => {
  const { user_name, user_socket_id } = req.body;

  const newUser = new userModel({ user_name, user_socket_id });

  try {
    await newUser.save();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
};
