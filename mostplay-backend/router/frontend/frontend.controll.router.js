const express = require('express');
const { getAllCarouselImages, getAllNotices, getNavBarWithMenuAndSubmenu, getFullGameNavBar, getAllPromotionsWithSubMenu, getAllDepositPaymentMethods, createPaymentTransaction, getPaymentTransactionById, getUserPaymentTransactions, createWithdrawPaymentTransaction, getWithdrawPaymentTransactionById, getUserWithdrawPaymentTransactions, getWithdrawPaymentMethods, getGameById, createTheme, getThemes, updateTheme, deleteTheme } = require('../../controller/frontend/frontendPageController/frontendPage.controller');
const { getFavoritesPoster, updateFavoritesPoster, deleteFavoritesPosterImage, getFeaturedGames, updateFeaturedGames, addFeaturedGameItem, updateFeaturedGameItem, removeFeaturedGameItem } = require('../../controller/frontend/frontendFooterController/frontendFooterController');


const frontendHomeControlRouter = express.Router();


frontendHomeControlRouter.get('/homeCarousel', getAllCarouselImages);

frontendHomeControlRouter.get('/notice', getAllNotices);

frontendHomeControlRouter.get('/game-nav-menu', getNavBarWithMenuAndSubmenu);

frontendHomeControlRouter.get('/game-section', getFullGameNavBar);

frontendHomeControlRouter.get('/promotions', getAllPromotionsWithSubMenu);


frontendHomeControlRouter.get('/deposit-payment-method',getAllDepositPaymentMethods);


frontendHomeControlRouter.post('/payment-transactions', createPaymentTransaction);

frontendHomeControlRouter.get('/payment-transactions/:id', getPaymentTransactionById);

frontendHomeControlRouter.get('/payment-transactions/user/:userId', getUserPaymentTransactions);


frontendHomeControlRouter.get('/withdraw-payment-method',getWithdrawPaymentMethods);


frontendHomeControlRouter.post('/withdraw-payment-transactions', createWithdrawPaymentTransaction);
frontendHomeControlRouter.get('/withdraw-payment-transactions/:id', getWithdrawPaymentTransactionById);
frontendHomeControlRouter.get('/withdraw-payment-transactions/user/:userId', getUserWithdrawPaymentTransactions);



frontendHomeControlRouter.route('/game/:id')
  .get(getGameById);



// FavoritesPoster Routes
frontendHomeControlRouter.get('/favorites-poster', getFavoritesPoster);
frontendHomeControlRouter.put('/favorites-poster', updateFavoritesPoster);
frontendHomeControlRouter.delete('/favorites-poster/image/:imageUrl', deleteFavoritesPosterImage);

// FeaturedGames Routes
frontendHomeControlRouter.get('/featured-games', getFeaturedGames);
frontendHomeControlRouter.put('/featured-games', updateFeaturedGames);
frontendHomeControlRouter.post('/featured-games/item', addFeaturedGameItem);
frontendHomeControlRouter.put('/featured-games/item/:itemId', updateFeaturedGameItem);
frontendHomeControlRouter.delete('/featured-games/item/:itemId', removeFeaturedGameItem);



// * ============================ frontend side controller start ================

// CRUD Routes
frontendHomeControlRouter.post('/admin-home-control', createTheme); // Create new theme
frontendHomeControlRouter.get('/admin-home-control', getThemes); // Get all themes
frontendHomeControlRouter.put('/admin-home-control/:id', updateTheme); // Update theme by ID
frontendHomeControlRouter.delete('/admin-home-control/:id', deleteTheme); // Delete theme by ID








module.exports = frontendHomeControlRouter;

