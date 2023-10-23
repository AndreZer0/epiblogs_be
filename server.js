/** @format */

const express = require('express');
const mongoose = require('mongoose');
const authorsRoute = require('./Routes/authors');
const blogsRoute = require('./Routes/blogPosts');
const commentRoute = require('./Routes/comment');
const loginRoute = require('./Routes/login');
const githubRoute = require('./Routes/github');
const emailRoute = require('./Routes/email');
const signupRoute = require('./Routes/signup');
const cors = require('cors');
const path = require('path');
const PORT = 5050;
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/', authorsRoute);
app.use('/', blogsRoute);
app.use('/', commentRoute);
app.use('/', loginRoute);
app.use('/', githubRoute);
app.use('/', emailRoute);
app.use('/', signupRoute);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Database sucesfully re connected');
});
app.listen(PORT, () => {
  console.log(`Server is running ON port:  ${PORT}`);
});
