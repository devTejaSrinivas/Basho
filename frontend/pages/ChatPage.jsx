import { useState } from "react";
import { FaCamera } from "react-icons/fa";
import styles from "../src/style";

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, { text: input, type: "text" }]);
      setInput("");
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setMessages([...messages, { text: reader.result, type: "image" }]);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-primary min-h-screen flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-gray-900 p-6 rounded-lg shadow-lg flex flex-col">
        <div className="flex-1 overflow-y-auto h-96 p-4 space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg max-w-xs ${
                msg.type === "text" ? "bg-gray-800 text-white" : ""
              }`}
            >
              {msg.type === "image" ? (
                <img
                  src={msg.text}
                  alt="Uploaded"
                  className="w-40 h-40 rounded-lg"
                />
              ) : (
                msg.text
              )}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 mt-4">
          <label htmlFor="imageUpload" className="cursor-pointer text-white">
            <FaCamera size={24} />
          </label>
          <input
            type="file"
            id="imageUpload"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
          <input
            type="text"
            className="flex-1 p-2 rounded-lg bg-gray-800 text-white"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
          />
          <button
            className="bg-blue-600 px-4 py-2 rounded-lg text-white"
            onClick={handleSend}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
