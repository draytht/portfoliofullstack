const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Post = require('../models/Post');

// ============ MIDDLEWARE ============

// Simple admin authentication middleware
// In production, use proper JWT authentication
const adminAuth = (req, res, next) => {
  const adminPassword = req.headers['x-admin-password'];
  
  if (adminPassword !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized. Invalid admin password.'
    });
  }
  
  next();
};

// Validation middleware
const validatePost = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ min: 5, max: 200 }).withMessage('Title must be 5-200 characters'),
  
  body('content')
    .trim()
    .notEmpty().withMessage('Content is required')
    .isLength({ min: 50 }).withMessage('Content must be at least 50 characters'),
  
  body('excerpt')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Excerpt cannot exceed 500 characters'),
  
  body('category')
    .optional()
    .isIn(['Technology', 'Programming', 'Career', 'Projects', 'Life', 'Tutorial', 'Other'])
    .withMessage('Invalid category'),
  
  body('status')
    .optional()
    .isIn(['draft', 'published', 'archived'])
    .withMessage('Invalid status'),
  
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array')
];

// ============ PUBLIC ROUTES ============

/**
 * @route   GET /api/posts
 * @desc    Get all published posts (public)
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      category, 
      tag,
      search,
      featured
    } = req.query;
    
    const query = { status: 'published' };
    
    if (category) query.category = category;
    if (tag) query.tags = tag.toLowerCase();
    if (featured === 'true') query.featured = true;
    if (search) {
      query.$text = { $search: search };
    }
    
    const posts = await Post.find(query)
      .sort({ publishedAt: -1 })
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit))
      .select('-content'); // Exclude full content for list
    
    const total = await Post.countDocuments(query);
    
    res.json({
      success: true,
      data: posts,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total,
        limit: parseInt(limit)
      }
    });
    
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch posts'
    });
  }
});

/**
 * @route   GET /api/posts/categories
 * @desc    Get all categories with post counts
 * @access  Public
 */
router.get('/categories', async (req, res) => {
  try {
    const categories = await Post.aggregate([
      { $match: { status: 'published' } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    res.json({
      success: true,
      data: categories.map(c => ({ name: c._id, count: c.count }))
    });
    
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories'
    });
  }
});

/**
 * @route   GET /api/posts/tags
 * @desc    Get all tags with post counts
 * @access  Public
 */
router.get('/tags', async (req, res) => {
  try {
    const tags = await Post.aggregate([
      { $match: { status: 'published' } },
      { $unwind: '$tags' },
      { $group: { _id: '$tags', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 20 }
    ]);
    
    res.json({
      success: true,
      data: tags.map(t => ({ name: t._id, count: t.count }))
    });
    
  } catch (error) {
    console.error('Get tags error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch tags'
    });
  }
});

/**
 * @route   GET /api/posts/:slug
 * @desc    Get single post by slug (public)
 * @access  Public
 */
router.get('/:slug', async (req, res) => {
  try {
    const post = await Post.findOne({ 
      slug: req.params.slug,
      status: 'published'
    });
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }
    
    // Increment view count
    post.views += 1;
    await post.save();
    
    res.json({
      success: true,
      data: post
    });
    
  } catch (error) {
    console.error('Get post error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch post'
    });
  }
});

// ============ ADMIN ROUTES ============

/**
 * @route   GET /api/posts/admin/all
 * @desc    Get all posts including drafts (admin)
 * @access  Private
 */
router.get('/admin/all', adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    
    const query = {};
    if (status) query.status = status;
    
    const posts = await Post.find(query)
      .sort({ updatedAt: -1 })
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit));
    
    const total = await Post.countDocuments(query);
    
    res.json({
      success: true,
      data: posts,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total
      }
    });
    
  } catch (error) {
    console.error('Admin get posts error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch posts'
    });
  }
});

/**
 * @route   GET /api/posts/admin/stats
 * @desc    Get post statistics (admin)
 * @access  Private
 */
router.get('/admin/stats', adminAuth, async (req, res) => {
  try {
    const stats = await Post.getStats();
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics'
    });
  }
});

/**
 * @route   GET /api/posts/admin/:id
 * @desc    Get single post by ID (admin - includes drafts)
 * @access  Private
 */
router.get('/admin/:id', adminAuth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }
    
    res.json({
      success: true,
      data: post
    });
    
  } catch (error) {
    console.error('Admin get post error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch post'
    });
  }
});

/**
 * @route   POST /api/posts/admin
 * @desc    Create new post (admin)
 * @access  Private
 */
router.post('/admin', adminAuth, validatePost, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array().map(err => ({
          field: err.path,
          message: err.msg
        }))
      });
    }
    
    const { title, content, excerpt, category, tags, status, coverImage, featured } = req.body;
    
    const post = await Post.create({
      title,
      content,
      excerpt,
      category,
      tags: tags || [],
      status: status || 'draft',
      coverImage,
      featured: featured || false
    });
    
    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      data: post
    });
    
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create post'
    });
  }
});

/**
 * @route   PUT /api/posts/admin/:id
 * @desc    Update post (admin)
 * @access  Private
 */
router.put('/admin/:id', adminAuth, validatePost, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array().map(err => ({
          field: err.path,
          message: err.msg
        }))
      });
    }
    
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }
    
    const { title, content, excerpt, category, tags, status, coverImage, featured } = req.body;
    
    post.title = title;
    post.content = content;
    post.excerpt = excerpt || post.excerpt;
    post.category = category || post.category;
    post.tags = tags || post.tags;
    post.status = status || post.status;
    post.coverImage = coverImage !== undefined ? coverImage : post.coverImage;
    post.featured = featured !== undefined ? featured : post.featured;
    
    await post.save();
    
    res.json({
      success: true,
      message: 'Post updated successfully',
      data: post
    });
    
  } catch (error) {
    console.error('Update post error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update post'
    });
  }
});

/**
 * @route   DELETE /api/posts/admin/:id
 * @desc    Delete post (admin)
 * @access  Private
 */
router.delete('/admin/:id', adminAuth, async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Post deleted successfully'
    });
    
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete post'
    });
  }
});

/**
 * @route   POST /api/posts/admin/auth
 * @desc    Verify admin password
 * @access  Public
 */
router.post('/admin/auth', (req, res) => {
  const { password } = req.body;
  
  if (password === process.env.ADMIN_PASSWORD) {
    res.json({
      success: true,
      message: 'Authentication successful'
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Invalid password'
    });
  }
});

module.exports = router;
