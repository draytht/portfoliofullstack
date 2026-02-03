const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    minlength: [5, 'Title must be at least 5 characters'],
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    index: true
  },
  excerpt: {
    type: String,
    trim: true,
    maxlength: [500, 'Excerpt cannot exceed 500 characters']
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
    minlength: [50, 'Content must be at least 50 characters']
  },
  coverImage: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    enum: ['Technology', 'Programming', 'Career', 'Projects', 'Life', 'Tutorial', 'Other'],
    default: 'Other'
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  author: {
    type: String,
    default: 'Thanh Dat Tran'
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  featured: {
    type: Boolean,
    default: false
  },
  views: {
    type: Number,
    default: 0
  },
  readTime: {
    type: Number, // in minutes
    default: 5
  },
  publishedAt: {
    type: Date
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Generate slug from title before saving
postSchema.pre('save', function(next) {
  if (this.isModified('title') || !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
      + '-' + Date.now().toString(36);
  }
  
  // Calculate read time (average 200 words per minute)
  if (this.isModified('content')) {
    const wordCount = this.content.split(/\s+/).length;
    this.readTime = Math.ceil(wordCount / 200) || 1;
  }
  
  // Set publishedAt when status changes to published
  if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  
  // Generate excerpt from content if not provided
  if (!this.excerpt && this.content) {
    this.excerpt = this.content
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .substring(0, 200)
      .trim() + '...';
  }
  
  next();
});

// Index for faster queries
postSchema.index({ status: 1, publishedAt: -1 });
postSchema.index({ category: 1 });
postSchema.index({ tags: 1 });
postSchema.index({ title: 'text', content: 'text' });

// Virtual for formatted date
postSchema.virtual('formattedDate').get(function() {
  const date = this.publishedAt || this.createdAt;
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

// Static method to get published posts
postSchema.statics.getPublished = function(options = {}) {
  const { page = 1, limit = 10, category, tag } = options;
  
  const query = { status: 'published' };
  if (category) query.category = category;
  if (tag) query.tags = tag;
  
  return this.find(query)
    .sort({ publishedAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .select('-content'); // Exclude full content for list view
};

// Static method to get post statistics
postSchema.statics.getStats = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);
  
  const totalViews = await this.aggregate([
    { $group: { _id: null, total: { $sum: '$views' } } }
  ]);
  
  return {
    byStatus: stats.reduce((acc, s) => { acc[s._id] = s.count; return acc; }, {}),
    totalPosts: await this.countDocuments(),
    totalViews: totalViews[0]?.total || 0
  };
};

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
