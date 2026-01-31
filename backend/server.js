require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./config/db');
const contactRoutes = require('./routes/contacts');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// ============ MIDDLEWARE ============

// Security headers
app.use(helmet());

// CORS configuration - Allow your frontend domain
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://justdatthang.com',
  'https://www.justdatthang.com',
  'https://draytht.github.io',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('Blocked by CORS:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Body parsers
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} | ${req.method} ${req.path} | Origin: ${req.headers.origin || 'N/A'}`);
  next();
});

// ============ ROUTES ============

// Health check endpoint (Render uses this)
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Thanh Dat Tran Portfolio API',
    version: '1.0.0',
    status: 'running'
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Portfolio API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API info endpoint
app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'Thanh Dat Tran Portfolio API',
    version: '1.0.0',
    endpoints: {
      health: 'GET /api/health',
      contacts: {
        create: 'POST /api/contacts',
        list: 'GET /api/contacts',
        stats: 'GET /api/contacts/stats',
        single: 'GET /api/contacts/:id',
        update: 'PATCH /api/contacts/:id',
        delete: 'DELETE /api/contacts/:id'
      }
    }
  });
});

// Contact routes
app.use('/api/contacts', contactRoutes);

// ============ ERROR HANDLING ============

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  
  // Handle CORS errors
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({
      success: false,
      message: 'CORS policy: Origin not allowed'
    });
  }
  
  res.status(err.status || 500).json({
    success: false,
    message: process.env.NODE_ENV === 'development' 
      ? err.message 
      : 'Internal server error'
  });
});

// ============ START SERVER ============

app.listen(PORT, '0.0.0.0', () => {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║   🚀 Portfolio Backend Server                              ║
║                                                            ║
║   Environment: ${(process.env.NODE_ENV || 'development').padEnd(40)}║
║   Port: ${PORT.toString().padEnd(47)}║
║   Status: Running                                          ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
  `);
});

module.exports = app;