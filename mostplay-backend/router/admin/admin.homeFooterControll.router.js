const express = require('express');
const { getFavoritesPoster, updateFavoritesPoster, getFeaturedGames, updateFeaturedGames, addFeaturedGameItem, removeFeaturedGameItem, updateFeaturedGameItem, deleteFavoritesPosterImage } = require('../../controller/frontend/frontendFooterController/frontendFooterController');

const adminHomeFooterControlRouter = express.Router();
// Routes
adminHomeFooterControlRouter
  .route('/favorites-poster')
  .get(getFavoritesPoster)
  .put(updateFavoritesPoster);

adminHomeFooterControlRouter
  .route('/favorites-poster/image/:imageUrl')
  .delete(deleteFavoritesPosterImage);

adminHomeFooterControlRouter
  .route('/featured-games')
  .get(getFeaturedGames)
  .put(updateFeaturedGames);

adminHomeFooterControlRouter
  .route('/featured-games/item')
  .post(addFeaturedGameItem);

adminHomeFooterControlRouter
  .route('/featured-games/item/:itemId')
  .put(updateFeaturedGameItem)
  .delete(removeFeaturedGameItem);





module.exports = adminHomeFooterControlRouter;
