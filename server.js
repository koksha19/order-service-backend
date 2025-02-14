require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const connectDb = require('./config/connectDb');
const setupSwagger = require('./docs/swagger');
const mainRoutes = require('./routes/mainRoutes');

const app = express();

const PORT = process.env.PORT || 8080;

connectDb();
setupSwagger(app);

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use(mainRoutes);

mongoose.connection.once('open', () => {
  console.log('Connected to the database successfully');
  app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
});
