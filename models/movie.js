const mongoose = require('mongoose');
const { isURL } = require('validator');

const { Schema, ObjectId } = mongoose;

const movieSchema = new Schema({
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator: (data) => isURL(data), message: 'Incorrect URL-adress',
    },
  },
  trailerLink: {
    type: String,
    required: true,
    validate: {
      validator: (data) => isURL(data), message: 'Incorrect URL-adress',
    },
  },
  thumbnail: {
    type: String,
    required: true,
    validate: {
      validator: (data) => isURL(data), message: 'Incorrect URL-adress',
    },
  },
  owner: {
    type: ObjectId,
    required: true,
    ref: 'user',
  },
  movieId: {
    type: Number,
    required: true,
  },
  nameRU: {
    type: String,
    required: true,
  },
  nameEN: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('movie', movieSchema);
