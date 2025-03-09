const express = require("express");
const Chat = require("../models/chatSchema");
const chatRouter = express.Router();

// ✅ Create a new chat entry
chatRouter.post("/create", async (req, res) => {
  try {
    const { id, images, chats } = req.body;
    const chat = new Chat({ id, images, chats });
    await chat.save();
    res.status(201).json({ message: "Chat stored successfully", chat });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = chatRouter;
