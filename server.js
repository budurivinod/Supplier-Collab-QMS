const express = require('express');
const cors = require('cors');
require('dotenv').config();
const http = require('http');
const { WebSocketServer } = require('ws');
const { connectDB } = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

// Create an HTTP server from the Express app
const server = http.createServer(app);

// Middleware
app.use(cors()); // Allow requests from your frontend
app.use(express.json()); // To parse JSON request bodies

// API Routes
const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
    console.log('Client connected to WebSocket');
    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

// Pass the wss instance to the routes
const apiRoutes = require('./routes/api')(wss);
app.use('/api', apiRoutes);

app.broadcast = function(data) {
    wss.clients.forEach(client => {
        if (client.readyState === client.OPEN) {
            client.send(JSON.stringify(data));
        }
    });
};

// Connect to Database and Start Server
connectDB().then(() => {
    server.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch(err => {
    console.error("Failed to start the server", err);
});