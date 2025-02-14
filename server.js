require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const connectDb = require('./config/connectDb');

const app = express();

const PORT = process.env.PORT || 8080;

connectDb();

app.use(express.json());

app.use((req, res) => {
  res.end('Hello World!');
});

mongoose.connection.once('open', () => {
  console.log('Connected to the database successfully');
  app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
});
