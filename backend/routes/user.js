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


userRouter.post('/deepchat', async (req, res) => {
  try {
    const { messages, locationContext } = req.body;

    // Access API key from environment variables
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'Missing API key' });
    }

    // Initialize the Gemini API client
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'models/gemini-2.0-flash-lite' });
    
    // Extract the latest user message
    const latestUserMessage = messages.filter(msg => msg.sender === 'user').pop();
    const messageText = latestUserMessage ? latestUserMessage.text : '';
    
    // Format chat history properly for Gemini - ensuring the first message is from a user
    let chatHistory = [];
    
    // If we have location context, prepend it as a user message
    if (locationContext && Object.keys(locationContext).length > 0) {
      // Add location context as the first user message
      chatHistory.push({
        role: 'user',
        parts: [{ text: `This is the location I want to discuss: ${JSON.stringify(locationContext)}` }]
      });
      
      // Add a model response to acknowledge the location context
      chatHistory.push({
        role: 'model',
        parts: [{ text: `I understand you want to discuss ${locationContext.name || 'this location'}. What would you like to know?` }]
      });
    }
    
    // Add the actual conversation history, making sure to correct the roles
    // Skip the first system message if it exists
    for (let i = 0; i < messages.length; i++) {
      const msg = messages[i];
      
      // Skip system messages at the beginning
      if (i === 0 && msg.sender === 'system') {
        continue;
      }
      
      chatHistory.push({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      });
    }
    
    // Ensure the history starts with a user message
    if (chatHistory.length > 0 && chatHistory[0].role !== 'user') {
      // If not, prepend a generic user message
      chatHistory.unshift({
        role: 'user',
        parts: [{ text: 'Hello, I would like to chat about this location.' }]
      });
    } else if (chatHistory.length === 0) {
      // If history is empty, add a starting user message
      chatHistory.push({
        role: 'user', 
        parts: [{ text: locationContext ? 
          `Tell me about ${locationContext.name || 'this location'}.` : 
          'Hello, I would like to start a conversation.' 
        }]
      });
    }
    
    // Create chat session with the corrected history
    const chatSession = model.startChat({ history: chatHistory });
    
    // For the initial message with no user input, we'll send a specific prompt
    let promptText = '';
    if (!latestUserMessage && locationContext) {
      promptText = `Please provide an informative introduction about ${locationContext.name || 'this location'}.`;
    } else if (latestUserMessage) {
      // Use the latest user message for continuing the conversation
      promptText = latestUserMessage.text;
    } else {
      // Generic prompt if there's no context or user message
      promptText = "Hello";
    }
    
    // Send message to Gemini
    const result = await chatSession.sendMessage(promptText);
    const botResponse = result.response.text();
    
    res.json({ 
      success: true, 
      response: botResponse 
    });
  } catch (error) {
    console.error('Error in chat endpoint:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});


module.exports = userRouter;