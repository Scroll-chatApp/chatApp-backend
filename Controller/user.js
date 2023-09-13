import userModel from "../Model/user.js";

export const createNewUser = async (user_name, user_socket_id) => {
  const newUser = new userModel({ user_name, user_socket_id });
  try {
    const result = await newUser.save();
    // Access the user data from the result
    const userData = result.toJSON(); // Convert to JSON to get all user fields
    return userData;
  } catch (error) {
    console.log({ error: "An error occurred while creating the new user" });
    return null; // Return null to indicate an error
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
    let user = await userModel.findOne({ user_name });

    if (!user) {
      // If user doesn't exist, create a new user and return user data
      const userData = await createNewUser(user_name, new_socket_id);
      return userData;
    } else {
      // Update the user's socket ID
      user.user_socket_id = new_socket_id;
      await user.save();
      const updatedUserData = user.toJSON();
      return updatedUserData;
    }
  } catch (error) {
    console.log({ error: "An error occurred while updating the socket id" });
    return null;
  }
};
