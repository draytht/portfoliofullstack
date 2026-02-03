import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Clock, PlayCircle } from 'lucide-react';
import { blogAPI } from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPost();
  }, [slug]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const response = await blogAPI.getById(slug);
      setPost(response.data);
    } catch (err) {
      console.error('Failed to fetch blog post:', err);
      setError('Blog post not found');
      // Sample fallback post
      setPost({
        _id: slug,
        title: 'Sample Blog Post',
        content: `
# Welcome to my blog!

This is a sample blog post. When connected to the backend, real content will appear here.

## Features

- Modern React with hooks
- Framer Motion animations
- MongoDB backend
- Tailwind CSS styling

## Code Example

\`\`\`javascript
const greeting = "Hello, World!";
console.log(greeting);
\`\`\`

Stay tuned for more content!
        `,
        type: 'article',
        createdAt: new Date().toISOString(),
        thumbnailColor: 'from-accent-purple to-accent-cyan',
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent-cyan border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error && !post) {
    return (
      <div className="min-h-screen bg-primary">
        <Navbar />
        <main className="pt-24 pb-16">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h1 className="text-3xl font-bold text-white mb-4">Post Not Found</h1>
            <p className="text-text-secondary mb-8">{error}</p>
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-accent-cyan hover:underline"
            >
              <ArrowLeft size={20} />
              Back to Blog
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary">
      <Navbar />

      <main className="pt-24 pb-16">
        <article className="max-w-4xl mx-auto px-6 lg:px-8">
          {/* Back Link */}
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-text-secondary hover:text-accent-cyan transition-colors mb-8"
          >
            <ArrowLeft size={20} />
            Back to Blog
          </Link>

          {/* Header */}
          <motion.header
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            {/* Type Badge */}
            <div className="flex items-center gap-4 mb-6">
              <span className="bg-accent-cyan/20 text-accent-cyan px-3 py-1 rounded-full text-sm font-mono uppercase">
                {post.type}
              </span>
              <span className="flex items-center gap-2 text-text-secondary text-sm">
                <Calendar size={16} />
                {formatDate(post.createdAt)}
              </span>
              {post.type === 'article' && (
                <span className="flex items-center gap-2 text-text-secondary text-sm">
                  <Clock size={16} />
                  5 min read
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              {post.title}
            </h1>
          </motion.header>

          {/* Video Embed (if video type) */}
          {post.type === 'video' && post.videoUrl && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-12"
            >
              <div className="aspect-video bg-primary-card rounded-xl overflow-hidden flex items-center justify-center">
                {post.videoUrl.includes('youtube') ? (
                  <iframe
                    src={post.videoUrl.replace('watch?v=', 'embed/')}
                    title={post.title}
                    className="w-full h-full"
                    allowFullScreen
                  />
                ) : (
                  <div className="text-center">
                    <PlayCircle size={64} className="text-accent-cyan mx-auto mb-4" />
                    <a
                      href={post.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent-cyan hover:underline"
                    >
                      Watch Video
                    </a>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="prose prose-invert prose-lg max-w-none"
          >
            <div className="text-text-secondary leading-relaxed whitespace-pre-wrap">
              {post.content}
            </div>
          </motion.div>

          {/* Footer */}
          <motion.footer
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-16 pt-8 border-t border-white/10"
          >
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-accent-cyan hover:underline font-mono"
            >
              <ArrowLeft size={20} />
              View All Posts
            </Link>
          </motion.footer>
        </article>
      </main>

      <Footer />
    </div>
  );
}
