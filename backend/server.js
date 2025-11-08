require('dotenv').config({ path: './config.env' });
const express = require('express');
const cors = require('cors'); 
const connectDB = require('./config/db');
const app = express();


connectDB();

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000',process.env.FRONTEND_URL], 
  
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));


app.use(express.json());


app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  next();
});


app.get('/ping', (req, res) => {
  res.json({ message: 'pong' });
});
app.get('/', (req, res) => {
  console.log('Root route accessed');
  res.status(200).json({ 
    message: 'Welcome to Skill Quest API',
    status: 'success'
  });
});
app.get('/test', (req, res) => {
  console.log('GET test route accessed');
  res.status(200).json({ 
    message: 'GET test successful',
    status: 'success'
  });
});
app.post('/test', (req, res) => {
  console.log('POST test route accessed');
  console.log('Received headers:', req.headers);
  console.log('Received body:', req.body);
  res.status(200).json({ 
    message: 'POST test successful',
    status: 'success',
    received: {
      headers: req.headers,
      body: req.body
    }
  });
});


app.use('/api/auth', require('./routes/authRoutes'));


app.use('/api/users', require('./routes/dashboardRoutes'));
app.use('/api/skills', require('./routes/skillsRoutes'));
app.use('/api/challenges', require('./routes/challengeRoutes'));
app.use('/api/rankings', require('./routes/rankingRoutes'));


app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});


app.use((req, res) => {
  console.log('404 Not Found:', req.method, req.url);
  res.status(404).json({ message: 'Route not found' });
});


const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
