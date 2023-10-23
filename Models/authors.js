/** @format */

const mongoose = require('mongoose');

const AuthorsSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    blog: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'blogsModel',
    },
    birth: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      required: false,
    },
  },
  { timestamps: true, strict: true }
);

module.exports = mongoose.model('authorsModel', AuthorsSchema, 'authors');
