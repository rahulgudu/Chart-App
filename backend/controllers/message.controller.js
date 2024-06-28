import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";

export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let conversation = await Conversation.findOne({
      participants: {
        $all: [senderId, receiverId],
      },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }

    const newMessage = await Message.create({
      senderId,
      receiverId,
      message,
    });

    if (newMessage) {
      conversation.messages.push(newMessage._id);
    }

    await conversation.save(); // because we have updated the collection

    return res.status(200).json(newMessage);
  } catch (error) {
    console.log("Error in sending messages", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const senderId = req.user._id;

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, userToChatId] },
    }).populate("messages");

    // If no existing conversation, create a new one
    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, userToChatId],
        messages: [],
      });
    }

    // Return an empty array if no messages exist
    const messages = conversation.messages || [];

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in sending messages", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

