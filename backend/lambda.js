// lambda.js - AWS Lambda handler wrapper for Express app
const serverless = require('serverless-http');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('mongoose');

// Import routes
const contactRoutes = require('./routes/contacts');
const postRoutes = require('./routes/posts');

// Initialize Express app
const app = express();

// MongoDB connection (reuse across Lambda invocations)
let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    console.log('Using existing MongoDB connection');
    return;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      bufferCommands: false,
    });
    isConnected = true;
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};

// Middleware
app.use(helmet({
  contentSecurityPolicy: false, // Disable for API
}));

// CORS configuration
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://justdatthang.com',
  'https://www.justdatthang.com',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Admin-Password'],
  credentials: true
}));

app.use(express.json({ limit: '50kb' }));
app.use(express.urlencoded({ extended: true, limit: '50kb' }));

// Connect to DB before handling requests
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    res.status(500).json({ success: false, message: 'Database connection failed' });
  }
});

// Routes
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Thanh Dat Tran Portfolio API',
    version: '1.0.0',
    environment: 'AWS Lambda'
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Portfolio API is running on AWS Lambda',
    timestamp: new Date().toISOString()
  });
});

app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'Thanh Dat Tran Portfolio API - AWS Lambda',
    version: '1.0.0',
    endpoints: {
      health: 'GET /api/health',
      contacts: 'POST /api/contacts',
      posts: 'GET /api/posts'
    }
  });
});

// API Routes
app.use('/api/contacts', contactRoutes);
app.use('/api/posts', postRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
});

// Export Lambda handler
module.exports.handler = serverless(app);
