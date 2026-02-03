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


## 📄 License

MIT License - feel free to use this for your own portfolio!

## 👤 Author

**Thanh Dat Tran**
- GitHub: [@draytht](https://github.com/draytht)
- LinkedIn: [thanhdattran09](https://www.linkedin.com/in/thanhdattran09/)
- Email: thanhdat.workdirect@gmail.com

---

⭐ If this helped you, please give it a star on GitHub!
