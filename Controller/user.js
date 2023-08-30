import userModel from "../Model/user.js";

export const createNewUser = async (user_name, user_socket_id) => {
  const newUser = new userModel({ user_name, user_socket_id });
  try {
    await newUser.save();
  } catch (error) {
    console.log({ error: "An error occurred while creating the new user" });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find(); // Retrieve all users from the database
    res.status(200).json(users); // Send the array of users as the response
  } catch (error) {
    res.status(500).json({ error: "An error occurred while retrieving users" }); // Send error response
  }
};

export const updateSocketId = async (user_name, new_socket_id) => {
  try {
    const user = await userModel.findOne({ user_name });
    if (!user) {
      createNewUser(user_name, new_socket_id);
    } else {
      user.user_socket_id = new_socket_id;
      await user.save();
    }
  } catch (error) {
    console.log({ error: "An error occurred while updating the socket id" });
  }
};
