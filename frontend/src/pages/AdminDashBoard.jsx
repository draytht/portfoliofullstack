import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Plus, Edit, Trash2, Eye, ArrowLeft, LogOut, 
  FileText, BarChart3, Lock, Check, X, Search
} from 'lucide-react';
import { adminBlogAPI } from '../services/blogApi';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [stats, setStats] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    // Check if already authenticated
    if (adminBlogAPI.getPassword()) {
      setIsAuthenticated(true);
      fetchData();
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await adminBlogAPI.authenticate(password);
      setIsAuthenticated(true);
      fetchData();
      toast.success('Welcome back, Admin!');
    } catch (error) {
      toast.error(error.message || 'Invalid password');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    adminBlogAPI.clearPassword();
    setIsAuthenticated(false);
    setPassword('');
    setPosts([]);
    setStats(null);
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const [postsRes, statsRes] = await Promise.all([
        adminBlogAPI.getAllPosts(),
        adminBlogAPI.getStats()
      ]);
      setPosts(postsRes.data);
      setStats(statsRes.data);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      if (error.message?.includes('Unauthorized')) {
        handleLogout();
        toast.error('Session expired. Please login again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;
    
    try {
      await adminBlogAPI.deletePost(id);
      toast.success('Post deleted');
      fetchData();
    } catch (error) {
      toast.error('Failed to delete post');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'published': return 'bg-green-500/20 text-green-400';
      case 'draft': return 'bg-yellow-500/20 text-yellow-400';
      case 'archived': return 'bg-gray-500/20 text-gray-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const filteredPosts = filter === 'all' 
    ? posts 
    : posts.filter(p => p.status === filter);

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-accent-cyan/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Lock className="text-accent-cyan" size={32} />
            </div>
            <h1 className="text-2xl font-bold">Admin Login</h1>
            <p className="text-text-muted mt-2">Enter your password to continue</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Admin Password"
              className="w-full px-4 py-4 bg-primary-card border border-white/10 rounded-xl font-mono focus:outline-none focus:border-accent-cyan"
              autoFocus
            />
            <button
              type="submit"
              disabled={loading || !password}
              className="w-full py-4 bg-accent-cyan text-primary font-mono font-medium rounded-xl hover:shadow-lg hover:shadow-accent-cyan/20 transition-all disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Login'}
            </button>
          </form>

          <Link
            to="/blog"
            className="flex items-center justify-center gap-2 mt-6 text-text-muted hover:text-white transition-colors"
          >
            <ArrowLeft size={18} />
            Back to Blog
          </Link>
        </motion.div>
      </div>
    );
  }

  // Dashboard
  return (
    <div className="min-h-screen bg-primary">
      {/* Header */}
      <header className="bg-primary-light border-b border-white/5 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                to="/blog" 
                className="flex items-center gap-2 text-text-secondary hover:text-accent-cyan transition-colors"
              >
                <ArrowLeft size={20} />
              </Link>
              <h1 className="text-xl font-bold">Blog Admin</h1>
            </div>
            
            <div className="flex items-center gap-4">
              <Link
                to="/admin/new"
                className="flex items-center gap-2 px-4 py-2 bg-accent-cyan text-primary font-mono text-sm rounded-lg hover:shadow-lg hover:shadow-accent-cyan/20 transition-all"
              >
                <Plus size={18} />
                New Post
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-text-muted hover:text-white transition-colors"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-primary-card rounded-xl p-6 border border-white/5">
              <div className="flex items-center gap-3 mb-2">
                <FileText className="text-accent-cyan" size={20} />
                <span className="text-text-muted text-sm">Total Posts</span>
              </div>
              <span className="text-3xl font-bold">{stats.totalPosts}</span>
            </div>
            <div className="bg-primary-card rounded-xl p-6 border border-white/5">
              <div className="flex items-center gap-3 mb-2">
                <Check className="text-green-400" size={20} />
                <span className="text-text-muted text-sm">Published</span>
              </div>
              <span className="text-3xl font-bold">{stats.byStatus?.published || 0}</span>
            </div>
            <div className="bg-primary-card rounded-xl p-6 border border-white/5">
              <div className="flex items-center gap-3 mb-2">
                <Edit className="text-yellow-400" size={20} />
                <span className="text-text-muted text-sm">Drafts</span>
              </div>
              <span className="text-3xl font-bold">{stats.byStatus?.draft || 0}</span>
            </div>
            <div className="bg-primary-card rounded-xl p-6 border border-white/5">
              <div className="flex items-center gap-3 mb-2">
                <BarChart3 className="text-accent-purple" size={20} />
                <span className="text-text-muted text-sm">Total Views</span>
              </div>
              <span className="text-3xl font-bold">{stats.totalViews}</span>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="flex gap-2 mb-6">
          {['all', 'published', 'draft', 'archived'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-mono text-sm transition-colors ${
                filter === status
                  ? 'bg-accent-cyan text-primary'
                  : 'bg-primary-card text-text-secondary hover:text-white'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {/* Posts Table */}
        <div className="bg-primary-card rounded-xl border border-white/5 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="w-8 h-8 border-2 border-accent-cyan border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="p-12 text-center">
              <FileText className="mx-auto mb-4 text-text-muted" size={48} />
              <p className="text-text-muted">No posts found</p>
              <Link
                to="/admin/new"
                className="inline-flex items-center gap-2 mt-4 text-accent-cyan hover:underline"
              >
                <Plus size={18} />
                Create your first post
              </Link>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-primary-light">
                <tr>
                  <th className="text-left px-6 py-4 font-mono text-sm text-text-muted">Title</th>
                  <th className="text-left px-6 py-4 font-mono text-sm text-text-muted hidden md:table-cell">Category</th>
                  <th className="text-left px-6 py-4 font-mono text-sm text-text-muted">Status</th>
                  <th className="text-left px-6 py-4 font-mono text-sm text-text-muted hidden md:table-cell">Views</th>
                  <th className="text-right px-6 py-4 font-mono text-sm text-text-muted">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPosts.map((post) => (
                  <tr key={post._id} className="border-t border-white/5 hover:bg-white/5">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium line-clamp-1">{post.title}</p>
                        <p className="text-text-muted text-sm">{post.formattedDate}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <span className="text-text-secondary text-sm">{post.category}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-mono ${getStatusColor(post.status)}`}>
                        {post.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <span className="text-text-muted">{post.views}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {post.status === 'published' && (
                          <Link
                            to={`/blog/${post.slug}`}
                            className="p-2 text-text-muted hover:text-white transition-colors"
                            title="View"
                          >
                            <Eye size={18} />
                          </Link>
                        )}
                        <Link
                          to={`/admin/edit/${post._id}`}
                          className="p-2 text-text-muted hover:text-accent-cyan transition-colors"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </Link>
                        <button
                          onClick={() => handleDelete(post._id, post.title)}
                          className="p-2 text-text-muted hover:text-red-400 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
