// CameraComponent.js
import React, { useState, useRef } from "react";

const CameraComponent = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);

  const handleCameraAccess = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraActive(true);
      setCapturedImage(null);
    } catch (error) {
      alert("Unable to access the camera. Please check your permissions.");
    }
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
      setCapturedImage(imageUrl);
      stopCamera();
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

  return (
    <div style={{ textAlign: "center", padding: "1rem" }}>
      {!cameraActive && !capturedImage && (
        <button
          onClick={handleCameraAccess}
          style={{
            padding: "0.5rem 1rem",
            background: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Open Camera
        </button>
      )}

      {cameraActive && (
        <div>
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
              display: "none",
            }}
          ></canvas>
          <div
            style={{ display: "flex", gap: "1rem", justifyContent: "center" }}
          >
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

      {capturedImage && (
        <div>
          <img
            src={capturedImage}
            alt="Captured"
            style={{
              width: "100%",
              maxWidth: "400px",
              borderRadius: "8px",
              marginBottom: "1rem",
            }}
          />
          <button
            onClick={handleCameraAccess}
            style={{
              padding: "0.5rem 1rem",
              background: "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Retake Picture
          </button>
        </div>
      )}
    </div>
  );
};

export default CameraComponent;
