import messageModel from "../Model/message.js";

export const newMessage = async (req, res) => {
  const { message_data, message_type, sender_id, conversation_id } = req.body;
  const newMessage = new messageModel({
    message_data,
    message_type,
    sender_id,
    conversation_id,
  });
  try {
    const result = await newMessage.save();
    res.status(200).json({ message: "message created successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while creating the message" });
  }
};

export const getMessage = async (req, res) => {
  const { conversation_id } = req.params;
  try {
    const result = await messageModel.find({ conversation_id });
    res.status(200).json(result);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching messages" });
  }
};
