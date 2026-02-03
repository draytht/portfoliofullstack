import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, Eye, Image, X, Plus } from 'lucide-react';
import { adminBlogAPI } from '../services/blogApi';
import toast from 'react-hot-toast';

const CATEGORIES = ['Technology', 'Programming', 'Career', 'Projects', 'Life', 'Tutorial', 'Other'];

export default function PostEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    category: 'Other',
    tags: [],
    coverImage: '',
    status: 'draft',
    featured: false,
  });
  const [tagInput, setTagInput] = useState('');
  const [preview, setPreview] = useState(false);

  useEffect(() => {
    // Check authentication
    if (!adminBlogAPI.getPassword()) {
      navigate('/admin');
      return;
    }

    if (isEditing) {
      fetchPost();
    }
  }, [id]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const response = await adminBlogAPI.getPost(id);
      setFormData({
        title: response.data.title || '',
        content: response.data.content || '',
        excerpt: response.data.excerpt || '',
        category: response.data.category || 'Other',
        tags: response.data.tags || [],
        coverImage: response.data.coverImage || '',
        status: response.data.status || 'draft',
        featured: response.data.featured || false,
      });
    } catch (error) {
      toast.error('Failed to load post');
      navigate('/admin');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddTag = (e) => {
    e.preventDefault();
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim().toLowerCase())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim().toLowerCase()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (status = formData.status) => {
    if (!formData.title.trim()) {
      toast.error('Title is required');
      return;
    }
    if (formData.content.length < 50) {
      toast.error('Content must be at least 50 characters');
      return;
    }

    setSaving(true);
    try {
      const data = { ...formData, status };

      if (isEditing) {
        await adminBlogAPI.updatePost(id, data);
        toast.success('Post updated!');
      } else {
        await adminBlogAPI.createPost(data);
        toast.success('Post created!');
      }
      navigate('/admin');
    } catch (error) {
      toast.error(error.message || 'Failed to save post');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent-cyan border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary">
      {/* Header */}
      <header className="bg-primary-light border-b border-white/5 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                to="/admin" 
                className="flex items-center gap-2 text-text-secondary hover:text-accent-cyan transition-colors"
              >
                <ArrowLeft size={20} />
              </Link>
              <h1 className="text-xl font-bold">
                {isEditing ? 'Edit Post' : 'New Post'}
              </h1>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => setPreview(!preview)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-sm transition-colors ${
                  preview 
                    ? 'bg-accent-purple text-white' 
                    : 'bg-primary-card text-text-secondary hover:text-white'
                }`}
              >
                <Eye size={18} />
                Preview
              </button>
              <button
                onClick={() => handleSubmit('draft')}
                disabled={saving}
                className="px-4 py-2 bg-primary-card text-text-secondary hover:text-white rounded-lg font-mono text-sm transition-colors"
              >
                Save Draft
              </button>
              <button
                onClick={() => handleSubmit('published')}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-accent-cyan text-primary font-mono text-sm rounded-lg hover:shadow-lg hover:shadow-accent-cyan/20 transition-all disabled:opacity-50"
              >
                <Save size={18} />
                {saving ? 'Saving...' : 'Publish'}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {preview ? (
          // Preview Mode
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-primary-card rounded-xl p-8 border border-white/5"
          >
            <span className="text-accent-cyan font-mono text-sm">{formData.category}</span>
            <h1 className="text-3xl font-bold mt-4 mb-6">{formData.title || 'Untitled Post'}</h1>
            {formData.coverImage && (
              <img 
                src={formData.coverImage} 
                alt="Cover" 
                className="w-full h-64 object-cover rounded-xl mb-8"
              />
            )}
            <div 
              className="prose prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: formatPreview(formData.content) }}
            />
            {formData.tags.length > 0 && (
              <div className="flex gap-2 mt-8 pt-8 border-t border-white/10">
                {formData.tags.map(tag => (
                  <span key={tag} className="px-3 py-1 bg-white/5 rounded text-sm text-text-secondary">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </motion.div>
        ) : (
          // Edit Mode
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Title */}
            <div>
              <label className="block font-mono text-sm text-text-muted mb-2">Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter post title..."
                className="w-full px-4 py-4 bg-primary-card border border-white/10 rounded-xl text-xl font-semibold focus:outline-none focus:border-accent-cyan"
              />
            </div>

            {/* Cover Image */}
            <div>
              <label className="block font-mono text-sm text-text-muted mb-2">Cover Image URL</label>
              <div className="flex gap-4">
                <input
                  type="text"
                  name="coverImage"
                  value={formData.coverImage}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                  className="flex-1 px-4 py-3 bg-primary-card border border-white/10 rounded-xl font-mono text-sm focus:outline-none focus:border-accent-cyan"
                />
                {formData.coverImage && (
                  <img 
                    src={formData.coverImage} 
                    alt="Cover preview" 
                    className="w-20 h-12 object-cover rounded-lg"
                  />
                )}
              </div>
            </div>

            {/* Category & Status */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-mono text-sm text-text-muted mb-2">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-primary-card border border-white/10 rounded-xl font-mono text-sm focus:outline-none focus:border-accent-cyan"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-mono text-sm text-text-muted mb-2">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-primary-card border border-white/10 rounded-xl font-mono text-sm focus:outline-none focus:border-accent-cyan"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block font-mono text-sm text-text-muted mb-2">Tags</label>
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.tags.map(tag => (
                  <span 
                    key={tag}
                    className="flex items-center gap-1 px-3 py-1 bg-accent-cyan/10 text-accent-cyan rounded-full text-sm"
                  >
                    #{tag}
                    <button onClick={() => handleRemoveTag(tag)} className="hover:text-white">
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
              <form onSubmit={handleAddTag} className="flex gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="Add a tag..."
                  className="flex-1 px-4 py-2 bg-primary-card border border-white/10 rounded-lg font-mono text-sm focus:outline-none focus:border-accent-cyan"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-card border border-white/10 rounded-lg text-text-secondary hover:text-white transition-colors"
                >
                  <Plus size={18} />
                </button>
              </form>
            </div>

            {/* Excerpt */}
            <div>
              <label className="block font-mono text-sm text-text-muted mb-2">
                Excerpt <span className="text-text-muted">(optional - auto-generated if empty)</span>
              </label>
              <textarea
                name="excerpt"
                value={formData.excerpt}
                onChange={handleChange}
                placeholder="Brief description of the post..."
                rows={3}
                className="w-full px-4 py-3 bg-primary-card border border-white/10 rounded-xl font-mono text-sm focus:outline-none focus:border-accent-cyan resize-none"
              />
            </div>

            {/* Content */}
            <div>
              <label className="block font-mono text-sm text-text-muted mb-2">
                Content * <span className="text-text-muted">(Markdown supported)</span>
              </label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="Write your post content here...

## You can use Markdown

**Bold text**, *italic text*, `inline code`

```
code blocks
```

- List items
- Another item

[Links](https://example.com)"
                rows={20}
                className="w-full px-4 py-4 bg-primary-card border border-white/10 rounded-xl font-mono text-sm focus:outline-none focus:border-accent-cyan resize-none leading-relaxed"
              />
              <p className="text-text-muted text-xs mt-2">
                {formData.content.length} characters • Min: 50
              </p>
            </div>

            {/* Featured */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="featured"
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
                className="w-5 h-5 rounded bg-primary-card border-white/10"
              />
              <label htmlFor="featured" className="font-mono text-sm text-text-secondary">
                Feature this post on the blog homepage
              </label>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// Helper function to format preview
function formatPreview(content) {
  if (!content) return '<p class="text-text-muted">Start writing to see preview...</p>';
  
  let html = content
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
    .replace(/`(.*?)`/g, '<code>$1</code>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-accent-cyan">$1</a>')
    .replace(/^- (.*$)/gim, '<li>$1</li>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br />');
  
  return `<p>${html}</p>`;
}
