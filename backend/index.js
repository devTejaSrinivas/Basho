const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const userRouter = require('./routes/user');

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// // Database connection
// const db = process.env.MONGO_URI;
// mongoose.connect(db)
//     .then(() => console.log('MongoDB connected'))
//     .catch(err => console.log(err));

// Use routes
app.use('/user', userRouter);

// Root route (check if it's working)
app.get('/', (req, res) => {
  console.log("Received a GET request at /");
  res.send('Hello World!');
});

app.use((err, req, res, next) => {
    console.error('Error details:', err);  // Log the entire error object
    res.status(500).json({ error: 'Something broke!', details: err.message });
});


// Normalize port into a number, string, or false
const normalizePort = val => {
    const port = parseInt(val, 10);
    
    if (isNaN(port)) {
        return val;
    }
    
    if (port >= 0) {
        return port;
    }
    
    return false;
};

const port = normalizePort(process.env.PORT || '5000');
app.set('port', port);

// Create HTTP server
const server = http.createServer(app);

// Listen on provided port, on all network interfaces
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

