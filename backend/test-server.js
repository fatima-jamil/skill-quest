const express = require('express');
const cors = require('cors');
const app = express();

// Enable CORS for all routes
app.use(cors());

// Basic middleware
app.use(express.json());

// Add debugging middleware
app.use((req, res, next) => {
    console.log('=================================');
    console.log('Incoming request:');
    console.log('Method:', req.method);
    console.log('URL:', req.url);
    console.log('Headers:', req.headers);
    next();
});

// Test route
app.get('/ping', (req, res) => {
    console.log('Ping route accessed');
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.json({ message: 'pong' });
});

// OPTIONS handling for CORS

// Error handling
app.use((err, req, res, next) => {
    console.error('Error occurred:', err);
    res.status(500).json({ error: 'Internal server error' });
});

// Start server
const PORT = 5050;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('Press Ctrl+C to stop');
});