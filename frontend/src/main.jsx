import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App';
import BlogPage from './pages/BlogPage';
import BlogPost from './pages/BlogPost';
import AdminDashboard from './pages/AdminDashboard';
import PostEditor from './pages/PostEditor';
import './styles/index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1a1a25',
            color: '#fff',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '14px',
          },
          success: {
            iconTheme: {
              primary: '#00ffaa',
              secondary: '#1a1a25',
            },
          },
          error: {
            iconTheme: {
              primary: '#ff6b6b',
              secondary: '#1a1a25',
            },
          },
        }}
      />
      <Routes>
        {/* Main Portfolio */}
        <Route path="/" element={<App />} />
        
        {/* Blog Pages */}
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        
        {/* Admin Pages */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/new" element={<PostEditor />} />
        <Route path="/admin/edit/:id" element={<PostEditor />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
