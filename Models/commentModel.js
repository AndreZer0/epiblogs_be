/** @format */

const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },

  content: {
    type: String,
    required: true,
  },

  code: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'blogsModel',
  },
});

module.exports = mongoose.model('commentModel', CommentSchema, 'comment');
