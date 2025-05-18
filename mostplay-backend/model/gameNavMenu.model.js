const mongoose = require('mongoose');

const SubOptionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  image: { type: String, required: true },
  titleBD: { type: String, required: true },
  parentMenuOption: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuOption' }
});

const MenuOptionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  titleBD: { type: String, required: true },
  image: { type: String, required: true }
});

const GameNavBarSchema = new mongoose.Schema({
  gameBoxMarginTop: { type: String, default: '20px' },
  gameNavMenuMarginBottom: { type: String, default: '10px' },
  headerBgColor: { type: String, default: '#222' },
  headerMarginBottom: { type: String, default: '15px' },
  headerMenuBgColor: { type: String, default: '#333' },
  headerMenuBgHoverColor: { type: String, default: '#444' },
  subOptionBgHoverColor: { type: String, default: '#555' },
  menuOptions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MenuOption' }]
});

module.exports = {
  GameNavBar: mongoose.model('GameNavBar', GameNavBarSchema),
  MenuOption: mongoose.model('MenuOption', MenuOptionSchema),
  SubOption: mongoose.model('SubOption', SubOptionSchema)
};