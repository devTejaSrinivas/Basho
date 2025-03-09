const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");

const http = require("http");
const userRouter = require("./routes/user");
const chatRouter = require("./routes/chat");

// Load environment variables
require("dotenv").config();

// Initialize express app
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Database connection
const dbURI = process.env.MONGO_URI;

console.log("MongoDB URI:", dbURI);

mongoose
  .connect(dbURI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1); // Exit process if DB connection fails
  });

// Use routes
app.use("/user", userRouter);

// Root route (check if it's working)
app.get("/", (req, res) => {
  console.log("✅ Received a GET request at /");
  res.send("Hello World!");
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error("❌ Error details:", err);
  res.status(500).json({ error: "Something broke!", details: err.message });
});

// Normalize port into a number, string, or false
const normalizePort = (val) => {
  const port = parseInt(val, 10);
  if (isNaN(port)) return val;
  if (port >= 0) return port;
  return false;
};

const port = normalizePort(process.env.PORT || "5000");
app.set("port", port);

// Chat Router Running Here
app.use("/chat", chatRouter);
// Create HTTP server
const server = http.createServer(app);

// Listen on provided port
server.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`);
});
