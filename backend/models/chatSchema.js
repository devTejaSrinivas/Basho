const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  images: [{ type: String }], // URLs of stored images in MongoDB
  chats: [
    {
      sender: { type: String, enum: ["bot", "user"], required: true },
      message: { type: String, required: true },
      timestamp: { type: Date, default: Date.now },
    },
  ],
});

module.exports = mongoose.model("Chat", chatSchema);
