const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  type: { type: String, enum: ['article', 'video'], default: 'article' },
  videoUrl: String, 
  thumbnailColor: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Blog', blogSchema);