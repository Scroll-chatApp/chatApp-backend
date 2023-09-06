import conversationModel from "../Model/conversation.js";

export const newConversation = async (req, res) => {
  const { sender_id, receiver_id } = req.params;
  const newConversation = new conversationModel({
    members: [sender_id, receiver_id],
  });
  try {
    const result = await newConversation.save();
    res.status(200).json({ message: "Conversation created successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while creating new the conversation" });
  }
};

export const getConversationsByUserId = async (req, res) => {
  const { sender_id } = req.body;
  try {
    // Find conversations where the user is the sender_id
    const result = await conversationModel.find({
      members: { $in: sender_id },
    });

    res.status(200).json(result);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching conversations" });
  }
};

export const getAllConversationOfUser = async (req, res) => {
  const { sender_id, receiver_id } = req.params;

  try {
    const result = await conversationModel.findOne({
      members: { $all: [sender_id, receiver_id] },
    });

    if (result) {
      res.status(200).json(result); // Conversation found
    } else {
      res.status(404).json({ message: "Conversation not found" }); // Conversation not found
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while finding the conversation" });
  }
};
