import React, { useState, useEffect, useRef } from "react";
import { AiOutlineCamera } from "react-icons/ai"; // Camera icon
import { BiUpload } from "react-icons/bi"; // Upload icon
import { FiSend } from "react-icons/fi"; // Send icon
import { MdCancel } from "react-icons/md"; // Cancel icon
import ReactMarkdown from "react-markdown";
import { useNavigate } from "react-router-dom";
import AnimatedButton from "../src/components/AnimatedButton";
import LanguageSelector from "../src/components/LanguageSelector";

const ChatPage = () => {
  const messageContainerRef = useRef(null);
  const menuRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const [currentMessage, setCurrentMessage] = useState("");
  const [activeChat, setActiveChat] = useState(1);
  const [showMenu, setShowMenu] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [capturedImages, setCapturedImages] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [pendingMedia, setPendingMedia] = useState([]);
  const [cameraStream, setCameraStream] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState("en");

  const translations = {
    en: "Hello, how are you?",
    hi: "नमस्ते, आप कैसे हैं?",
    mr: "नमस्कार, तुम्ही कसे आहात?",
    te: "హలో, మీరు ఎలా ఉన్నారు?",
    bn: "হ্যালো, আপনি কেমন আছেন?",
    kn: "ಹಲೋ, ನೀವು ಹೇಗಿದ್ದೀರಾ?",
    gu: "હેલો, તમે કેમ છો?",
    pa: "ਹੈਲੋ, ਤੁਸੀਂ ਕਿਵੇਂ ਹੋ?",
  };

  const [chats, setChats] = useState([
    {
      id: 1,
      name: "Basho",
      messages: [
        {
          id: 1,
          text: "Hello! I’m Basho, your AI travel companion. 🌍📸 Share a landmark image with me, and I’ll uncover its story—historical significance, architectural details, and fascinating facts. Whether you're exploring a new place or just curious, I’m here to bring landmarks to life in the language that suits you best. Let’s dive into history together! 🏛️✨",
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

  const sendToGemini = async (pretext, images) => {
    setIsLoading(true);
    try {
      // Create FormData to send to the endpoint
      const formData = new FormData();

      // Add the text prompt
      const text = `GIVEN IMAGES ARE LANDMARK RETURN THE DESCRIPTION, HISTORICAL_SIGNIFICANCE, CONSTRUCTION_TIMELINE, ARCHITECTURAL_FEATURES, INTERESTING_FACTS, MODERN_OUTLOOK AND ADDITTIONAL INQUIERY ${pretext}. ANSWER IN THE LANGUAGE ${language}`;

      formData.append("prompt", text);

      // Add all images
      images.forEach((image, index) => {
        // 1. Extract the Base64 string (removes "data:image/png;base64," part)
        const byteString = atob(image.split(",")[1]);
        // 2. Extract the MIME type (e.g., "image/png")
        const mimeString = image.split(",")[0].split(":")[1].split(";")[0];
        // 3. Convert the Base64 string to a binary format
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);

        for (let i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }
        // 4. Create a Blob from the binary data
        const blob = new Blob([ab], { type: mimeString });
        // 5. Append Blob to FormData (for uploading)
        formData.append("images", blob, `image${index}.png`);
      });

      // Retrieve existing images array from localStorage (if any)
      const storedImages = JSON.parse(localStorage.getItem("images")) || [];

      // Add the first image to the array
      storedImages.push(firstImage);

      // Save updated array back to localStorage
      localStorage.setItem("images", JSON.stringify(storedImages));

      // Send the request
      const response = await fetch(
        "http://localhost:5000/user/testchat/genLocation",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      const result = await response.json();

      // Add Gemini's response to the chat
      const aiMessage = {
        id: activeConversation.messages.length + 2,
        text: result.response,
        sender: "system",
      };

      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat.id === activeChat
            ? { ...chat, messages: [...chat.messages, aiMessage] }
            : chat
        )
      );
    } catch (error) {
      console.error("Error sending to Gemini:", error);

      // Add error message to chat
      const errorMessage = {
        id: activeConversation.messages.length + 2,
        text: `Please add at least one image to send a message. Error: ${error.message}`,
        sender: "system",
      };

      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat.id === activeChat
            ? { ...chat, messages: [...chat.messages, errorMessage] }
            : chat
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    // Don't send if there's no text message and no pending media
    if (!currentMessage.trim() && pendingMedia.length === 0) return;

    // Create new message object
    const newMessage = {
      id: activeConversation.messages.length + 1,
      text: currentMessage.trim() || null,
      imageUrls: pendingMedia.length > 0 ? [...pendingMedia] : null,
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

    // Send to Gemini if there's content to send
    if (currentMessage.trim() || pendingMedia.length > 0) {
      await sendToGemini(currentMessage.trim(), pendingMedia);
    }

    // Reset states
    setCurrentMessage("");
    setPendingMedia([]);
    setCapturedImages([]);
    setUploadedImages([]);
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

      // Add to captured images (only if we have less than 5)
      if (capturedImages.length + uploadedImages.length < 5) {
        setCapturedImages((prevImages) => [...prevImages, imageUrl]);
        setPendingMedia((prevMedia) => [...prevMedia, imageUrl]);
      } else {
        alert("Maximum of 5 images allowed");
      }

      // Don't stop the camera to allow multiple captures
    } catch (error) {
      console.error("Error capturing image:", error);
    }
  };

  const stopCamera = () => {
    stopCameraStream();
    setCameraActive(false);
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);

    // Check if adding these files would exceed the limit
    if (files.length + capturedImages.length + uploadedImages.length > 5) {
      alert(
        `You can only add up to 5 images in total. You already have ${
          capturedImages.length + uploadedImages.length
        } images.`
      );
      return;
    }

    // Process each file
    files.forEach((file) => {
      if (file) {
        console.log("File selected:", file.name);
        const reader = new FileReader();
        reader.onload = (event) => {
          const imageUrl = event.target.result;
          setUploadedImages((prevImages) => [...prevImages, imageUrl]);
          setPendingMedia((prevMedia) => [...prevMedia, imageUrl]);
          console.log("File loaded as data URL");
        };
        reader.readAsDataURL(file);
      }
    });

    setShowMenu(false);
  };

  const handleCancelMedia = () => {
    setPendingMedia([]);
    setCapturedImages([]);
    setUploadedImages([]);
  };

  const removeImage = (index) => {
    setPendingMedia((prevMedia) => prevMedia.filter((_, i) => i !== index));

    // Also update the source arrays to keep track
    if (index < capturedImages.length) {
      setCapturedImages((prevImages) =>
        prevImages.filter((_, i) => i !== index)
      );
    } else {
      const adjustedIndex = index - capturedImages.length;
      setUploadedImages((prevImages) =>
        prevImages.filter((_, i) => i !== adjustedIndex)
      );
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // JSX rendering would need to be updated to display multiple images
  // and have controls to remove individual images

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

        <div
          style={{
            textAlign: "center",
            padding: "20px",
            background: "linear-gradient(135deg, #333, #555)",
            border: "2px solid #ccc",
            borderRadius: "8px",
            width: "90%",
            maxWidth: "350px",
            margin: "20px auto",
            color: "#fff",
            fontFamily: "Arial, sans-serif",
            boxShadow: "0 3px 6px rgba(0,0,0,0.2)",
          }}
        >
          <h1
            style={{
              marginBottom: "15px",
              fontSize: "24px",
              letterSpacing: "0.5px",
            }}
          >
            Choose Language
          </h1>

          <select
            onChange={(e) => setLanguage(e.target.value)}
            value={language}
            style={{
              padding: "10px",
              fontSize: "14px",
              borderRadius: "5px",
              border: "1px solid #ccc",
              background: "#222",
              cursor: "pointer",
              outline: "none",
              marginBottom: "15px",
              color: "#fff",
              appearance: "none",
              backgroundImage:
                "url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2210%22 height=%2210%22 viewBox=%220 0 10 10%22%3E%3Cpolygon points=%225,7 0,2 10,2%22 fill=%22%23fff%22/%3E%3C/svg%3E')",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 10px center",
              backgroundSize: "10px 10px",
            }}
          >
            <option value="en">English</option>
            <option value="hi">Hindi (हिन्दी)</option>
            <option value="mr">Marathi (मराठी)</option>
            <option value="te">Telugu (తెలుగు)</option>
            <option value="bn">Bengali (বাংলা)</option>
            <option value="kn">Kannada (ಕನ್ನಡ)</option>
            <option value="gu">Gujarati (ગુજરાતી)</option>
            <option value="pa">Punjabi (ਪੰਜਾਬੀ)</option>
          </select>

          <p
            style={{
              marginTop: "10px",
              fontWeight: "bold",
              fontSize: "18px",
            }}
          >
            {translations[language]}
          </p>
        </div>

        <AnimatedButton />
        <button
          style={{
            fontSize: "25px",
            width: "100%",
            padding: "15px 30px",
            background: "linear-gradient(45deg, #6c757d, #495057)",
            color: "white",
            border: "none",
            borderRadius: "10px",
            cursor: "pointer",
            outline: "none",
            display: "block",
            margin: "20px auto",
            boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
            transition: "transform 0.2s, box-shadow 0.2s",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = "scale(1.03)";
            e.currentTarget.style.boxShadow = "0 6px 12px rgba(0,0,0,0.3)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.2)";
          }}
          onClick={() => {
            navigate("/");
          }}
        >
          <b>Back</b>
        </button>
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
                marginBottom: "1rem",
              }}
            >
              {/* Message with multiple images */}
              {message.imageUrls && message.imageUrls.length > 0 ? (
                <div
                  style={{
                    display: "inline-block",
                    maxWidth: "70%",
                    background:
                      message.sender === "user" ? "rgb(0, 120, 215)" : "#333",
                    borderRadius: "8px",
                    overflow: "hidden",
                  }}
                >
                  {/* Message text (if any) */}
                  {message.text && (
                    <div
                      style={{
                        padding: "0.5rem 1rem",
                        color: "#fff",
                        borderBottom: "1px solid rgba(255,255,255,0.1)",
                        wordBreak: "break-word",
                      }}
                    >
                      <ReactMarkdown key={message.text}>
                        {message.text}
                      </ReactMarkdown>
                    </div>
                  )}

                  {/* Image grid */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        message.imageUrls.length > 1 ? "repeat(2, 1fr)" : "1fr",
                      gap: "2px",
                      padding: "2px",
                    }}
                  >
                    {message.imageUrls.map((imgUrl, idx) => (
                      <img
                        key={idx}
                        src={imgUrl}
                        alt={`Shared media ${idx + 1}`}
                        style={{
                          width: "100%",
                          objectFit: "cover",
                          aspectRatio: "1 / 1",
                          display: "block",
                        }}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                // Text-only message
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
                  <ReactMarkdown key={message.text}>
                    {message.text}
                  </ReactMarkdown>
                </div>
              )}
            </div>
          ))}

          {/* Loading indicator */}
          {isLoading && (
            <div style={{ textAlign: "center", padding: "1rem" }}>
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
              <style>
                {`
                @keyframes spin {
                  to { transform: rotate(360deg); }
                }
              `}
              </style>
            </div>
          )}
        </div>

        {/* Media Preview Area - Fixed to show multiple images */}
        {pendingMedia.length > 0 && (
          <div
            style={{
              padding: "0.5rem",
              background: "rgb(30, 30, 30)",
              borderTop: "1px solid #444",
            }}
          >
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "8px",
              }}
            >
              {pendingMedia.map((media, index) => (
                <div key={index} style={{ position: "relative" }}>
                  <img
                    src={media}
                    alt={`Preview ${index + 1}`}
                    style={{
                      height: "80px",
                      width: "80px",
                      objectFit: "cover",
                      borderRadius: "4px",
                    }}
                  />
                  <button
                    onClick={() => removeImage(index)}
                    style={{
                      position: "absolute",
                      top: "2px",
                      right: "2px",
                      background: "rgba(0,0,0,0.7)",
                      border: "none",
                      borderRadius: "50%",
                      width: "20px",
                      height: "20px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      padding: 0,
                    }}
                  >
                    <MdCancel color="#fff" size={14} />
                  </button>
                </div>
              ))}
              <div
                style={{
                  marginLeft: "auto",
                  color: pendingMedia.length === 5 ? "#ff9800" : "#888",
                  fontSize: "12px",
                  alignSelf: "flex-end",
                }}
              >
                {pendingMedia.length}/5 images
              </div>
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
                  background: pendingMedia.length >= 5 ? "#aaa" : "#007bff",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: pendingMedia.length >= 5 ? "not-allowed" : "pointer",
                }}
                disabled={pendingMedia.length >= 5}
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
                Close Camera
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
              !pendingMedia.length && !cameraActive ? "1px solid #444" : "none",
            background: "rgb(20, 20, 20)",
            position: "relative",
          }}
        >
          <input
            type="text"
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            placeholder={
              pendingMedia.length > 0
                ? "Add a caption..."
                : "Type your message..."
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

          {/* Hidden file input - updated to accept multiple files */}
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            multiple
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
                cursor: pendingMedia.length >= 5 ? "not-allowed" : "pointer",
                opacity: pendingMedia.length >= 5 ? 0.5 : 1,
              }}
              disabled={pendingMedia.length >= 5}
            >
              <AiOutlineCamera size={24} color="#007bff" />
            </button>

            {/* Camera Menu */}
            {showMenu && pendingMedia.length < 5 && (
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
                  Upload Images
                </button>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={
              isLoading ||
              (pendingMedia.length === 0 && currentMessage.trim() === "")
            }
            style={{
              padding: "0.5rem 1rem",
              background:
                isLoading ||
                (pendingMedia.length === 0 && currentMessage.trim() === "")
                  ? "#555"
                  : "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor:
                isLoading ||
                (pendingMedia.length === 0 && currentMessage.trim() === "")
                  ? "not-allowed"
                  : "pointer",
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

export default ChatPage;
