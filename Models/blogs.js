/** @format */

const mongoose = require('mongoose');

const BlogsSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    cover: {
      type: String,
      required: true,
      default:
        'https://img.freepik.com/premium-photo/three-wooden-cubes-with-letters-blog-bright-surface-gray-table-inscription-cubes-is-reflected-from-surface-table-business-concept_384017-3231.jpg',
    },
    readTime: {
      value: {
        type: Number,
        required: true,
      },
      unit: {
        type: String,
        required: true,
      },
    },
    author: {
      name: {
        type: String,
        required: true,
      },
      avatar: {
        type: String,
        required: true,
        default:
          'https://static.vecteezy.com/system/resources/previews/019/896/008/original/male-user-avatar-icon-in-flat-design-style-person-signs-illustration-png.png',
      },
    },
    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true, strict: true }
);

module.exports = mongoose.model('blogsModel', BlogsSchema, 'blogPosts');
