# Thanh Dat Tran - Full-Stack Portfolio

A modern, responsive portfolio website built with the **MERN stack** (MongoDB, Express, React, Node.js). Features a contact form that stores submissions in a database and optionally sends email notifications.

![Tech Stack](https://img.shields.io/badge/React-18.2-61DAFB?style=flat&logo=react)
![Tech Stack](https://img.shields.io/badge/Node.js-18+-339933?style=flat&logo=node.js)
![Tech Stack](https://img.shields.io/badge/MongoDB-7.0-47A248?style=flat&logo=mongodb)
![Tech Stack](https://img.shields.io/badge/Express-4.18-000000?style=flat&logo=express)
![Tech Stack](https://img.shields.io/badge/Tailwind-3.4-06B6D4?style=flat&logo=tailwindcss)

## 🚀 Tech Stack

### Frontend
- **React 18** - UI library with hooks
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animations and transitions
- **Axios** - HTTP client for API calls
- **React Hot Toast** - Toast notifications
- **Lucide React** - Icon library

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **Nodemailer** - Email sending (optional)
- **Express Validator** - Input validation
- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing

## 📁 Project Structure

```
portfolio-fullstack/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── Navbar.jsx
│   │   │   ├── Hero.jsx
│   │   │   ├── About.jsx
│   │   │   ├── Skills.jsx
│   │   │   ├── Projects.jsx
│   │   │   ├── Experience.jsx
│   │   │   ├── Contact.jsx   # Contact form with API integration
│   │   │   ├── Footer.jsx
│   │   │   ├── Loader.jsx
│   │   │   └── CursorGlow.jsx
│   │   ├── services/
│   │   │   └── api.js        # API service layer
│   │   ├── styles/
│   │   │   └── index.css     # Global styles + Tailwind
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── .env.example
│
├── backend/                  # Express backend
│   ├── config/
│   │   └── db.js             # MongoDB connection
│   ├── models/
│   │   └── Contact.js        # Contact schema
│   ├── routes/
│   │   └── contacts.js       # Contact API routes
│   ├── server.js             # Express app entry
│   ├── package.json
│   └── .env.example
│
└── README.md
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+ installed
- MongoDB installed locally OR a MongoDB Atlas account
- Git

### 1. Clone or Download the Project

```bash
# If using git
git clone <your-repo-url>
cd portfolio-fullstack

# Or just navigate to the project folder
cd portfolio-fullstack
```

### 2. Setup Backend

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your settings
nano .env  # or use any text editor
```

**Configure `.env` file:**
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/portfolio_contacts

# Optional: Email notifications
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_TO=thanhdat.workdirect@gmail.com

FRONTEND_URL=http://localhost:5173
```

**Start MongoDB (if local):**
```bash
# macOS (Homebrew)
brew services start mongodb-community

# Ubuntu/Debian
sudo systemctl start mongod

# Windows
net start MongoDB
```

**Start Backend Server:**
```bash
npm run dev
```

The backend will run at `http://localhost:5000`

### 3. Setup Frontend

```bash
# Open a new terminal, navigate to frontend
cd frontend

# Install dependencies
npm install

# Create environment file (optional)
cp .env.example .env

# Start development server
npm run dev
```

The frontend will run at `http://localhost:5173`

### 4. Test the Application

1. Open `http://localhost:5173` in your browser
2. Navigate to the Contact section
3. Fill out and submit the form
4. Check your MongoDB database for the new contact entry

## 📡 API Endpoints

### Health Check
```
GET /api/health
```

### Contacts

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/contacts` | Submit contact form |
| GET | `/api/contacts` | List all contacts (admin) |
| GET | `/api/contacts/stats` | Get statistics (admin) |
| GET | `/api/contacts/:id` | Get single contact (admin) |
| PATCH | `/api/contacts/:id` | Update status (admin) |
| DELETE | `/api/contacts/:id` | Delete contact (admin) |

### Example: Submit Contact Form
```bash
curl -X POST http://localhost:5000/api/contacts \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "subject": "Job Opportunity",
    "message": "Hi Thanh, I have an exciting opportunity..."
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Thank you for your message! I will get back to you soon.",
  "data": {
    "id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2026-01-29T12:00:00.000Z"
  }
}
```

## 🗄️ Database Schema

### Contact Model
```javascript
{
  name: String,        // Required, 2-100 chars
  email: String,       // Required, valid email
  subject: String,     // Optional, max 200 chars
  message: String,     // Required, 10-5000 chars
  status: String,      // 'new' | 'read' | 'replied' | 'archived'
  ipAddress: String,   // Auto-captured (hidden)
  userAgent: String,   // Auto-captured (hidden)
  createdAt: Date,     // Auto-generated
  updatedAt: Date      // Auto-generated
}
```

## 🚀 Deployment

### Option 1: Vercel (Frontend) + Railway/Render (Backend)

**Frontend (Vercel):**
```bash
cd frontend
npm run build
# Deploy dist/ folder to Vercel
```

**Backend (Railway/Render):**
1. Push backend to GitHub
2. Connect to Railway or Render
3. Set environment variables
4. Deploy

### Option 2: Single VPS (DigitalOcean, AWS EC2)

```bash
# Build frontend
cd frontend && npm run build

# Copy build to backend public folder
cp -r dist ../backend/public

# In backend/server.js, add static file serving:
# app.use(express.static('public'));

# Deploy backend with PM2
pm2 start server.js --name portfolio
```

### Option 3: Docker

```dockerfile
# Dockerfile for backend
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["node", "server.js"]
```

## 🔒 Security Features

- **Helmet.js** - Sets security HTTP headers
- **CORS** - Configured for specific origins
- **Rate Limiting** - 5 requests per 15 minutes for contact form
- **Input Validation** - Server-side validation with express-validator
- **MongoDB Injection Prevention** - Mongoose sanitization
- **XSS Protection** - Input sanitization

## 📧 Email Notifications (Optional)

To receive email notifications when someone submits the contact form:

1. **Gmail Setup:**
   - Enable 2-Factor Authentication
   - Generate an App Password: Google Account → Security → App Passwords
   - Use the app password in `.env`

2. **Other Providers:**
   - Update `EMAIL_HOST` and `EMAIL_PORT` accordingly
   - Outlook: `smtp.office365.com:587`
   - Yahoo: `smtp.mail.yahoo.com:587`

## 🎨 Customization

### Change Colors
Edit `frontend/tailwind.config.js`:
```javascript
colors: {
  accent: {
    cyan: '#00ffaa',    // Primary accent
    red: '#ff6b6b',     // Secondary accent
    purple: '#7c3aed',  // Tertiary accent
  }
}
```

### Update Personal Info
Edit the respective component files in `frontend/src/components/`:
- `Hero.jsx` - Name, tagline, description
- `About.jsx` - Bio, stats
- `Skills.jsx` - Technical skills
- `Projects.jsx` - Project list
- `Experience.jsx` - Work history, education
- `Contact.jsx` - Email, phone, social links

## 📝 Scripts

### Frontend
```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### Backend
```bash
npm run dev      # Start with nodemon (hot reload)
npm start        # Start production server
```

## 🐛 Troubleshooting

### MongoDB Connection Issues
```bash
# Check if MongoDB is running
mongosh --eval "db.adminCommand('ping')"

# Check connection string format
# Local: mongodb://localhost:27017/portfolio_contacts
# Atlas: mongodb+srv://user:pass@cluster.xxxxx.mongodb.net/dbname
```

### CORS Errors
Ensure `FRONTEND_URL` in backend `.env` matches your frontend URL exactly.

### Port Already in Use
```bash
# Find and kill process on port 5000
lsof -i :5000
kill -9 <PID>
```

## 📄 License

MIT License - feel free to use this for your own portfolio!

## 👤 Author

**Thanh Dat Tran**
- GitHub: [@draytht](https://github.com/draytht)
- LinkedIn: [thanhdattran09](https://www.linkedin.com/in/thanhdattran09/)
- Email: thanhdat.workdirect@gmail.com

---

⭐ If this helped you, please give it a star on GitHub!
