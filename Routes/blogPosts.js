/** @format */

const express = require('express');
const blogs = express.Router();
const BlogsModel = require('../Models/blogs');

const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
require('dotenv').config();

const crypto = require('crypto');

const verifyToken = require('../middleware/verifyToken');

//configurazione Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

//caricamento su cloudinary della cover
const cloudStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'coverdatabase',
    format: async (req, res) => 'png',
    public_id: (req, file) => file.name,
  },
});

//caricamento su cloudinary dell'avatar
const cloudStorageAvatar = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'coverdatabase',
    format: async (req, res) => 'png',
    public_id: (req, file) => file.name,
  },
});

//configurazione internal storage
const internalStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${crypto.randomUUID()}`;
    const fileExtension = file.originalname.split('.').pop();
    cb(null, `${file.fieldname}-${uniqueSuffix}.${fileExtension}`);
  },
});

const upload = multer({ storage: internalStorage });
const cloudUpload = multer({ storage: cloudStorage });
const cloudAvatar = multer({ storage: cloudStorageAvatar });

//Upload della cover di un post su Cloudinary
blogs.post(
  '/blogPosts/cloudUploads/cover',
  cloudUpload.single('cover'),
  async (req, res) => {
    try {
      res.status(200).json({ cover: req.file.path });
    } catch (error) {
      {
        res.status(500).send({
          statusCode: 500,
          message: 'Upload error',
        });
      }
    }
  }
);

//Upload dell'avatar un utente su Cloudinary
blogs.post(
  '/blogPosts/cloudUploads/avatar',
  cloudAvatar.single('author.avatar'),
  async (req, res) => {
    try {
      res.status(200).json({ avatar: req.file.path });
    } catch (error) {
      {
        res.status(500).send({
          statusCode: 500,
          message: 'Upload error',
        });
      }
    }
  }
);

//Upload della cover di un utente nella cartella locale
blogs.post('/blogPosts/uploads', upload.single('cover'), async (req, res) => {
  const url = `${req.protocol}://${req.get('host')}`;
  try {
    const imageUrl = req.file.filename;
    res.status(201).json({ cover: `${url}/uploads/${imageUrl}` });
  } catch (error) {
    res.status(500).send({
      statusCode: 500,
      message: 'Errore nel caricamento',
    });
  }
});

//Chiamata per ottenere tutti i post con impaginazione
blogs.get('/blogPosts', async (req, res) => {
  const { page = 1, pageSize = 3 } = req.query;
  try {
    const blog = await BlogsModel.find()
      .limit(pageSize)
      .skip((page - 1) * pageSize);

    const totalPosts = await BlogsModel.count();

    res.status(200).send({
      statusCode: 200,
      currentPage: Number(page),
      totalPages: Math.ceil(totalPosts / pageSize),
      totalPosts,
      blog,
    });
  } catch (error) {
    res.status(500).send({
      statusCode: 500,
      message: 'Upload error',
    });
  }
});

//Chiamata per ottenere tutti i post
blogs.get('/blogPosts/new', async (req, res) => {
  try {
    const blog = await BlogsModel.find();

    const totalPosts = BlogsModel;

    res.status(200).send({
      blog,
    });
  } catch (error) {
    res.status(500).send({
      statusCode: 500,
      message: 'Impossibile recuperare i post',
    });
  }
});

//Creazione di un nuovo post
blogs.post('/blogPosts/create', async (req, res) => {
  const newPost = await BlogsModel({
    category: req.body.category,
    title: req.body.title,
    cover: req.body.cover,
    readTime: { value: req.body.readTime.value, unit: req.body.readTime.unit },
    author: {
      name: req.body.author.name,
      avatar: req.body.author.avatar,
    },
    content: req.body.content,
  });

  try {
    const post = await newPost.save();
    res.status(201).send({
      statusCode: 201,
      payload: post,
      message: 'Post creato con successo',
    });
  } catch (error) {
    res.status(500).send({
      statusCode: 500,
      message: 'Impossibile creare  un post',
    });
  }
});

//Chiamata di un singolo post tramite id
blogs.get('/blogPosts/byId/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const postExists = await BlogsModel.findById(id);
    if (!postExists) {
      res.status(404).send({
        statusCode: 404,
        message: 'Post non trovato',
      });
    }

    res.status(200).send({
      statusCode: 200,
      message: 'Ecco il tuo post',
      postExists,
    });
  } catch (error) {
    res.status(500).send({
      statusCode: 500,
      message: 'Impossibile effettuare la ricerca',
    });
  }
});

//Modifica di un post tramite id
blogs.put('/blogPosts/modify/:id', async (req, res) => {
  const { id } = req.params;
  const postUpdate = req.body;
  try {
    const postExists = await BlogsModel.findById(id);

    if (!postExists) {
      return res.status(404).send({
        statusCode: 404,
        message: 'Post non trovato',
      });
    }

    const updatedPost = {};
    if (postUpdate.category) {
      updatedPost.category = postUpdate.category;
    }
    if (postUpdate.title) {
      updatedPost.title = postUpdate.title;
    }
    if (postUpdate.cover) {
      updatedPost.cover = postUpdate.cover;
    }
    if (postUpdate.readTime) {
      updatedPost.readTime = postUpdate.readTime;
    }
    if (postUpdate.author) {
      updatedPost.author = postUpdate.author;
    }
    if (postUpdate.content) {
      updatedPost.content = postUpdate.content;
    }

    const options = { new: true };
    const result = await BlogsModel.findByIdAndUpdate(id, updatedPost, options);

    res.status(200).send({
      statusCode: 200,
      message: 'Post trovato e aggiornato con successo',
      result,
    });
  } catch (error) {
    handleError(res, 500, 'Impossibile effettuare la ricerca', error);
  }
});

//Eliminazione di un post tramite id
blogs.delete('/blogPosts/delete/:id', async (req, res) => {
  const { id } = req.params;
  const postExists = await BlogsModel.findByIdAndDelete(id);
  if (!postExists) {
    return res.status(404).send({
      statusCode: 404,
      message: 'Post non trovato',
    });
  }
  res.status(200).send({
    statusCode: 200,
    message: 'Post eliminato',
  });
});

//Chiamata di un post tramite titolo(filtro per trovare solo il post con quella parola nel titolo)
blogs.get('/blogPosts/title', async (req, res) => {
  const { title } = req.query;
  try {
    const postExists = await BlogsModel.find({
      title: {
        $regex: title,
        $options: 'i',
      },
    });
    if (!postExists) {
      res.status(404).send({
        statusCode: 404,
        message: 'Post non trovato',
      });
    } else {
      res.status(200).send({
        statusCode: 200,
        message: 'Ecco il tuo post',
        postExists,
      });
    }
  } catch (error) {
    res.status(500).send({
      statusCode: 500,
      message: 'Impossibile effettuare la ricerca',
    });
  }
});

module.exports = blogs;
