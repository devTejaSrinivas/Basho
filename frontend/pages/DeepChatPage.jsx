import React, { useState, useEffect, useRef } from "react";
import { FiSend } from "react-icons/fi";
import LocationsList from "../src/components/LocationsList";
import { useLocationContext } from "../src/components/ContextProvider";
import axios from "axios"; // Make sure to install axios

const DeepChatPage = () => {
  const messageContainerRef = useRef(null);
  const [currentMessage, setCurrentMessage] = useState("");
  const [activeChat, setActiveChat] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const { context } = useLocationContext(); // Get location context data

  console.log(context);

  // Load chats from localStorage
  const [chats, setChats] = useState(() => {
    const savedChats = localStorage.getItem("chats");
    return savedChats
      ? JSON.parse(savedChats)
      : [
          {
            id: 1,
            name: "Basho",
            messages: [],
          },
        ];
  });

  const activeConversation = chats.find((chat) => chat.id === activeChat) || {
    id: activeChat,
    name: "New Chat",
    messages: [],
  };

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    }
  }, [chats]);

  useEffect(() => {
    if (
      activeConversation &&
      activeConversation.messages.length === 0 &&
      context &&
      Object.keys(context).length > 0 &&
      !isLoading
    ) {
      getInitialAIResponse();
    }
  }, [activeChat, context, chats]);

  const getInitialAIResponse = async () => {
    setIsLoading(true);

    try {
      // For initial response, we don't send any messages
      const response = await axios.post(
        "https://basho-xscr.onrender.com/api/chat",
        {
          messages: [],
          locationContext: context,
        }
      );

      if (response.data.success) {
        // Add AI response to chats
        const updatedChats = chats.map((chat) =>
          chat.id === activeChat
            ? {
                ...chat,
                messages: [
                  {
                    id: 1,
                    text: response.data.response,
                    sender: "system",
                  },
                ],
              }
            : chat
        );

        setChats(updatedChats);
        localStorage.setItem("chats", JSON.stringify(updatedChats));
      }
    } catch (error) {
      console.error("Error getting initial AI response:", error);
      // Add a friendly error message to the chat
      const updatedChats = chats.map((chat) =>
        chat.id === activeChat
          ? {
              ...chat,
              messages: [
                {
                  id: 1,
                  text: "I'm having trouble connecting to the AI service. Please try again later.",
                  sender: "system",
                },
              ],
            }
          : chat
      );

      setChats(updatedChats);
      localStorage.setItem("chats", JSON.stringify(updatedChats));
    }

    setIsLoading(false);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!currentMessage.trim() || isLoading) return;

    const messageText = currentMessage.trim();
    setCurrentMessage("");

    // Add user message to chats
    const updatedChats = chats.map((chat) =>
      chat.id === activeChat
        ? {
            ...chat,
            messages: [
              ...chat.messages,
              {
                id: chat.messages.length + 1,
                text: messageText,
                sender: "user",
              },
            ],
          }
        : chat
    );

    setChats(updatedChats);
    localStorage.setItem("chats", JSON.stringify(updatedChats));

    setIsLoading(true);

    try {
      // Get updated active conversation after adding user message
      const updatedActiveConversation = updatedChats.find(
        (chat) => chat.id === activeChat
      );

      // Call the backend endpoint with full message history and location context
      const response = await axios.post(
        "https://basho-xscr.onrender.com/user/deepchat",
        {
          messages: updatedActiveConversation.messages,
          locationContext: context,
        }
      );

      if (response.data.success) {
        // Add AI response to chats
        const updatedChatsWithResponse = chats.map((chat) =>
          chat.id === activeChat
            ? {
                ...chat,
                messages: [
                  ...chat.messages,
                  {
                    id: chat.messages.length + 2,
                    text: response.data.response,
                    sender: "system",
                  },
                ],
              }
            : chat
        );

        setChats(updatedChatsWithResponse);
        localStorage.setItem("chats", JSON.stringify(updatedChatsWithResponse));
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }

    setIsLoading(false);
  };

  return (
    <div
      className="chat-container bg-primary"
      style={{ display: "flex", height: "100vh", color: "#e0e0e0" }}
    >
      {/* Sidebar */}
      <div
        className="sidebar"
        style={{
          width: "25%",
          background: "rgb(15, 15, 15)",
          borderRight: "1px solid #444",
          padding: "1rem",
          color: "#fff",
        }}
      >
        {chats.map((chat) => (
          <div
            key={chat.id}
            onClick={() => setActiveChat(chat.id)}
            style={{
              padding: "0.5rem",
              marginBottom: "0.5rem",
              cursor: "pointer",
              background: activeChat === chat.id ? "#333" : "transparent",
              borderRadius: "4px",
              color: activeChat === chat.id ? "#fff" : "#ccc",
            }}
          >
            {chat.name}
          </div>
        ))}
        <LocationsList></LocationsList>
      </div>

      {/* Chat Content */}
      <div
        className="chat-content"
        style={{ flex: 1, display: "flex", flexDirection: "column" }}
      >
        {/* Chat Header */}
        <div
          className="chat-header"
          style={{
            padding: "1rem",
            borderBottom: "1px solid #444",
            background: "rgb(20, 20, 20)",
            color: "#fff",
          }}
        >
          <h3>{activeConversation?.name}</h3>
        </div>

        {/* Chat Messages */}
        <div
          ref={messageContainerRef}
          className="chat-messages"
          style={{
            flex: 1,
            padding: "1rem",
            overflowY: "auto",
            background: "rgb(10, 10, 10)",
            color: "#e0e0e0",
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
          }}
        >
          {activeConversation?.messages.map((message) => (
            <div
              key={message.id}
              style={{
                alignSelf:
                  message.sender === "user" ? "flex-end" : "flex-start",
                maxWidth: "70%",
                padding: "0.75rem",
                borderRadius: "12px",
                background: message.sender === "user" ? "#007bff" : "#333",
                color: "#fff",
              }}
            >
              {message.text}
            </div>
          ))}
          {isLoading && (
            <div
              style={{
                alignSelf: "flex-start",
                padding: "0.75rem",
                borderRadius: "12px",
                background: "#333",
                color: "#fff",
              }}
            >
              <div
                style={{
                  display: "inline-block",
                  width: "20px",
                  height: "20px",
                  border: "3px solid rgba(255,255,255,0.3)",
                  borderRadius: "50%",
                  borderTopColor: "#fff",
                  animation: "spin 1s linear infinite",
                }}
              ></div>
            </div>
          )}
        </div>

        {/* Chat Input */}
        <form
          onSubmit={handleSendMessage}
          style={{
            display: "flex",
            padding: "1rem",
            borderTop: "1px solid #444",
            background: "rgb(20, 20, 20)",
          }}
        >
          <input
            type="text"
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            placeholder="Type your message..."
            style={{
              flex: 1,
              padding: "0.5rem",
              border: "1px solid #555",
              borderRadius: "4px",
              marginRight: "0.5rem",
              background: "#222",
              color: "#e0e0e0",
            }}
          />
          <button
            type="submit"
            disabled={isLoading}
            style={{
              padding: "0.5rem 1rem",
              background: isLoading ? "#555" : "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: isLoading ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            {isLoading ? (
              <span
                style={{
                  display: "inline-block",
                  width: "16px",
                  height: "16px",
                  borderRadius: "50%",
                  border: "2px solid #fff",
                  borderTopColor: "transparent",
                  animation: "spin 1s linear infinite",
                }}
              />
            ) : (
              <FiSend size={16} />
            )}
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default DeepChatPage;
