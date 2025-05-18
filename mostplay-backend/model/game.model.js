const mongoose = require('mongoose');

const GameSchema = new mongoose.Schema({
  name: { type: String, required: true },
  nameBD: { type: String, required: true },
  link: { type: String },
  image: { type: String, required: true },
  subOptions: { type: mongoose.Schema.Types.ObjectId, ref: 'SubOption' },
  gameApiKey: { type: String }
});

const GameModel = mongoose.model('Game', GameSchema);

module.exports = GameModel;