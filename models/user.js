const mongoose = require('mongoose');
const validator = require('validator');

const { regExpUrl } = require('../utils/consts');

const userSchema = new mongoose.Schema({
  name: {
    default: 'Жак-Ив Кусто',
    type: String,
    minlength: [2, 'Минимальная длина поля "name" - 2'],
    maxlength: [30, 'Максимальная длина поля "name" - 30'],
  },

  about: {
    default: 'Исследователь',
    type: String,
    minlength: [2, 'Минимальная длина поля "about" - 2'],
    maxlength: [30, 'Максимальная длина поля "about" - 30'],
  },

  avatar: {
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    type: String,
    match: regExpUrl,
  },

  email: {
    required: [true, 'Поле "email" должно быть заполнено'],
    unique: true,
    type: String,
    validate: {
      validator: (v) => validator.isEmail(v),
      message: 'Введите корректный E-mail',
    },
  },

  password: {
    required: [true, 'Поле "password" должно быть заполнено'],
    type: String,
    select: false,
  },
});

userSchema.methods.toJSON = function toJSON() {
  const user = this.toObject();
  delete user.password;
  return user;
};

module.exports = mongoose.model('user', userSchema);
