const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200,
  },
  content: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  tags: {
    type: [String], // Array of strings to store tags related to the article
    default: [],
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'], // Article status
    default: 'published',
  },
  views: {
    type: Number,
    default: 0, // Initialize view count to 0
  },
  likesCount: {
    type: Number,
    default: 0, // Initialize like count to 0
  },
  likedBy: {
    type: [String],
    
  },
  comments: {
    type: [String],
    
  },
},
{ timestamps: true }
);



module.exports = mongoose.model('Article', articleSchema);
