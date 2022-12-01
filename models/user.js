const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { isEmail } = require('validator');
const Error401 = require('../errors/Error401');
const { errorMessage } = require('../constants');

const { Schema } = mongoose;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (data) => isEmail(data), message: 'Incorrect email',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
}, { versionKey: false });

// Функция проверки email и пароля
userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        // Отклоняем промис если такого пользователя не нашли
        return Promise.reject(new Error401(errorMessage.errorAuth));
      }

      return bcrypt.compare(password, user.password) // Сравниваем пароль
        .then((matched) => {
          if (!matched) {
          // Отклоняем промис при неверном пароле
            return Promise.reject(new Error401(errorMessage.errorAuth));
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
