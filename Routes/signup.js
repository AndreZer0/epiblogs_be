/** @format */

const express = require('express');
const signup = express.Router();
const AuthorsModel = require('../Models/authors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

signup.post('/signup', async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    const existingUser = await AuthorsModel.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email già in uso' });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new AuthorsModel({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();

    const token = jwt.sign(
      {
        id: savedUser._id,
        firstName: savedUser.firstName,
        lastName: savedUser.lastName,
        email: savedUser.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '24h',
      }
    );

    res.status(201).json({ message: 'Registrazione riuscita', token });
  } catch (error) {
    console.error('Errore durante la registrazione:', error);
    res.status(500).json({ message: 'Errore durante la registrazione' });
  }
});

module.exports = signup;
