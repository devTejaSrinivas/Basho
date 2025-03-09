import React, { useState, useEffect, useRef } from "react";
import { AiOutlineCamera } from "react-icons/ai"; // Camera icon
import { BiUpload } from "react-icons/bi"; // Upload icon
import { FiSend } from "react-icons/fi"; // Send icon
import { MdCancel } from "react-icons/md"; // Cancel icon

const ChatPage = () => {
  const messageContainerRef = useRef(null);
  const menuRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  const [currentMessage, setCurrentMessage] = useState("");
  const [activeChat, setActiveChat] = useState(1);
  const [showMenu, setShowMenu] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [pendingMedia, setPendingMedia] = useState(null);
  const [cameraStream, setCameraStream] = useState(null);

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

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Set up video when camera becomes active
  useEffect(() => {
    if (cameraActive && videoRef.current && cameraStream) {
      videoRef.current.srcObject = cameraStream;
      videoRef.current.onloadedmetadata = () => {
        videoRef.current.play().catch((err) => {
          console.error("Error playing video:", err);
        });
      };
    }
  }, [cameraActive, cameraStream]);

  // Cleanup camera on component unmount
  useEffect(() => {
    return () => {
      stopCameraStream();
    };
  }, []);

  const activeConversation = chats.find((chat) => chat.id === activeChat);

  const handleSendMessage = (e) => {
    e.preventDefault();

    // Don't send if there's no text message and no pending media
    if (!currentMessage.trim() && !pendingMedia) return;

    // Create new message object
    const newMessage = {
      id: activeConversation.messages.length + 1,
      text: currentMessage.trim() || null,
      imageUrl: pendingMedia,
      sender: "user",
    };

    // Add message to chat
    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === activeChat
          ? { ...chat, messages: [...chat.messages, newMessage] }
          : chat
      )
    );

    // Reset states
    setCurrentMessage("");
    setPendingMedia(null);
    setCapturedImage(null);
    setUploadedImage(null);
  };

  const handleCameraAccess = async () => {
    try {
      // Stop any existing stream first
      stopCameraStream();

      console.log("Requesting camera access...");
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      });

      console.log("Camera access granted, setting up stream...");
      setCameraStream(stream);
      setCameraActive(true);
      setCapturedImage(null);
      setPendingMedia(null);

      // Safety check - directly set the stream to the video element
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        console.log("Stream attached to video element");
      }
    } catch (error) {
      console.error("Camera access error:", error);
      alert(
        `Unable to access the camera: ${
          error.message || "Please check your permissions."
        }`
      );
    }
    setShowMenu(false);
  };

  const stopCameraStream = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const handleTakePicture = () => {
    if (!canvasRef.current || !videoRef.current) {
      console.error("Canvas or video reference not available");
      return;
    }

    try {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      // Make sure the video is playing and has dimensions
      if (
        video.readyState !== 4 ||
        video.videoWidth === 0 ||
        video.videoHeight === 0
      ) {
        console.error("Video not ready or has no dimensions");
        return;
      }

      console.log(`Video dimensions: ${video.videoWidth}x${video.videoHeight}`);

      // Set canvas size to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Draw the current video frame to the canvas
      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Get the image as a data URL
      const imageUrl = canvas.toDataURL("image/png");
      console.log("Image captured successfully");

      // Set the captured image and pending media
      setCapturedImage(imageUrl);
      setPendingMedia(imageUrl);

      // Stop the camera
      stopCamera();
    } catch (error) {
      console.error("Error capturing image:", error);
    }
  };

  const stopCamera = () => {
    stopCameraStream();
    setCameraActive(false);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log("File selected:", file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target.result;
        setUploadedImage(imageUrl);
        setPendingMedia(imageUrl);
        console.log("File loaded as data URL");
      };
      reader.readAsDataURL(file);
    }
    setShowMenu(false);
  };

  const handleCancelMedia = () => {
    setPendingMedia(null);
    setCapturedImage(null);
    setUploadedImage(null);
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div
      className="chat-container bg-primary"
      style={{
        display: "flex",
        height: "100vh",
        color: "#e0e0e0",
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
                <div style={{ display: "inline-block" }}>
                  {message.text && (
                    <div
                      style={{
                        display: "inline-block",
                        padding: "0.5rem 1rem",
                        background:
                          message.sender === "user"
                            ? "rgb(0, 120, 215)"
                            : "#333",
                        color: "#fff",
                        borderRadius: "8px 8px 0 0",
                        width: "100%",
                        maxWidth: "250px",
                        marginBottom: "2px",
                      }}
                    >
                      {message.text}
                    </div>
                  )}
                  <img
                    src={message.imageUrl}
                    alt="Shared media"
                    style={{
                      maxWidth: "250px",
                      borderRadius: message.text ? "0 0 8px 8px" : "8px",
                      display: "block",
                    }}
                  />
                </div>
              ) : (
                <div
                  style={{
                    display: "inline-block",
                    padding: "0.5rem 1rem",
                    background:
                      message.sender === "user" ? "rgb(0, 120, 215)" : "#333",
                    color: "#fff",
                    borderRadius: "8px",
                    maxWidth: "70%",
                    wordBreak: "break-word",
                  }}
                >
                  {message.text}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Media Preview Area */}
        {pendingMedia && (
          <div
            style={{
              padding: "0.5rem",
              background: "rgb(30, 30, 30)",
              borderTop: "1px solid #444",
              display: "flex",
              alignItems: "center",
            }}
          >
            <div style={{ flex: 1, position: "relative" }}>
              <img
                src={pendingMedia}
                alt="Preview"
                style={{
                  maxHeight: "150px",
                  borderRadius: "4px",
                }}
              />
              <button
                onClick={handleCancelMedia}
                style={{
                  position: "absolute",
                  top: "5px",
                  right: "5px",
                  background: "rgba(0,0,0,0.6)",
                  border: "none",
                  borderRadius: "50%",
                  width: "24px",
                  height: "24px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                <MdCancel color="#fff" size={18} />
              </button>
            </div>
          </div>
        )}

        {/* Camera Display */}
        {cameraActive && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "1rem",
              background: "rgb(20, 20, 20)",
              borderTop: "1px solid #444",
            }}
          >
            <div
              style={{
                width: "100%",
                maxWidth: "400px",
                position: "relative",
                background: "#000",
                borderRadius: "8px",
                overflow: "hidden",
                marginBottom: "1rem",
              }}
            >
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                style={{
                  width: "100%",
                  display: "block",
                }}
              ></video>
            </div>

            <canvas
              ref={canvasRef}
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
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Chat Input */}
        <form
          onSubmit={handleSendMessage}
          style={{
            display: "flex",
            padding: "1rem",
            borderTop:
              !pendingMedia && !cameraActive ? "1px solid #444" : "none",
            background: "rgb(20, 20, 20)",
            position: "relative",
          }}
        >
          <input
            type="text"
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            placeholder={
              pendingMedia ? "Add a caption..." : "Type your message..."
            }
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

          {/* Hidden file input */}
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleFileUpload}
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
                  bottom: "100%",
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
                <button
                  type="button"
                  onClick={triggerFileInput}
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
                </button>
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
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <FiSend size={16} />
            {pendingMedia ? "Send" : "Send"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatPage;
