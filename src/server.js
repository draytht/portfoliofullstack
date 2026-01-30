/**
 * Portfolio Backend Server
 * ========================
 * Express.js server with SQLite database for contact form submissions
 * 
 * Author: Thanh Dat Tran
 * 
 * Endpoints:
 * - GET  /                    - Serve the portfolio website
 * - POST /api/contact         - Submit a contact form
 * - GET  /api/contacts        - Get all contacts (admin)
 * - GET  /api/contacts/:id    - Get single contact by ID
 * - DELETE /api/contacts/:id  - Delete a contact
 * - GET  /api/health          - Health check endpoint
 */

const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const Database = require('better-sqlite3');

// ==================== CONFIGURATION ====================
const PORT = process.env.PORT || 3000;
const DB_PATH = path.join(__dirname, '..', 'database', 'contacts.db');

// ==================== DATABASE SETUP ====================
const db = new Database(DB_PATH);

// Create contacts table if it doesn't exist
db.exec(`
    CREATE TABLE IF NOT EXISTS contacts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        subject TEXT,
        message TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        read BOOLEAN DEFAULT 0,
        replied BOOLEAN DEFAULT 0
    )
`);

console.log('✅ Database initialized successfully');

// ==================== EXPRESS APP SETUP ====================
const app = express();

// Security middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:", "https:"],
        },
    },
}));

// CORS configuration
app.use(cors({
    origin: process.env.ALLOWED_ORIGINS || '*',
    methods: ['GET', 'POST', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting for contact form (prevent spam)
const contactLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 requests per windowMs
    message: {
        success: false,
        error: 'Too many contact submissions. Please try again later.'
    }
});

// Parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from public directory
app.use(express.static(path.join(__dirname, '..', 'public')));

// ==================== HELPER FUNCTIONS ====================

/**
 * Validate email format
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Sanitize input to prevent XSS
 */
function sanitizeInput(str) {
    if (typeof str !== 'string') return '';
    return str
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .trim();
}

// ==================== API ROUTES ====================

/**
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
});

/**
 * POST /api/contact
 * Submit a new contact form
 */
app.post('/api/contact', contactLimiter, (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        // Validation
        if (!name || !email || !message) {
            return res.status(400).json({
                success: false,
                error: 'Name, email, and message are required fields.'
            });
        }

        if (!isValidEmail(email)) {
            return res.status(400).json({
                success: false,
                error: 'Please provide a valid email address.'
            });
        }

        if (message.length < 10) {
            return res.status(400).json({
                success: false,
                error: 'Message must be at least 10 characters long.'
            });
        }

        if (message.length > 5000) {
            return res.status(400).json({
                success: false,
                error: 'Message must be less than 5000 characters.'
            });
        }

        // Sanitize inputs
        const sanitizedData = {
            name: sanitizeInput(name),
            email: sanitizeInput(email),
            subject: sanitizeInput(subject || 'No Subject'),
            message: sanitizeInput(message)
        };

        // Insert into database
        const stmt = db.prepare(`
            INSERT INTO contacts (name, email, subject, message)
            VALUES (?, ?, ?, ?)
        `);

        const result = stmt.run(
            sanitizedData.name,
            sanitizedData.email,
            sanitizedData.subject,
            sanitizedData.message
        );

        console.log(`📧 New contact submission from: ${sanitizedData.email}`);

        res.status(201).json({
            success: true,
            message: 'Thank you for your message! I will get back to you soon.',
            data: {
                id: result.lastInsertRowid,
                name: sanitizedData.name,
                email: sanitizedData.email,
                subject: sanitizedData.subject,
                created_at: new Date().toISOString()
            }
        });

    } catch (error) {
        console.error('Error saving contact:', error);
        res.status(500).json({
            success: false,
            error: 'An error occurred while saving your message. Please try again.'
        });
    }
});

/**
 * GET /api/contacts
 * Get all contact submissions (admin endpoint)
 * In production, this should be protected with authentication
 */
app.get('/api/contacts', (req, res) => {
    try {
        const { page = 1, limit = 20, unread } = req.query;
        const offset = (page - 1) * limit;

        let query = 'SELECT * FROM contacts';
        let countQuery = 'SELECT COUNT(*) as total FROM contacts';
        const params = [];

        if (unread === 'true') {
            query += ' WHERE read = 0';
            countQuery += ' WHERE read = 0';
        }

        query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
        params.push(parseInt(limit), parseInt(offset));

        const contacts = db.prepare(query).all(...params);
        const { total } = db.prepare(countQuery).get();

        res.json({
            success: true,
            data: contacts,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(total / limit)
            }
        });

    } catch (error) {
        console.error('Error fetching contacts:', error);
        res.status(500).json({
            success: false,
            error: 'An error occurred while fetching contacts.'
        });
    }
});

/**
 * GET /api/contacts/:id
 * Get a single contact by ID
 */
app.get('/api/contacts/:id', (req, res) => {
    try {
        const { id } = req.params;

        const contact = db.prepare('SELECT * FROM contacts WHERE id = ?').get(id);

        if (!contact) {
            return res.status(404).json({
                success: false,
                error: 'Contact not found.'
            });
        }

        // Mark as read
        db.prepare('UPDATE contacts SET read = 1 WHERE id = ?').run(id);

        res.json({
            success: true,
            data: contact
        });

    } catch (error) {
        console.error('Error fetching contact:', error);
        res.status(500).json({
            success: false,
            error: 'An error occurred while fetching the contact.'
        });
    }
});

/**
 * DELETE /api/contacts/:id
 * Delete a contact by ID
 */
app.delete('/api/contacts/:id', (req, res) => {
    try {
        const { id } = req.params;

        const result = db.prepare('DELETE FROM contacts WHERE id = ?').run(id);

        if (result.changes === 0) {
            return res.status(404).json({
                success: false,
                error: 'Contact not found.'
            });
        }

        res.json({
            success: true,
            message: 'Contact deleted successfully.'
        });

    } catch (error) {
        console.error('Error deleting contact:', error);
        res.status(500).json({
            success: false,
            error: 'An error occurred while deleting the contact.'
        });
    }
});

/**
 * PATCH /api/contacts/:id/reply
 * Mark a contact as replied
 */
app.patch('/api/contacts/:id/reply', (req, res) => {
    try {
        const { id } = req.params;

        const result = db.prepare('UPDATE contacts SET replied = 1 WHERE id = ?').run(id);

        if (result.changes === 0) {
            return res.status(404).json({
                success: false,
                error: 'Contact not found.'
            });
        }

        res.json({
            success: true,
            message: 'Contact marked as replied.'
        });

    } catch (error) {
        console.error('Error updating contact:', error);
        res.status(500).json({
            success: false,
            error: 'An error occurred while updating the contact.'
        });
    }
});

/**
 * GET /api/stats
 * Get contact statistics
 */
app.get('/api/stats', (req, res) => {
    try {
        const stats = db.prepare(`
            SELECT 
                COUNT(*) as total,
                SUM(CASE WHEN read = 0 THEN 1 ELSE 0 END) as unread,
                SUM(CASE WHEN replied = 1 THEN 1 ELSE 0 END) as replied,
                COUNT(DISTINCT email) as unique_senders
            FROM contacts
        `).get();

        res.json({
            success: true,
            data: stats
        });

    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({
            success: false,
            error: 'An error occurred while fetching statistics.'
        });
    }
});

// ==================== SERVE FRONTEND ====================

// Serve index.html for the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// Serve admin page
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'admin.html'));
});

// Handle 404 - serve index.html for SPA-like behavior
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// ==================== ERROR HANDLING ====================

app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({
        success: false,
        error: 'Internal server error'
    });
});

// ==================== START SERVER ====================

app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════════════════╗
║                                                        ║
║   🚀 Thanh Dat Tran Portfolio Server                   ║
║                                                        ║
║   Server running at: http://localhost:${PORT}             ║
║   Admin panel at:    http://localhost:${PORT}/admin       ║
║   API endpoints:     http://localhost:${PORT}/api         ║
║                                                        ║
║   Database: ${DB_PATH}
║                                                        ║
╚════════════════════════════════════════════════════════╝
    `);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n👋 Shutting down gracefully...');
    db.close();
    process.exit(0);
});

module.exports = app;
