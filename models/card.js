import { Schema, model } from 'mongoose';

const cardSchema = new Schema({
  name: {
    required: true,
    type: String,
    minlength: 2,
    maxlength: 30,
  },

  link: {
    required: true,
    type: String,
  },

  owner: {
    required: true,
    type: Schema.Types.ObjectId,
    ref: 'user',
  },

  likes: [{
    type: Schema.Types.ObjectId,
    default: [],
    ref: 'user',
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },

});

export default model('card', cardSchema);
