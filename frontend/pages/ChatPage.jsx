import React, { useState, useEffect, useRef } from "react";
import { AiOutlineCamera } from "react-icons/ai"; // Camera icon
import { BiUpload } from "react-icons/bi"; // Upload icon

const ChatPage = () => {
  const messageContainerRef = useRef(null);
  const menuRef = useRef(null); // Reference for the menu
  const videoRef = useRef(null); // Reference for the video element
  const canvasRef = useRef(null); // Reference for the canvas element
  const [currentMessage, setCurrentMessage] = useState("");
  const [activeChat, setActiveChat] = useState(1);
  const [showMenu, setShowMenu] = useState(false);
  const [cameraActive, setCameraActive] = useState(false); // To track camera state
  const [capturedImage, setCapturedImage] = useState(null); // To store the captured image data
  const [chats, setChats] = useState([
    {
      id: 1,
      name: "Basho",
      messages: [
        {
          id: 1,
          text: "Welcome to the chat!",
          sender: "system",
        },
      ],
    },
  ]);

  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    }
  }, [chats]);

  const activeConversation = chats.find((chat) => chat.id === activeChat);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!currentMessage.trim()) return;

    const newMessage = {
      id: activeConversation.messages.length + 1,
      text: currentMessage,
      sender: "user",
    };

    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === activeChat
          ? { ...chat, messages: [...chat.messages, newMessage] }
          : chat
      )
    );
    setCurrentMessage("");
  };

  const handleCameraAccess = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraActive(true);
      setCapturedImage(null); // Clear captured image when accessing the camera again
    } catch (error) {
      alert("Unable to access the camera. Please check your permissions.");
    }
    setShowMenu(false);
  };

  const handleTakePicture = () => {
    if (canvasRef.current && videoRef.current) {
      const context = canvasRef.current.getContext("2d");
      context.drawImage(
        videoRef.current,
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );
      const imageUrl = canvasRef.current.toDataURL("image/png");
      setCapturedImage(imageUrl); // Save the captured image to state
      const newMessage = {
        id: activeConversation.messages.length + 1,
        text: null,
        imageUrl: imageUrl,
        sender: "user",
      };
      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat.id === activeChat
            ? { ...chat, messages: [...chat.messages, newMessage] }
            : chat
        )
      );
      stopCamera(); // Stop the camera after capturing the image
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const newMessage = {
          id: activeConversation.messages.length + 1,
          text: null,
          imageUrl: event.target.result,
          sender: "user",
        };
        setChats((prevChats) =>
          prevChats.map((chat) =>
            chat.id === activeChat
              ? { ...chat, messages: [...chat.messages, newMessage] }
              : chat
          )
        );
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div
      className="chat-container bg-primary"
      style={{
        display: "flex",
        height: "100vh",
        color: "#e0e0e0", // Complementary font color for dark background
      }}
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
          <h3>{activeConversation.name}</h3>
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
          }}
        >
          {activeConversation.messages.map((message) => (
            <div
              key={message.id}
              style={{
                textAlign: message.sender === "user" ? "right" : "left",
                marginBottom: "0.5rem",
              }}
            >
              {message.imageUrl ? (
                <img
                  src={message.imageUrl}
                  alt="Uploaded"
                  style={{
                    maxWidth: "150px",
                    borderRadius: "8px",
                  }}
                />
              ) : (
                <div
                  style={{
                    display: "inline-block",
                    padding: "0.5rem 1rem",
                    background:
                      message.sender === "user" ? "rgb(0, 120, 215)" : "#333",
                    color: "#fff",
                    borderRadius: "8px",
                  }}
                >
                  {message.text}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Chat Input */}
        <form
          onSubmit={handleSendMessage}
          style={{
            display: "flex",
            padding: "1rem",
            borderTop: "1px solid #444",
            background: "rgb(20, 20, 20)",
            position: "relative",
            color: "#fff",
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

          {/* Camera and Upload Menu */}
          <div style={{ position: "relative" }}>
            <button
              type="button"
              onClick={() => setShowMenu((prev) => !prev)}
              style={{
                padding: "0.5rem",
                background: "transparent",
                border: "none",
                borderRadius: "50%",
                marginRight: "0.5rem",
                cursor: "pointer",
              }}
            >
              <AiOutlineCamera size={24} color="#007bff" />
            </button>

            {/* Camera Menu */}
            {showMenu && (
              <div
                ref={menuRef}
                style={{
                  position: "absolute",
                  top: "-6rem",
                  left: "-3rem",
                  background: "#222",
                  border: "1px solid #555",
                  borderRadius: "4px",
                  boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
                  zIndex: 10,
                  padding: "0.5rem",
                  color: "#e0e0e0",
                }}
              >
                <button
                  type="button"
                  onClick={handleCameraAccess}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "0.5rem 0",
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                    width: "100%",
                    textAlign: "left",
                    color: "#fff",
                  }}
                >
                  <AiOutlineCamera
                    size={24}
                    style={{ marginRight: "0.5rem", color: "#007bff" }}
                  />
                  Open Camera
                </button>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "0.5rem 0",
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                    width: "100%",
                    textAlign: "left",
                    color: "#fff",
                  }}
                >
                  <BiUpload
                    size={24}
                    style={{ marginRight: "0.5rem", color: "#007bff" }}
                  />
                  Upload Image
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleFileUpload}
                  />
                </label>
              </div>
            )}
          </div>

          <button
            type="submit"
            style={{
              padding: "0.5rem 1rem",
              background: "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Send
          </button>
        </form>

        {/* Camera Display */}
        {cameraActive && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "1rem",
              background: "rgb(20, 20, 20)",
              color: "#fff",
            }}
          >
            <video
              ref={videoRef}
              autoPlay
              playsInline
              style={{
                width: "100%",
                maxWidth: "400px",
                borderRadius: "8px",
                marginBottom: "1rem",
              }}
            ></video>
            <canvas
              ref={canvasRef}
              width={400}
              height={300}
              style={{
                display: "none", // Used for capturing the picture
              }}
            ></canvas>
            <div style={{ display: "flex", gap: "1rem" }}>
              <button
                onClick={handleTakePicture}
                style={{
                  padding: "0.5rem 1rem",
                  background: "#007bff",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Capture Picture
              </button>
              <button
                onClick={stopCamera}
                style={{
                  padding: "0.5rem 1rem",
                  background: "#dc3545",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Stop Camera
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
