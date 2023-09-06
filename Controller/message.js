import messageModel from "../Model/message.js";

  export const newMessage = async (
    message_data,
    message_type,
    sender_id,
    conversation_id
  ) => {
    const newMessage = new messageModel({
      message_data,
      message_type,
      sender_id,
      conversation_id,
    });
    try {
      await newMessage.save();
    } catch (error) {
      console.log({ error: "An error occurred while creating the message" });
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
