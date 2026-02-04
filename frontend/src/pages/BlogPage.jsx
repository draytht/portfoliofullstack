import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Eye, Tag, ChevronRight, Search, ArrowLeft } from 'lucide-react';
import { blogAPI } from '../services/blogApi';

export default function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    fetchPosts();
    fetchCategories();
  }, [selectedCategory, currentPage]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 9,
      };
      if (selectedCategory) params.category = selectedCategory;
      if (searchQuery) params.search = searchQuery;

      const response = await blogAPI.getPosts(params);
      setPosts(response.data);
      setPagination(response.pagination);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await blogAPI.getCategories();
      setCategories(response.data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchPosts();
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

  return (
    <div className="min-h-screen bg-primary">
      {/* Header */}
      <header className="bg-primary-light border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <Link 
              to="/" 
              className="flex items-center gap-2 text-text-secondary hover:text-accent-cyan transition-colors"
            >
              <ArrowLeft size={20} />
              <span className="font-mono text-sm">Back to Home</span>
            </Link>
            <Link 
              to="/admin" 
              className="font-mono text-xs text-text-muted hover:text-accent-cyan transition-colors"
            >
              Admin
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-cyan/5 rounded-full blur-[100px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-purple/5 rounded-full blur-[100px]" />
        </div>
        
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <span className="font-mono text-accent-cyan text-sm">// My Blog</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mt-4 mb-6">
              Thoughts & <span className="gradient-text">Insights</span>
            </h1>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">
              Articles about programming, technology, career insights, and my journey as a developer.
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            onSubmit={handleSearch}
            className="max-w-xl mx-auto mt-10"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-primary-card border border-white/10 rounded-xl font-mono text-sm focus:outline-none focus:border-accent-cyan transition-colors"
              />
            </div>
          </motion.form>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 bg-primary-light">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Posts Grid */}
            <div className="flex-1">
              {loading ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-primary-card rounded-xl h-80 animate-pulse" />
                  ))}
                </div>
              ) : posts.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-text-muted text-lg">No posts found.</p>
                  <p className="text-text-muted mt-2">Check back later for new content!</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  {posts.map((post, index) => (
                    <motion.article
                      key={post._id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="group"
                    >
                      <Link to={`/blog/${post.slug}`}>
                        <div className="bg-primary-card rounded-xl overflow-hidden border border-white/5 hover:border-accent-cyan/30 transition-all duration-300 h-full">
                          {/* Cover Image */}
                          {post.coverImage ? (
                            <div className="h-48 overflow-hidden">
                              <img
                                src={post.coverImage}
                                alt={post.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                            </div>
                          ) : (
                            <div className="h-48 bg-gradient-to-br from-accent-cyan/10 to-accent-purple/10 flex items-center justify-center">
                              <span className="text-6xl opacity-50">📝</span>
                            </div>
                          )}

                          {/* Content */}
                          <div className="p-6">
                            {/* Category */}
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-mono ${getCategoryColor(post.category)}`}>
                              {post.category}
                            </span>

                            {/* Title */}
                            <h2 className="text-xl font-semibold mt-4 mb-3 group-hover:text-accent-cyan transition-colors line-clamp-2">
                              {post.title}
                            </h2>

                            {/* Excerpt */}
                            <p className="text-text-secondary text-sm line-clamp-2 mb-4">
                              {post.excerpt}
                            </p>

                            {/* Meta */}
                            <div className="flex items-center gap-4 text-text-muted text-xs font-mono">
                              <span className="flex items-center gap-1">
                                <Calendar size={14} />
                                {post.formattedDate}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock size={14} />
                                {post.readTime} min read
                              </span>
                              <span className="flex items-center gap-1">
                                <Eye size={14} />
                                {post.views}
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.article>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {pagination && pagination.pages > 1 && (
                <div className="flex justify-center gap-2 mt-12">
                  {[...Array(pagination.pages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-10 h-10 rounded-lg font-mono text-sm transition-colors ${
                        currentPage === i + 1
                          ? 'bg-accent-cyan text-primary'
                          : 'bg-primary-card text-text-secondary hover:text-white'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <aside className="lg:w-80">
              {/* Categories */}
              <div className="bg-primary-card rounded-xl p-6 border border-white/5">
                <h3 className="font-mono text-accent-cyan mb-4">// Categories</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      setSelectedCategory('');
                      setCurrentPage(1);
                    }}
                    className={`w-full text-left px-4 py-2 rounded-lg font-mono text-sm transition-colors ${
                      selectedCategory === ''
                        ? 'bg-accent-cyan/10 text-accent-cyan'
                        : 'text-text-secondary hover:text-white hover:bg-white/5'
                    }`}
                  >
                    All Posts
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.name}
                      onClick={() => {
                        setSelectedCategory(cat.name);
                        setCurrentPage(1);
                      }}
                      className={`w-full text-left px-4 py-2 rounded-lg font-mono text-sm transition-colors flex justify-between items-center ${
                        selectedCategory === cat.name
                          ? 'bg-accent-cyan/10 text-accent-cyan'
                          : 'text-text-secondary hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <span>{cat.name}</span>
                      <span className="text-text-muted">{cat.count}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Featured Post CTA */}
              <div className="bg-gradient-to-br from-accent-cyan/10 to-accent-purple/10 rounded-xl p-6 mt-6 border border-white/5">
                <h3 className="font-semibold mb-2">Want to connect?</h3>
                <p className="text-text-secondary text-sm mb-4">
                  Feel free to reach out for collaborations or just a friendly chat.
                </p>
                <Link
                  to="/#contact"
                  className="inline-flex items-center gap-2 text-accent-cyan font-mono text-sm hover:underline"
                >
                  Get in touch <ChevronRight size={16} />
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <p className="font-mono text-sm text-text-muted">
            © {new Date().getFullYear()} Thanh Dat Tran. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}