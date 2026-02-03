import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, PlayCircle, Calendar, Clock, ArrowLeft } from 'lucide-react';
import { blogAPI } from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function BlogPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await blogAPI.getAll();
      setBlogs(response.data || []);
    } catch (err) {
      console.error('Failed to fetch blogs:', err);
      setError('Failed to load blog posts');
      // Use sample data as fallback
      setBlogs([
        {
          _id: '1',
          title: 'Modern Web Performance in 2026',
          content: 'Exploring the latest trends in Vite and React Server Components...',
          type: 'article',
          createdAt: new Date().toISOString(),
          thumbnailColor: 'from-[#740A03] to-[#280905]',
        },
        {
          _id: '2',
          title: 'Deep Learning with Python - Video Tutorial',
          content: 'A walk-through of my Music Generation neural network project.',
          type: 'video',
          videoUrl: 'https://youtube.com/your-video-link',
          createdAt: new Date().toISOString(),
          thumbnailColor: 'from-[#E6501B] to-[#C3110C]',
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-primary">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Header */}
          <div className="mb-12">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-text-secondary hover:text-accent-cyan transition-colors mb-6"
            >
              <ArrowLeft size={20} />
              Back to Home
            </Link>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="font-mono text-sm text-accent-cyan block mb-4">
                // Insights & Tutorials
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Blog Posts
              </h1>
              <p className="text-text-secondary text-lg max-w-2xl">
                Thoughts on web development, tutorials, and my journey as a developer.
              </p>
            </motion.div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-20">
              <div className="w-8 h-8 border-2 border-accent-cyan border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}

          {/* Blog Grid */}
          {!loading && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((post, index) => (
                <motion.div
                  key={post._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group bg-primary-card border border-white/10 rounded-xl overflow-hidden hover:border-accent-cyan/50 transition-all"
                >
                  {/* Thumbnail */}
                  <div className={`h-48 bg-gradient-to-br ${post.thumbnailColor || 'from-accent-purple to-accent-cyan'} flex items-center justify-center relative`}>
                    {post.type === 'video' ? (
                      <PlayCircle size={48} className="text-white opacity-80" />
                    ) : (
                      <BookOpen size={48} className="text-white opacity-80" />
                    )}
                    <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md px-3 py-1 rounded text-xs text-white uppercase">
                      {post.type}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-center gap-4 text-xs text-accent-cyan mb-3 font-mono">
                      <span className="flex items-center gap-1">
                        <Calendar size={14} /> {formatDate(post.createdAt)}
                      </span>
                      {post.type === 'article' && (
                        <span className="flex items-center gap-1">
                          <Clock size={14} /> 5 min read
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-accent-cyan transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-text-secondary text-sm mb-6 line-clamp-2">
                      {post.content.substring(0, 150)}...
                    </p>
                    <Link
                      to={`/blog/${post._id}`}
                      className="text-sm font-bold text-white uppercase tracking-widest border-b-2 border-accent-cyan pb-1 hover:bg-accent-cyan hover:text-primary transition-all px-1"
                    >
                      Read More
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && blogs.length === 0 && (
            <div className="text-center py-20">
              <BookOpen size={48} className="text-text-secondary mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No posts yet</h3>
              <p className="text-text-secondary">Check back soon for new content!</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
