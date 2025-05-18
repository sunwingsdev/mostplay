const mongoose = require('mongoose');

// FavoritesPoster Schema
const favoritesPosterSchema = new mongoose.Schema({
  title: { type: String, required: true },
  titleBD: { type: String, required: true },
  images: [{ type: String }], // Array of image URLs
}, { timestamps: true });

const FavoritesPoster = mongoose.model('FavoritesPoster', favoritesPosterSchema);

// Initialize single document if not exists
const initializeFavoritesPoster = async () => {
  try {
    const count = await FavoritesPoster.countDocuments();
    if (count === 0) {
      await FavoritesPoster.create({
        title: 'Default Favorites Poster',
        titleBD: 'ডিফল্ট ফেভারিট পোস্টার',
        images: []
      });
    }
  } catch (error) {
    console.error('Error initializing FavoritesPoster:', error);
  }
};

// Call initialization
initializeFavoritesPoster();

module.exports = FavoritesPoster;