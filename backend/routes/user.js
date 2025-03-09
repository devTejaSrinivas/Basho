const express = require('express');
const multer = require('multer');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs').promises;
const userRouter = express.Router();

// Configure multer for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Route handler for /testPage that accepts multiple images and prompt text
userRouter.post('/testchat/genLocation', upload.array('images', 5), async (req, res) => {
  try {
    // Check if files and prompt text were provided
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No images uploaded' });
    }
    
    if (!req.body.prompt) {
      return res.status(400).json({ error: 'No prompt text provided' });
    }

    // Access API key from environment variables
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'Missing API key' });
    }

    // Initialize the Gemini API client
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'models/gemini-1.5-pro' });

    // Prepare the content parts (images + text)
    const contentParts = [];

    // Add each image to the content parts
    for (const file of req.files) {
      contentParts.push({
        inlineData: {
          data: file.buffer.toString('base64'),
          mimeType: file.mimetype,
        },
      });
    }

    // Add the prompt text to content parts
    contentParts.push(req.body.prompt);

    // Generate content with the model
    const result = await model.generateContent(contentParts);
    
    // Return the response
    return res.json({ 
      response: result.response.text(),
      status: 'success'
    });
    
  } catch (error) {
    console.error('Error processing request:', error);
    return res.status(500).json({ 
      error: 'Failed to process request', 
      details: error.message 
    });
  }
});

module.exports = userRouter;