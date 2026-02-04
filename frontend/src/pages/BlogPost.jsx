import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, Eye, Tag, ArrowLeft, Share2, Twitter, Linkedin, Copy, Check } from 'lucide-react';
import { blogAPI } from '../services/blogApi';
import toast from 'react-hot-toast';

export default function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchPost();
  }, [slug]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const response = await blogAPI.getPost(slug);
      setPost(response.data);
    } catch (error) {
      console.error('Failed to fetch post:', error);
      toast.error('Post not found');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      Technology: 'bg-blue-500/20 text-blue-400',
      Programming: 'bg-green-500/20 text-green-400',
      Career: 'bg-purple-500/20 text-purple-400',
      Projects: 'bg-cyan-500/20 text-cyan-400',
      Life: 'bg-pink-500/20 text-pink-400',
      Tutorial: 'bg-yellow-500/20 text-yellow-400',
      Other: 'bg-gray-500/20 text-gray-400',
    };
    return colors[category] || colors.Other;
  };

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast.success('Link copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const shareOnTwitter = () => {
    const text = `Check out this article: ${post.title}`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
  };

  const shareOnLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent-cyan border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-primary flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Post Not Found</h1>
        <Link to="/blog" className="text-accent-cyan hover:underline">
          ← Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary">
      {/* Header */}
      <header className="bg-primary-light border-b border-white/5 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link 
              to="/blog" 
              className="flex items-center gap-2 text-text-secondary hover:text-accent-cyan transition-colors"
            >
              <ArrowLeft size={20} />
              <span className="font-mono text-sm">Back to Blog</span>
            </Link>
            
            {/* Share Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={copyToClipboard}
                className="p-2 text-text-muted hover:text-white transition-colors"
                title="Copy link"
              >
                {copied ? <Check size={18} /> : <Copy size={18} />}
              </button>
              <button
                onClick={shareOnTwitter}
                className="p-2 text-text-muted hover:text-[#1DA1F2] transition-colors"
                title="Share on Twitter"
              >
                <Twitter size={18} />
              </button>
              <button
                onClick={shareOnLinkedIn}
                className="p-2 text-text-muted hover:text-[#0A66C2] transition-colors"
                title="Share on LinkedIn"
              >
                <Linkedin size={18} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero/Cover */}
      {post.coverImage && (
        <div className="h-64 md:h-96 relative overflow-hidden">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/50 to-transparent" />
        </div>
      )}

      {/* Content */}
      <article className="max-w-4xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Category */}
          <span className={`inline-block px-4 py-1 rounded-full text-sm font-mono ${getCategoryColor(post.category)}`}>
            {post.category}
          </span>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mt-6 mb-6 leading-tight">
            {post.title}
          </h1>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-6 text-text-muted font-mono text-sm mb-8 pb-8 border-b border-white/10">
            <span className="flex items-center gap-2">
              <Calendar size={16} />
              {post.formattedDate}
            </span>
            <span className="flex items-center gap-2">
              <Clock size={16} />
              {post.readTime} min read
            </span>
            <span className="flex items-center gap-2">
              <Eye size={16} />
              {post.views} views
            </span>
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-1 px-3 py-1 bg-white/5 rounded text-text-secondary text-sm"
                >
                  <Tag size={12} />
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Article Content */}
          <div 
            className="prose prose-invert prose-lg max-w-none
              prose-headings:font-display prose-headings:font-bold
              prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-4 prose-h2:text-white
              prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3 prose-h3:text-white
              prose-p:text-text-secondary prose-p:leading-relaxed prose-p:mb-6
              prose-a:text-accent-cyan prose-a:no-underline hover:prose-a:underline
              prose-strong:text-white prose-strong:font-semibold
              prose-code:text-accent-cyan prose-code:bg-primary-card prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm
              prose-pre:bg-primary-card prose-pre:border prose-pre:border-white/10 prose-pre:rounded-xl
              prose-ul:text-text-secondary prose-ol:text-text-secondary
              prose-li:mb-2
              prose-blockquote:border-l-accent-cyan prose-blockquote:bg-primary-card prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:rounded-r-xl prose-blockquote:not-italic
              prose-img:rounded-xl prose-img:shadow-2xl"
            dangerouslySetInnerHTML={{ __html: formatContent(post.content) }}
          />
        </motion.div>

        {/* Author Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-16 p-8 bg-primary-card rounded-2xl border border-white/5"
        >
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-accent-cyan to-accent-purple flex items-center justify-center text-2xl font-bold">
              TT
            </div>
            <div>
              <h3 className="text-xl font-semibold">{post.author}</h3>
              <p className="text-text-secondary mt-1">
                Software Developer | Full-Stack Enthusiast
              </p>
              <Link 
                to="/#contact" 
                className="text-accent-cyan font-mono text-sm hover:underline mt-2 inline-block"
              >
                Get in touch →
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Back to Blog */}
        <div className="mt-12 text-center">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-card rounded-xl text-text-secondary hover:text-white transition-colors"
          >
            <ArrowLeft size={18} />
            Back to all articles
          </Link>
        </div>
      </article>

      {/* Footer */}
      <footer className="py-8 border-t border-white/5">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="font-mono text-sm text-text-muted">
            © {new Date().getFullYear()} Thanh Dat Tran. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

// Helper function to format content (basic markdown-like support)
function formatContent(content) {
  if (!content) return '';
  
  // If content is already HTML, return as-is
  if (content.includes('<p>') || content.includes('<h')) {
    return content;
  }
  
  // Basic markdown to HTML conversion
  let html = content
    // Headers
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    // Bold
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // Italic
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // Code blocks
    .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
    // Inline code
    .replace(/`(.*?)`/g, '<code>$1</code>')
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
    // Line breaks
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br />');
  
  return `<p>${html}</p>`;
}