const mongoose = require('mongoose');

// FeaturedGames Schema
const featuredGamesSchema = new mongoose.Schema({
  title: { type: String, required: true },
  titleBD: { type: String, required: true },
  items: [{
    image: { type: String, required: true },
    title: { type: String, required: true },
    titleBD: { type: String, required: true },
    link: { type: String, required: true }
  }],
}, { timestamps: true });

const FeaturedGames = mongoose.model('FeaturedGames', featuredGamesSchema);

// Initialize single document if not exists
const initializeFeaturedGames = async () => {
  try {
    const count = await FeaturedGames.countDocuments();
    if (count === 0) {
      await FeaturedGames.create({
        title: 'Default Featured Games',
        titleBD: 'ডিফল্ট ফিচারড গেমস',
        items: []
      });
    }
  } catch (error) {
    console.error('Error initializing FeaturedGames:', error);
  }
};

// Call initialization
initializeFeaturedGames();

module.exports = FeaturedGames;