const mongoose = require('mongoose');

// Schéma de notre objet Sauce
const sauceSchema = mongoose.Schema({
  name: { type: String, required: true },
  manufacturer: { type: String, required: true },
  description: { type: String, required: true },
  mainPepper: { type: String, required: true },
  heat: { type: Number, required: true },
  userId: { type: String, required: true },
  imageUrl: { type: String, required: true },
  likes:{ type: Number },
  dislikes: { type: Number },
  usersLiked: { type: Array },
  usersDisliked: { type: Array },
});

module.exports = mongoose.model('Sauce', sauceSchema);