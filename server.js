require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');

const connectDb = require('./config/connectDb');
const setupSwagger = require('./docs/swagger');
const mainRoutes = require('./routes/mainRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

const PORT = process.env.PORT || 8080;

connectDb();
setupSwagger(app);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images');
  },
  filename: function (req, file, cb) {
    cb(null, Math.random() * 100000 + '-' + file.originalname);
  },
});

app.use(express.json());
app.use(multer({ storage: storage }).single('image'));
app.use('/images', express.static(path.join(__dirname, 'public', 'images')));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use(mainRoutes);
app.use(adminRoutes);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, statusCode: status, data: data });
});

mongoose.connection.once('open', () => {
  console.log('Connected to the database successfully');
  app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
});
