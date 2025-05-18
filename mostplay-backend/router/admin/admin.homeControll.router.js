const express = require('express');

const adminAuthMiddleware = require('../../middleware/admin.auth.middleware');
const { getAllCarouselImages, updateCarouselImage, getAllNotices, updateNotice, seedGameNavBar, getAllNavbars, getAllGameNavBar, createGameNavBar, updateGameNavBar, getByIdGameNavBar, removeGameNavBar, getAllGames, createGame, getGameById, updateGame, deleteGame, createPromotion, getAllPromotions, updatePromotion, deletePromotion, createDepositPaymentMethod, getAllDepositPaymentMethods, getDepositPaymentMethodById, updateDepositPaymentMethod, deleteDepositPaymentMethod, createWithdrawPaymentMethod, getAllWithdrawPaymentMethods, getWithdrawPaymentMethodById, updateWithdrawPaymentMethod, deleteWithdrawPaymentMethod, createTheme, getThemes, updateTheme, deleteTheme } = require('../../controller/frontend/frontendPageController/frontendPage.controller');
const { getAllDepositTransactions, createDepositTransaction, updateDepositTransaction, deleteDepositTransaction, getDepositTransactionsByUserId, getAllUsers, searchDepositTransactions, getDepositTransactionById, getAllWithdrawTransactions, createWithdrawTransaction, getWithdrawTransactionById, updateWithdrawTransaction, deleteWithdrawTransaction, getWithdrawTransactionsByUserId, searchWithdrawTransactions } = require('../../controller/admin/adminUserTransaction.controller');


const adminHomeControlRouter = express.Router();


adminHomeControlRouter.get('/homeCarousel',  adminAuthMiddleware, getAllCarouselImages);


adminHomeControlRouter.put('/homeCarousel/:id', adminAuthMiddleware, updateCarouselImage);

adminHomeControlRouter.get('/notice', adminAuthMiddleware, getAllNotices);

adminHomeControlRouter.put('/notice', adminAuthMiddleware, updateNotice);


adminHomeControlRouter.put('/notice', adminAuthMiddleware, updateNotice);


adminHomeControlRouter.post('/seed-game-nav', seedGameNavBar);




// SEED
//adminHomeControlRouter.get('/navbar/seed', seedGameNavBar);

// CRUD
// Navbar Routes
adminHomeControlRouter.get('/navbar', adminAuthMiddleware, getAllNavbars); // Get all navbars

//  Resource-based CRUD routes
// Navbar routes (no :id needed)
adminHomeControlRouter.route('/navbar')
  .get(adminAuthMiddleware, getAllGameNavBar('GameNavBar'))
  .post(adminAuthMiddleware, createGameNavBar('GameNavBar'))
  .put(adminAuthMiddleware, updateGameNavBar('GameNavBar'));

// Menu routes
adminHomeControlRouter.route('/menu')
  .get(adminAuthMiddleware, getAllGameNavBar('MenuOption'))
  .post(adminAuthMiddleware, createGameNavBar('MenuOption'));

adminHomeControlRouter.route('/menu/:id')
  .get(adminAuthMiddleware, getByIdGameNavBar('MenuOption'))
  .put(adminAuthMiddleware, updateGameNavBar('MenuOption'))
  .delete(adminAuthMiddleware, removeGameNavBar('MenuOption'));

// Submenu routes
adminHomeControlRouter.route('/submenu')
  .get(adminAuthMiddleware, getAllGameNavBar('SubOption'))
  .post(adminAuthMiddleware, createGameNavBar('SubOption'));

adminHomeControlRouter.route('/submenu/:id')
  .get(adminAuthMiddleware, getByIdGameNavBar('SubOption'))
  .put(adminAuthMiddleware, updateGameNavBar('SubOption'))
  .delete(adminAuthMiddleware, removeGameNavBar('SubOption'));


// * ========== game section  ========== //
adminHomeControlRouter.route('/game')
  .get(getAllGames)
  .post(createGame);

adminHomeControlRouter.route('/game/:id')
  .get(getGameById)
  .put(updateGame)
  .delete(deleteGame);


  // * ========== deposit payment getaway create ========== //

adminHomeControlRouter.post('/deposit-payment-method', adminAuthMiddleware, createDepositPaymentMethod);
adminHomeControlRouter.get('/deposit-payment-method', adminAuthMiddleware, getAllDepositPaymentMethods);
adminHomeControlRouter.get('/deposit-payment-method/:id', adminAuthMiddleware, getDepositPaymentMethodById);
adminHomeControlRouter.put('/deposit-payment-method/:id', adminAuthMiddleware, updateDepositPaymentMethod);
adminHomeControlRouter.delete('/deposit-payment-method/:id', adminAuthMiddleware, deleteDepositPaymentMethod);


  // * ========== promotion section  ========== //

adminHomeControlRouter.route('/promotion')
  .get(adminAuthMiddleware, getAllPromotions)
  .post(adminAuthMiddleware, createPromotion);

adminHomeControlRouter.route('/promotion/:id')
  .put(adminAuthMiddleware, updatePromotion)
  .delete(adminAuthMiddleware, deletePromotion);




  // * ========== Deposit Transaction Routes
adminHomeControlRouter.route('/deposit-transaction')
.get(adminAuthMiddleware, getAllDepositTransactions)
.post(adminAuthMiddleware, createDepositTransaction);

adminHomeControlRouter.route('/deposit-transaction/:id')
  .get(adminAuthMiddleware, getDepositTransactionById) // Missing in your provided router
  .put(adminAuthMiddleware, updateDepositTransaction)
  .delete(adminAuthMiddleware, deleteDepositTransaction);
adminHomeControlRouter.get('/deposit-transaction/:userId', adminAuthMiddleware, getDepositTransactionsByUserId);


//adminHomeControlRouter.get('/users', adminAuthMiddleware, getAllUsers);


adminHomeControlRouter.get('/deposit-search-transaction/search', adminAuthMiddleware, searchDepositTransactions);



// * ================ admin withdraw transaction ================ //

// Withdraw Transaction Routes
adminHomeControlRouter.route('/withdraw-transaction')
  .get(adminAuthMiddleware, getAllWithdrawTransactions)
  .post(adminAuthMiddleware, createWithdrawTransaction);

adminHomeControlRouter.route('/withdraw-transaction/:id')
  .get(adminAuthMiddleware, getWithdrawTransactionById)
  .put(adminAuthMiddleware, updateWithdrawTransaction)
  .delete(adminAuthMiddleware, deleteWithdrawTransaction);

adminHomeControlRouter.get('/withdraw-transaction/:userId', adminAuthMiddleware, getWithdrawTransactionsByUserId);

adminHomeControlRouter.get('/withdraw-search-transaction/search', adminAuthMiddleware, searchWithdrawTransactions);



// * ========== withdraw payment getaway create ========== //

adminHomeControlRouter.post('/withdraw-payment-method', adminAuthMiddleware, createWithdrawPaymentMethod);
adminHomeControlRouter.get('/withdraw-payment-method', adminAuthMiddleware, getAllWithdrawPaymentMethods);
adminHomeControlRouter.get('/withdraw-payment-method/:id', adminAuthMiddleware, getWithdrawPaymentMethodById);
adminHomeControlRouter.put('/withdraw-payment-method/:id', adminAuthMiddleware, updateWithdrawPaymentMethod);
adminHomeControlRouter.delete('/withdraw-payment-method/:id', adminAuthMiddleware, deleteWithdrawPaymentMethod);



// * ============================ frontend side controller start ================

// CRUD Routes
adminHomeControlRouter.post('/admin-home-control', createTheme); // Create new theme
adminHomeControlRouter.get('/admin-home-control', getThemes); // Get all themes
adminHomeControlRouter.put('/admin-home-control/:id', updateTheme); // Update theme by ID
adminHomeControlRouter.delete('/admin-home-control/:id', deleteTheme); // Delete theme by ID








module.exports = adminHomeControlRouter;

