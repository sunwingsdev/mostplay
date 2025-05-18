const express = require('express');


const FavoritesPoster = require('../../../model/favoritesPoster.model');
const FeaturedGames = require('../../../model/FeaturedGames.model');
const sendResponse = require('../../../utils/responseHandler');









  // FavoritesPoster CRUD Operations
const getFavoritesPoster = async (req, res) => {

    try {
      const poster = await FavoritesPoster.findOne();
      if (!poster) {
        return sendResponse(res, 404, false, 'Favorites Poster not found');
      }
      return sendResponse(res, 200, true, 'Favorites Poster retrieved successfully', poster);
    } catch (error) {
      return sendResponse(res, 500, false, 'Server error: ' + error.message);
    }
  };
  
  const updateFavoritesPoster = async (req, res) => {
    try {
      const { title, titleBD, images } = req.body;
      const poster = await FavoritesPoster.findOneAndUpdate(
        {},
        { title, titleBD, images },
        { new: true, runValidators: true }
      );
      if (!poster) {
        return sendResponse(res, 404, false, 'Favorites Poster not found');
      }
      return sendResponse(res, 200, true, 'Favorites Poster updated successfully', poster);
    } catch (error) {
      return sendResponse(res, 500, false, 'Server error: ' + error.message);
    }
  };
  
  const deleteFavoritesPosterImage = async (req, res) => {
    try {
      const { imageUrl } = req.params;
      const poster = await FavoritesPoster.findOne();
      if (!poster) {
        return sendResponse(res, 404, false, 'Favorites Poster not found');
      }
      poster.images = poster.images.filter(url => url !== decodeURIComponent(imageUrl));
      await poster.save();
      return sendResponse(res, 200, true, 'Image deleted successfully', poster);
    } catch (error) {
      return sendResponse(res, 500, false, 'Server error: ' + error.message);
    }
  };
  
  // FeaturedGames CRUD Operations
  const getFeaturedGames = async (req, res) => {
    try {
      const games = await FeaturedGames.findOne();
      if (!games) {
        return sendResponse(res, 404, false, 'Featured Games not found');
      }
      return sendResponse(res, 200, true, 'Featured Games retrieved successfully', games);
    } catch (error) {
      return sendResponse(res, 500, false, 'Server error: ' + error.message);
    }
  };
  
  const updateFeaturedGames = async (req, res) => {
    try {
      const { title, titleBD, items } = req.body;
      const games = await FeaturedGames.findOneAndUpdate(
        {},
        { title, titleBD, items },
        { new: true, runValidators: true }
      );
      if (!games) {
        return sendResponse(res, 404, false, 'Featured Games not found');
      }
      return sendResponse(res, 200, true, 'Featured Games updated successfully', games);
    } catch (error) {
      return sendResponse(res, 500, false, 'Server error: ' + error.message);
    }
  };
  
  const addFeaturedGameItem = async (req, res) => {
    try {
      const { image, title, titleBD, link } = req.body;
      const games = await FeaturedGames.findOne();
      if (!games) {
        return sendResponse(res, 404, false, 'Featured Games not found');
      }
      games.items.push({ image, title, titleBD, link });
      await games.save();
      return sendResponse(res, 200, true, 'Game item added successfully', games);
    } catch (error) {
      return sendResponse(res, 500, false, 'Server error: ' + error.message);
    }
  };
  
  const updateFeaturedGameItem = async (req, res) => {
    try {
      const { itemId } = req.params;
      const { image, title, titleBD, link } = req.body;
      const games = await FeaturedGames.findOne();
      if (!games) {
        return sendResponse(res, 404, false, 'Featured Games not found');
      }
      const itemIndex = games.items.findIndex(item => item._id.toString() === itemId);
      if (itemIndex === -1) {
        return sendResponse(res, 404, false, 'Game item not found');
      }
      games.items[itemIndex] = { ...games.items[itemIndex], image, title, titleBD, link };
      await games.save();
      return sendResponse(res, 200, true, 'Game item updated successfully', games);
    } catch (error) {
      return sendResponse(res, 500, false, 'Server error: ' + error.message);
    }
  };
  
  const removeFeaturedGameItem = async (req, res) => {
    try {
      const { itemId } = req.params;
      const games = await FeaturedGames.findOne();
      if (!games) {
        return sendResponse(res, 404, false, 'Featured Games not found');
      }
      games.items.pull({ _id: itemId });
      await games.save();
      return sendResponse(res, 200, true, 'Game item removed successfully', games);
    } catch (error) {
      return sendResponse(res, 500, false, 'Server error: ' + error.message);
    }
  };
  


module.exports = {
  getFavoritesPoster,
  updateFavoritesPoster,
  getFeaturedGames,
  updateFeaturedGames,
  addFeaturedGameItem,
  removeFeaturedGameItem,
  updateFeaturedGameItem,
  deleteFavoritesPosterImage
};
