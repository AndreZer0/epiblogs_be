/** @format */

const express = require('express');
const logger = require('../middleware/logger');
const authors = express.Router();
const AuthorsModel = require('../Models/authors');
const BlogsModel = require('../Models/blogs');
const bcrypt = require('bcrypt');

//Autori totali
authors.get('/authors', async (req, res) => {
  try {
    const author = await AuthorsModel.find();

    res.status(200).send({
      statusCode: 200,
      message: 'Ecco i tuoi autori',
      author,
    });
  } catch (error) {
    res.status(500).send({
      statusCode: 500,
      message: 'Errore incredibile',
    });
  }
});

//Creazione di un nuovo autore
authors.post('/authors/create', logger, async (req, res) => {
  const salt = await bcrypt.genSalt(10);

  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  const newAuthor = await AuthorsModel({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: hashedPassword,
    birth: req.body.birth,
    avatar: req.body.avatar,
  });
  try {
    const author = await newAuthor.save();
    res.status(201).send({
      statusCode: 201,
      payload: author,
      message: 'Autore aggiunto con successo',
    });
  } catch (error) {
    console.error("Errore durante il salvataggio dell'autore:", error);
    res.status(500).send({
      statusCode: 500,
      message: 'Errore nell aggiunta di un utente',
    });
  }
});

//Autore singolo tramite id
authors.get('/authors/byId/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const authorExists = await AuthorsModel.findById(id);
    if (!authorExists) {
      return res.status(404).send({
        statusCode: 404,
        message: 'Autore non trovato',
      });
    }

    res.status(200).send({
      statusCode: 200,
      message: "Ecco l'autore",
      authorExists,
    });
  } catch (error) {
    res.status(500).send({
      statusCode: 500,
      message: "Errore nella ricerca dell'autore",
    });
  }
});

//Modifica di un autore tramite id
authors.put('/authors/modify/:id', async (req, res) => {
  const { id } = req.params;
  const authorExists = await AuthorsModel.findById(id);
  if (!authorExists) {
    res.status(404).send({
      statusCode: 404,
      message: 'Autore non trovato',
    });
  }
  try {
    const authorUpdate = req.body;
    const options = { new: true };
    const result = await AuthorsModel.findByIdAndUpdate(
      id,
      authorUpdate,
      options
    );
    res.status(200).send({
      statusCode: 200,
      message: 'Autore  trovato',
      result,
    });
  } catch (error) {
    res.status(500).send({
      statusCode: 500,
      message: 'Errore incredibile',
    });
  }
});

//Cancellazione di un autore tramite id
authors.delete('/authors/delete/:id', async (req, res) => {
  const { id } = req.params;
  const author = await AuthorsModel.findByIdAndDelete(id);
  if (!author) {
    return res.status(404).send({
      statusCode: 404,
      message: 'Autore non trovato',
    });
  }
  res.status(200).send({
    statusCode: 200,
    message: 'Autore eliminato',
  });
});

//Prendo i post  di un autore tramite id
authors.get('/authors/:id/posts', async (req, res) => {
  const { id } = req.params;
  const authorsPosts = await BlogsModel.findById(id);
  if (!authorsPosts || posts.length === 0) {
    res.status(404).send({
      statusCode: 404,
      message: 'Nessun post per questo autore',
    });
  }

  try {
    const foundAuthor = await BlogsModel.find().populate('blog');
    res.status(200).send({
      statusCode: 200,
      message: "Post dell'autore recuperati",
      foundAuthor,
    });
  } catch (e) {
    res.status(500).send({
      statusCode: 500,
      message: 'Errore interno',
      error: e,
    });
  }
});

module.exports = authors;
