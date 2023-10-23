/** @format */

const express = require('express');
const comments = express.Router();
const CommentsModel = require('../Models/commentModel');
const BlogsModel = require('../Models/blogs');

//Commenti a un singolo post
comments.get('/blogPosts/:id/comments', async (req, res) => {
  const { id } = req.params;
  try {
    const comm = await CommentsModel.find({ code: id }).populate('code');
    if (!comm) {
      res.status(404).send({
        statusCode: 404,
        message: 'Commento non trovato',
      });
    }

    res.status(200).send({
      comm,
    });
  } catch (error) {
    res.status(500).send({
      statusCode: 500,
      message: 'Errore nel caricamento dei commenti',
    });
  }
});

// Commento singolo a un post (entrambi con ID)
comments.get('/blogPosts/:postId/comments/:commentId', async (req, res) => {
  const { postId, commentId } = req.params;
  try {
    const comment = await CommentsModel.findById(commentId).populate('code');

    if (!comment) {
      return res.status(404).send({
        statusCode: 404,
        message: 'Commento non trovato',
      });
    }

    const post = await BlogsModel.findById(postId);

    if (!post) {
      return res.status(404).send({
        statusCode: 404,
        message: 'Post non trovato',
      });
    }

    if (!comment.code.equals(postId)) {
      console.log('Questo post non ha commenti');
    }

    res.status(200).send({
      post,
      comment,
    });
  } catch (error) {
    res.status(500).send({
      statusCode: 500,
      message: 'Errore nel caricamento del commento o del post',
    });
  }
});

//Creazione di un commento
comments.post('/blogPosts/:id/comment/create', async (req, res) => {
  const { id } = req.params;

  try {
    const newComment = new CommentsModel({
      username: req.body.username,
      content: req.body.content,

      code: id,
    });
    const comm = await newComment.save();
    res.status(201).send({
      statusCode: 201,
      payload: comm,
      message: 'Commento aggiunto con successo',
    });
  } catch (error) {
    res.status(500).send({
      statusCode: 500,
      message: 'Impossibile aggiungere il commento',
    });
  }
});

//Modifica di un commento tramite id
comments.put('/blogPosts/:id/comments/:commentId/modify', async (req, res) => {
  const { id, commentId } = req.params;
  const updateData = req.body;

  try {
    const comment = await CommentsModel.findByIdAndUpdate(
      commentId,
      updateData,
      { new: true }
    );
    if (!comment) {
      return res.status(404).send({
        statusCode: 404,
        message: 'Commento non trovato',
      });
    }

    res.status(200).send({
      comment,
    });
  } catch (error) {
    res.status(500).send({
      statusCode: 500,
      message: "Errore nell'aggiornamento del commento",
    });
  }
});

//Cancellazione di un commento tramite id
comments.delete(
  '/blogPosts/:id/comments/:commentId/delete',
  async (req, res) => {
    const { id, commentId } = req.params;
    const comm = await CommentsModel.findByIdAndDelete(commentId);
    if (!comm) {
      return res.status(404).send({
        statusCode: 404,
        message: 'Commento non trovato',
      });
    }
    res.status(200).send({
      statusCode: 200,
      message: 'Post eliminato',
    });
  }
);

module.exports = comments;
