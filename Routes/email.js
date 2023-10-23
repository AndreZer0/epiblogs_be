/** @format */

const express = require('express');
const { createTransport } = require('nodemailer');
const email = express.Router();

const transporter = createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
    user: 'jaime.johns@ethereal.email',
    pass: 'aFAKbZ4Uh8U9qnCty4',
  },
});

email.post('/send-email', async (req, res) => {
  const { subject, text } = req.body;
  const mailOptions = {
    from: 'noreply@Templeofhorror.com',
    to: 'jaime.johns@ethereal.email',
    subject,
    text,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.status(500).send('Error sending mail');
    } else {
      console.log('email sent');
      res.status(200).send('Email sent successfully!');
    }
  });
});

module.exports = email;
