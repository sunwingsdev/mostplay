const mongoose  = require("mongoose");
const DepositPaymentMethod = require("../../../model/depositePayment.model");
const GameModel = require("../../../model/game.model");
const { GameNavBar, MenuOption, SubOption } = require("../../../model/gameNavMenu.model");
const HomeCarousel = require("../../../model/heroCarousel.model");
const Notice = require("../../../model/notice.model");
const PaymentTransaction = require("../../../model/paymentTransactionSchema");
const Promotion = require("../../../model/promotion.model");
const sendResponse = require("../../../utils/responseHandler");
const WithdrawPaymentMethod = require("../../../model/WithdrawPaymentMethod");
const WithdrawPaymentTransaction = require("../../../model/WithdrawPaymentTransaction");
const user_model = require("../../../model/user.model");
const ThemeModel = require("../../../model/ThemeModel");

// Get all carousel images
exports.getAllCarouselImages = async (req, res) => {
  try {
    let carousel = await HomeCarousel.findOne();
    if (!carousel) {
      carousel = await new HomeCarousel({
        images: [],
        isActive: true,
        interval: 2500,
        infiniteLoop: true,
        autoPlay: true,
      }).save();
    }
    sendResponse(res, 200, true, "Fetched carousel images successfully", carousel);
  } catch (error) {
    sendResponse(res, 500, false, error.message);
  }
};

// Update carousel
exports.updateCarouselImage = async (req, res) => {
  const { id } = req.params;
  const { images, isActive, interval, infiniteLoop, autoPlay } = req.body;


  try {
    const updatedCarousel = await HomeCarousel.findByIdAndUpdate(
      id,
      {
        images,
        isActive,
        interval,
        infiniteLoop,
        autoPlay,
      },
      { 
        new: true,
        runValidators: true 
      }
    );
    
    if (!updatedCarousel) {
      return sendResponse(res, 404, false, "Carousel not found");
    }
    
    sendResponse(res, 200, true, "Updated carousel successfully", updatedCarousel);
  } catch (error) {
    sendResponse(res, 500, false, error.message);
  }
};









// Get all notices
exports.getAllNotices = async (req, res) => {
  try {
    const notices = await Notice.find();
    sendResponse(res, 200, true, "Fetched all notices successfully", notices);
  } catch (error) {
    sendResponse(res, 500, false, error.message);
  }
};



// Update or create notice
exports.updateNotice = async (req, res) => {
  const { title, titleBD, emoji, active } = req.body;

  console.log(title, titleBD, emoji, active);
  


  try {
    const notice = await Notice.findOneAndUpdate(
      {}, // Match any (assuming single notice logic)
      { title, titleBD, emoji, active },
      {
        new: true,         // return the new doc after update
        runValidators: true,
        upsert: true       // create if not found
      }
    );


    sendResponse(res, 200, true, "Notice updated or created successfully", notice);
  } catch (error) {
    sendResponse(res, 500, false, error.message);
  }
};







// for seed

exports.seedGameNavBar = async (req, res) => {
  try {
    // Clear all existing data
    await GameNavBar.deleteMany({});
    await MenuOption.deleteMany({});
    await SubOption.deleteMany({});

    // Create MenuOptions
    const menu1 = await MenuOption.create({ title: 'Action Games', image: 'action.png' });
    const menu2 = await MenuOption.create({ title: 'Puzzle Games', image: 'puzzle.png' });

    // Create SubOptions for each menu
    await SubOption.insertMany([
      { title: 'Shooter', image: 'shooter.png', parentMenuOption: menu1._id },
      { title: 'Battle Royale', image: 'battle.png', parentMenuOption: menu1._id },
      { title: 'Sudoku', image: 'sudoku.png', parentMenuOption: menu2._id },
      { title: 'Matching', image: 'match.png', parentMenuOption: menu2._id }
    ]);

    // Create GameNavBar
    const navbar = await GameNavBar.create({
      name: 'Main Navbar',
      gameBoxMarginTop: '20px',
      gameNavMenuMarginBottom: '10px',
      headerBgColor: '#222',
      headerMarginBottom: '15px',
      headerMenuBgColor: '#333',
      headerMenuBgHoverColor: '#444',
      subOptionBgHoverColor: '#555',
      menuOptions: [menu1._id, menu2._id]
    });

    // Fetch GameNavBar with full nested structure
    const fullNav = await GameNavBar.findById(navbar._id)
      .populate({
        path: 'menuOptions',
        populate: {
          path: '_id', // this is just to ensure `.toObject()` works nicely
        }
      })
      .lean(); // Convert to plain JS object for manipulation

    // Attach subOptions inside each menuOption manually
    for (let option of fullNav.menuOptions) {
      const subOptions = await SubOption.find({ parentMenuOption: option._id });
      option.subOptions = subOptions;
    }

    res.status(201).json({
      message: 'GameNavBar seeded successfully with full nested structure',
      data: fullNav
    });
  } catch (err) {
    console.error('Seeding error:', err.message);
    res.status(500).json({
      error: 'Failed to seed GameNavBar',
      details: err.message
    });
  }
};








// GET all navbars
exports.getAllNavbars = async (req, res) => {
  try {
    const navbars = await GameNavBar.find()
      .populate({
        path: 'menuOptions',
        populate: {
          path: '_id'
        }
      })
      .lean();

    for (let nav of navbars) {
      for (let menu of nav.menuOptions) {
        const subs = await SubOption.find({ parentMenuOption: menu._id });
        menu.subOptions = subs;
      }
    }

    res.status(200).json(navbars);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};










// Navbar CRUD operations
exports.getAllNavbars = async (req, res) => {
  try {
    const navbars = await GameNavBar.find();
    res.status(200).json(navbars);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching navbars', error: err });
  }
};









const models = { GameNavBar, MenuOption, SubOption };

const handleError = (res, err, status = 500) => {
  res.status(status).json({ error: err.message || 'Server error' });
};

exports.getAllGameNavBar = (modelName) => async (req, res) => {
  try {
    if (modelName === 'GameNavBar') {
      // Return single navbar or empty array
      const navbar = await models[modelName]
        .findOne()
        .populate({
          path: 'menuOptions',
          populate: { path: 'subOptions' }
        })
        .lean();
      return res.status(200).json(navbar ? [navbar] : []);
    }
    const items = await models[modelName]
      .find()
      .populate(modelName === 'GameNavBar' ? {
        path: 'menuOptions',
        populate: { path: 'subOptions' }
      } : null)
      .lean();
    
    if (modelName === 'GameNavBar') {
      for (let item of items) {
        for (let menu of item.menuOptions || []) {
          menu.subOptions = await SubOption.find({ parentMenuOption: menu._id });
        }
      }
    }
    res.status(200).json(items);
  } catch (err) {
    handleError(res, err);
  }
};

exports.getByIdGameNavBar = (modelName) => async (req, res) => {
  try {
    const item = await models[modelName]
      .findById(req.params.id)
      .populate(modelName === 'GameNavBar' ? 'menuOptions' : null)
      .lean();
    if (!item) return res.status(404).json({ error: `${modelName} not found` });
    
    if (modelName === 'GameNavBar' && item.menuOptions) {
      for (let menu of item.menuOptions) {
        menu.subOptions = await SubOption.find({ parentMenuOption: menu._id });
      }
    }
    res.status(200).json(item);
  } catch (err) {
    handleError(res, err, 404);
  }
};

exports.createGameNavBar = (modelName) => async (req, res) => {
  try {
    if (modelName === 'GameNavBar') {
      // Check if a navbar already exists
      const existingNavbar = await models[modelName].findOne();
      if (existingNavbar) {
        return res.status(400).json({ error: 'Only one navbar can exist. Please update the existing navbar.' });
      }
      // Create with defaults (schema handles defaults)
      const navbar = await models[modelName].create(req.body || {});
      return res.status(201).json(navbar);
    }
    const item = await models[modelName].create(req.body);
    res.status(201).json(item);
  } catch (err) {
    handleError(res, err, 400);
  }
};

exports.updateGameNavBar = (modelName) => async (req, res) => {
  try {
    if (modelName === 'GameNavBar') {
      // Update the single navbar
      const navbar = await models[modelName].findOneAndUpdate({}, req.body, { new: true });
      if (!navbar) return res.status(404).json({ error: 'Navbar not found' });
      return res.status(200).json(navbar);
    }
    const item = await models[modelName].findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!item) return res.status(404).json({ error: `${modelName} not found` });
    res.status(200).json(item);
  } catch (err) {
    handleError(res, err, 400);
  }
};

exports.removeGameNavBar = (modelName) => async (req, res) => {
  try {
    if (modelName === 'GameNavBar') {
      return res.status(400).json({ error: 'Deleting the navbar is not allowed.' });
    }
    const item = await models[modelName].findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ error: `${modelName} not found` });
    res.status(200).json({ message: `${modelName} deleted` });
  } catch (err) {
    handleError(res, err, 400);
  }
};




// * =========== frontend game nav ================


exports.getNavBarWithMenuAndSubmenu = async (req, res) => {
  try {
    const gameNavBar = await GameNavBar.findOne(); // or add filter if multiple GameNavBars exist

    const menuOptions = await MenuOption.find();

    const menuWithSubOptions = await Promise.all(
      menuOptions.map(async (menu) => {
        const subOptions = await SubOption.find({ parentMenuOption: menu._id });
        return {
          ...menu.toObject(),
          subOptions,
        };
      })
    );

    sendResponse(res, 200, true, 'GameNavBar fetched successfully', {
      ...gameNavBar.toObject(),
      menuOptions: menuWithSubOptions,
    });
  } catch (error) {
    console.error('Error fetching full GameNavBar:', error);
    sendResponse(res, 500, false, 'Server error while fetching GameNavBar');
  }
};





// * ========== game section  ========== //
exports.getAllGames = async (req, res) => {
  try {
    const games = await GameModel.find()
      .populate({
        path: 'subOptions',
        populate: {
          path: 'parentMenuOption',
        },
      })
      .lean();
    res.status(200).json(games);
  } catch (err) {
    handleError(res, err);
  }
};

exports.getGameById = async (req, res) => {


  try {
    const game = await GameModel.findById(req.params.id).lean();
    if (!game) return res.status(404).json({ error: 'Game not found' });
    res.status(200).json(game);
  } catch (err) {
    handleError(res, err, 404);
  }
};

exports.createGame = async (req, res) => {


  console.log("this is game ",req.body);
  

  try {
    const game = await GameModel.create(req.body);
    res.status(201).json(game);
  } catch (err) {
    handleError(res, err, 400);
  }
};

exports.updateGame = async (req, res) => {
  try {
    const game = await GameModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!game) return res.status(404).json({ error: 'Game not found' });
    res.status(200).json(game);
  } catch (err) {
    handleError(res, err, 400);
  }
};

exports.deleteGame = async (req, res) => {
  try {
    const game = await GameModel.findByIdAndDelete(req.params.id);
    if (!game) return res.status(404).json({ error: 'Game not found' });
    res.status(200).json({ message: 'Game deleted' });
  } catch (err) {
    handleError(res, err, 400);
  }
};






// * =========== frontend game page ================



exports.getFullGameNavBar = async (req, res) => {
  try {
    const navSettings = await GameNavBar.findOne();
    // Get all SubOptions
    const subOptions = await SubOption.find().populate('parentMenuOption');

    // For each SubOption, get its related games
    const subMenusWithGames = await Promise.all(subOptions.map(async (sub) => {
      const games = await GameModel.find({ subOptions: sub._id });


   

      return {
        _id: sub._id,
        title: sub.title,
        image: sub.image,
        parentMenuOption: {
          _id: sub.parentMenuOption?._id,
          title: sub.parentMenuOption?.title,
          image: sub.parentMenuOption?.image
        },
        games: games
      };
    }));

    sendResponse(res, 200, true, 'Submenus with games fetched successfully', {
      settings: navSettings,
      subMenu: subMenusWithGames
    });
  } catch (error) {
    console.error('Error fetching submenus with games:', error);
    sendResponse(res, 500, false, 'Server error', { error });
  }
};




// Create Promotion
exports.createPromotion = async (req, res) => {
  try {
    const promotion = await Promotion.create(req.body);
    sendResponse(res, 201, true, 'Promotion created successfully', promotion);
  } catch (error) {
    console.error('Error creating promotion:', error);
    sendResponse(res, 500, false, 'Server error while creating promotion', { error: error.message });
  }
};

// Get All Promotions
exports.getAllPromotions = async (req, res) => {
  try {
    const promotions = await Promotion.find().lean();
    sendResponse(res, 200, true, 'Promotions fetched successfully', promotions);
  } catch (error) {
    console.error('Error fetching promotions:', error);
    sendResponse(res, 500, false, 'Server error while fetching promotions', { error: error.message });
  }
};

// Get Single Promotion
exports.getPromotionById = async (req, res) => {
  try {
    const promotion = await Promotion.findById(req.params.id).lean();
    if (!promotion) {
      return sendResponse(res, 404, false, 'Promotion not found', null);
    }
    sendResponse(res, 200, true, 'Promotion fetched successfully', promotion);
  } catch (error) {
    console.error('Error fetching promotion:', error);
    sendResponse(res, 500, false, 'Server error while fetching promotion', { error: error.message });
  }
};

// Update Promotion
exports.updatePromotion = async (req, res) => {
  try {
    const promotion = await Promotion.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!promotion) {
      return sendResponse(res, 404, false, 'Promotion not found', null);
    }
    sendResponse(res, 200, true, 'Promotion updated successfully', promotion);
  } catch (error) {
    console.error('Error updating promotion:', error);
    sendResponse(res, 500, false, 'Server error while updating promotion', { error: error.message });
  }
};

// Delete Promotion
exports.deletePromotion = async (req, res) => {
  try {
    const promotion = await Promotion.findByIdAndDelete(req.params.id);
    if (!promotion) {
      return sendResponse(res, 404, false, 'Promotion not found', null);
    }
    sendResponse(res, 200, true, 'Promotion deleted successfully', promotion);
  } catch (error) {
    console.error('Error deleting promotion:', error);
    sendResponse(res, 500, false, 'Server error while deleting promotion', { error: error.message });
  }
};






//* ================= frontend game page end ================




// * ================= frontend deposit payment gateway ================

// * ================= deposit payment gateway start ================

exports.createDepositPaymentMethod = async (req, res) => {
  try {
    const depositPaymentMethod = await DepositPaymentMethod.create(req.body);
    sendResponse(res, 201, true, 'Deposit payment method created successfully', depositPaymentMethod);
  } catch (error) {
    console.error('Error creating deposit payment method:', error);
    sendResponse(res, 500, false, 'Server error while creating deposit payment method', { error: error.message });
  }
};

exports.getAllDepositPaymentMethods = async (req, res) => {
  try {
    const depositPaymentMethods = await DepositPaymentMethod.find().lean();
    sendResponse(res, 200, true, 'Deposit payment methods fetched successfully', depositPaymentMethods);
  } catch (error) {
    console.error('Error fetching deposit payment methods:', error);
    sendResponse(res, 500, false, 'Server error while fetching deposit payment methods', { error: error.message });
  }
};

exports.getDepositPaymentMethodById = async (req, res) => {
  try {
    const depositPaymentMethod = await DepositPaymentMethod.findById(req.params.id).lean();
    if (!depositPaymentMethod) {
      return sendResponse(res, 404, false, 'Deposit payment method not found', null);
    }
    sendResponse(res, 200, true, 'Deposit payment method fetched successfully', depositPaymentMethod);
  } catch (error) {
    console.error('Error fetching deposit payment method:', error);
    sendResponse(res, 500, false, 'Server error while fetching deposit payment method', { error: error.message });
  }
};

exports.updateDepositPaymentMethod = async (req, res) => {
  try {
    const depositPaymentMethod = await DepositPaymentMethod.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!depositPaymentMethod) {
      return sendResponse(res, 404, false, 'Deposit payment method not found', null);
    }
    sendResponse(res, 200, true, 'Deposit payment method updated successfully', depositPaymentMethod);
  } catch (error) {
    console.error('Error updating deposit payment method:', error);
    sendResponse(res, 500, false, 'Server error while updating deposit payment method', { error: error.message });
  }
};

exports.deleteDepositPaymentMethod = async (req, res) => {
  try {
    const depositPaymentMethod = await DepositPaymentMethod.findByIdAndDelete(req.params.id);
    if (!depositPaymentMethod) {
      return sendResponse(res, 404, false, 'Deposit payment method not found', null);
    }
    sendResponse(res, 200, true, 'Deposit payment method deleted successfully', depositPaymentMethod);
  } catch (error) {
    console.error('Error deleting deposit payment method:', error);
    sendResponse(res, 500, false, 'Server error while deleting deposit payment method', { error: error.message });
  }
};



//* ================= frontend promotion start ================

// Get All Promotions with related SubOptions
exports.getAllPromotionsWithSubMenu = async (req, res) => {
  try {
    const promotions = await Promotion.find()
      .populate('game_type')
      .populate({
        path: 'promotion_bonuses',
        populate: {
          path: 'payment_method',
          model: 'DepositPaymentMethod',
        },
      });
    sendResponse(res, 200, true, 'Promotions fetched successfully with submenus', promotions);
  } catch (error) {
    console.error('Error fetching promotions:', error);
    sendResponse(res, 500, false, 'Server error while fetching promotions', { error: error.message });
  }
};



// * ================= frontend promotion end ================


// * ================= frontend deposit payment transaction create gateway ================

exports.getWithdrawPaymentMethods = async (req, res) => {
  try {
    const paymentMethods = await WithdrawPaymentMethod.find({ status: 'active' }).lean();

    if (!paymentMethods || paymentMethods.length === 0) {
      return sendResponse(res, 404, false, "No active withdraw payment methods found", null);
    }

    sendResponse(res, 200, true, "Withdraw payment methods fetched successfully", paymentMethods);
  } catch (error) {
    console.error("Error fetching withdraw payment methods:", error);
    sendResponse(res, 500, false, "Server error while fetching withdraw payment methods", {
      error: error.message,
    });
  }
};


// Utility to validate MongoDB ObjectId (24-character hex string)
const isValidObjectId = (id) => {
  return typeof id === "string" && /^[0-9a-fA-F]{24}$/.test(id);
};

exports.createPaymentTransaction = async (req, res) => {
  try {
    const { userId, paymentMethodId, channel, amount, promotionId, userInputs } = req.body;

    // Validate required fields
    if (!userId || !paymentMethodId || !amount) {
      return sendResponse(res, 400, false, "Missing required fields: userId, paymentMethodId, and amount are required", null);
    }

    // Validate ObjectId formats (24-character hex string)
    if (!isValidObjectId(userId) || !isValidObjectId(paymentMethodId)) {
      return sendResponse(res, 400, false, "Invalid user ID or payment method ID", null);
    }
    if (promotionId && !isValidObjectId(promotionId)) {
      return sendResponse(res, 400, false, "Invalid promotion ID", null);
    }

    // Validate amount
    if (typeof amount !== "number" || amount < 200 || amount > 30000) {
      return sendResponse(res, 400, false, "Amount must be a number between 200 and 30,000", null);
    }

    // Fetch payment method details
    const paymentMethod = await DepositPaymentMethod.findById(paymentMethodId);
    if (!paymentMethod) {
      return sendResponse(res, 400, false, "Invalid payment method", null);
    }

    // Validate payment method fields
    if (
      !paymentMethod.methodName ||
      !paymentMethod.agentWalletNumber ||
      !paymentMethod.agentWalletText ||
      !paymentMethod.methodImage
    ) {
      return sendResponse(res, 400, false, "Payment method missing required fields", null);
    }

    // Validate channel against paymentMethod.gateway array
    if (channel) {
      if (typeof channel !== "string") {
        return sendResponse(res, 400, false, "Channel must be a string", null);
      }
      if (Array.isArray(paymentMethod.gateway) && paymentMethod.gateway.length > 0) {
        if (!paymentMethod.gateway.includes(channel)) {
          return sendResponse(res, 400, false, "Channel must be one of the allowed gateways", null);
        }
      }
    }

    // Validate userInputs
    if (userInputs) {
      if (!Array.isArray(userInputs)) {
        return sendResponse(res, 400, false, "userInputs must be an array", null);
      }
      for (const input of userInputs) {
        if (
          !input.name ||
          !input.value ||
          !input.label ||
          !input.labelBD ||
          !input.type ||
          !["number", "text", "file"].includes(input.type)
        ) {
          return sendResponse(res, 400, false, "Invalid userInputs structure", null);
        }
      }
    }

    // Fetch promotion details if promotionId is provided
    let promotionBonus = null;
    let promotionTitle = null;
    if (promotionId) {
      const promotion = await Promotion.findById(promotionId);
      if (promotion) {
        promotionTitle = promotion.title || null;
        const bonus = promotion?.promotion_bonuses?.find(
          (b) => b.payment_method.toString() === paymentMethodId
        );
        if (bonus) {
          if (["Fix", "Percentage"].includes(bonus.bonus_type) && typeof bonus.bonus === "number") {
            promotionBonus = {
              bonus_type: bonus.bonus_type,
              bonus: bonus.bonus,
            };
          } else {
            return sendResponse(res, 400, false, "Invalid promotion bonus structure", null);
          }
        }
      } else {
        promotionBonus = null;
        promotionTitle = null;
      }
    }

    // Validate status
    const validStatuses = ["pending", "completed", "failed", "cancelled"];
    const status = "pending"; // Hardcode to pending as per schema default

    // Create transaction
    const transaction = await PaymentTransaction.create({
      userId,
      paymentMethod: {
        methodName: paymentMethod.methodName,
        agentWalletNumber: paymentMethod.agentWalletNumber,
        agentWalletText: paymentMethod.agentWalletText,
        methodImage: paymentMethod.methodImage,
        gateway: channel || "",
      },
      channel: channel || "",
      amount,
      promotionId: promotionId || null,
      promotionTitle,
      promotionBonus,
      userInputs: userInputs || [],
      status,
    });

    sendResponse(res, 201, true, "Payment transaction created successfully", transaction);
  } catch (error) {
    console.error("Error creating payment transaction:", error);
    sendResponse(res, 500, false, "Server error while creating payment transaction", {
      error: error.message,
    });
  }
};

exports.getPaymentTransactionById = async (req, res) => {
  try {
    const transaction = await PaymentTransaction.findById(req.params.id)
      .populate("userId", "username email")
      .populate("promotionId", "title")
      .lean();

    if (!transaction) {
      return sendResponse(res, 404, false, "Payment transaction not found", null);
    }

    sendResponse(res, 200, true, "Payment transaction fetched successfully", transaction);
  } catch (error) {
    console.error("Error fetching payment transaction:", error);
    sendResponse(res, 500, false, "Server error while fetching payment transaction", {
      error: error.message,
    });
  }
};

exports.getUserPaymentTransactions = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!isValidObjectId(userId)) {
      return sendResponse(res, 400, false, "Invalid user ID", null);
    }

    const transactions = await PaymentTransaction.find({ userId })
      .populate("promotionId", "title")
      .sort({ createdAt: -1 })
      .lean();

    sendResponse(res, 200, true, "User payment transactions fetched successfully", transactions);
  } catch (error) {
    console.error("Error fetching user payment transactions:", error);
    sendResponse(res, 500, false, "Server error while fetching user payment transactions", {
      error: error.message,
    });
  }
};



// * ================= frontend withdraw payment transaction create gateway ================



// Utility to validate MongoDB ObjectId (24-character hex string)

exports.createWithdrawPaymentTransaction = async (req, res) => {
  try {
    const { userId, paymentMethodId, channel, amount, userInputs } = req.body;

    // Validate required fields
    if (!userId || !paymentMethodId || !amount) {
      return sendResponse(res, 400, false, "Missing required fields: userId, paymentMethodId, and amount are required", null);
    }

    // Validate ObjectId formats
    if (!isValidObjectId(userId) || !isValidObjectId(paymentMethodId)) {
      return sendResponse(res, 400, false, "Invalid user ID or payment method ID", null);
    }

    // Validate amount
    if (typeof amount !== "number" || amount < 200 || amount > 30000) {
      return sendResponse(res, 400, false, "Amount must be a number between 200 and 30,000", null);
    }

    // Check user balance
    const user = await user_model.findById(userId);
    if (!user) {
      return sendResponse(res, 400, false, "User not found", null);
    }
    if (user.balance < amount) {
      return sendResponse(res, 400, false, "Insufficient balance", null);
    }

    // Fetch payment method details
    const paymentMethod = await WithdrawPaymentMethod.findById(paymentMethodId);
    if (!paymentMethod) {
      return sendResponse(res, 400, false, "Invalid payment method", null);
    }

    // Validate payment method fields
    if (!paymentMethod.methodName || !paymentMethod.methodImage) {
      return sendResponse(res, 400, false, "Payment method missing required fields", null);
    }

    // Validate channel against paymentMethod.gateway array
    if (channel) {
      if (typeof channel !== "string") {
        return sendResponse(res, 400, false, "Channel must be a string", null);
      }
      if (Array.isArray(paymentMethod.gateway) && paymentMethod.gateway.length > 0) {
        if (!paymentMethod.gateway.includes(channel)) {
          return sendResponse(res, 400, false, "Channel must be one of the allowed gateways", null);
        }
      }
    }

    // Validate userInputs
    if (userInputs) {
      if (!Array.isArray(userInputs)) {
        return sendResponse(res, 400, false, "userInputs must be an array", null);
      }
      for (const input of userInputs) {
        if (
          !input.name ||
          !input.value ||
          !input.label ||
          !input.labelBD ||
          !input.type ||
          !["number", "text", "file"].includes(input.type)
        ) {
          return sendResponse(res, 400, false, "Invalid userInputs structure", null);
        }
      }
    }

    // Create transaction
    const transaction = await WithdrawPaymentTransaction.create({
      userId,
      paymentMethod: {
        methodName: paymentMethod.methodName,
        methodImage: paymentMethod.methodImage,
        gateway: channel || "",
      },
      channel: channel || "",
      amount,
      userInputs: userInputs || [],
      status: "pending",
    });

    sendResponse(res, 201, true, "Withdraw payment transaction created successfully", transaction);
  } catch (error) {
    console.error("Error creating withdraw payment transaction:", error);
    sendResponse(res, 500, false, "Server error while creating withdraw payment transaction", {
      error: error.message,
    });
  }
};

exports.getWithdrawPaymentTransactionById = async (req, res) => {
  try {
    const transaction = await WithdrawPaymentTransaction.findById(req.params.id)
      .populate("userId", "username email")
      .lean();

    if (!transaction) {
      return sendResponse(res, 404, false, "Withdraw payment transaction not found", null);
    }

    sendResponse(res, 200, true, "Withdraw payment transaction fetched successfully", transaction);
  } catch (error) {
    console.error("Error fetching withdraw payment transaction:", error);
    sendResponse(res, 500, false, "Server error while fetching withdraw payment transaction", {
      error: error.message,
    });
  }
};

exports.getUserWithdrawPaymentTransactions = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!isValidObjectId(userId)) {
      return sendResponse(res, 400, false, "Invalid user ID", null);
    }

    const transactions = await WithdrawPaymentTransaction.find({ userId })
      .sort({ createdAt: -1 })
      .lean();

    sendResponse(res, 200, true, "User withdraw payment transactions fetched successfully", transactions);
  } catch (error) {
    console.error("Error fetching user withdraw payment transactions:", error);
    sendResponse(res, 500, false, "Server error while fetching user withdraw payment transactions", {
      error: error.message,
    });
  }
};


// * ================= withdraw payment gateway start ================

exports.createWithdrawPaymentMethod = async (req, res) => {
  try {
    const withdrawPaymentMethod = await WithdrawPaymentMethod.create(req.body);
    sendResponse(res, 201, true, 'Withdraw payment method created successfully', withdrawPaymentMethod);
  } catch (error) {
    console.error('Error creating withdraw payment method:', error);
    sendResponse(res, 500, false, 'Server error while creating withdraw payment method', { error: error.message });
  }
};

exports.getAllWithdrawPaymentMethods = async (req, res) => {
  try {
    const withdrawPaymentMethods = await WithdrawPaymentMethod.find().lean();
    sendResponse(res, 200, true, 'Withdraw payment methods fetched successfully', withdrawPaymentMethods);
  } catch (error) {
    console.error('Error fetching withdraw payment methods:', error);
    sendResponse(res, 500, false, 'Server error while fetching withdraw payment methods', { error: error.message });
  }
};

exports.getWithdrawPaymentMethodById = async (req, res) => {
  try {
    const withdrawPaymentMethod = await WithdrawPaymentMethod.findById(req.params.id).lean();
    if (!withdrawPaymentMethod) {
      return sendResponse(res, 404, false, 'Withdraw payment method not found', null);
    }
    sendResponse(res, 200, true, 'Withdraw payment method fetched successfully', withdrawPaymentMethod);
  } catch (error) {
    console.error('Error fetching withdraw payment method:', error);
    sendResponse(res, 500, false, 'Server error while fetching withdraw payment method', { error: error.message });
  }
};

exports.updateWithdrawPaymentMethod = async (req, res) => {
  try {
    const withdrawPaymentMethod = await WithdrawPaymentMethod.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!withdrawPaymentMethod) {
      return sendResponse(res, 404, false, 'Withdraw payment method not found', null);
    }
    sendResponse(res, 200, true, 'Withdraw payment method updated successfully', withdrawPaymentMethod);
  } catch (error) {
    console.error('Error updating withdraw payment method:', error);
    sendResponse(res, 500, false, 'Server error while updating withdraw payment method', { error: error.message });
  }
};

exports.deleteWithdrawPaymentMethod = async (req, res) => {
  try {
    const withdrawPaymentMethod = await WithdrawPaymentMethod.findByIdAndDelete(req.params.id);
    if (!withdrawPaymentMethod) {
      return sendResponse(res, 404, false, 'Withdraw payment method not found', null);
    }
    sendResponse(res, 200, true, 'Withdraw payment method deleted successfully', withdrawPaymentMethod);
  } catch (error) {
    console.error('Error deleting withdraw payment method:', error);
    sendResponse(res, 500, false, 'Server error while deleting withdraw payment method', { error: error.message });
  }
};




// * ============================ frontend side controller start ================



// Create new theme (only if none exists)
exports.createTheme = async (req, res) => {
  try {
    const existingTheme = await ThemeModel.findOne();
    if (existingTheme) {
      return res.status(400).json({ message: 'A theme already exists. Use update to modify it.' });
    }

    const {
      primaryColor,
      secondaryColor,
      sidebarHeaderColor,
      sidebarBodyColor,
      sidebarTitle,
      sidebarTitleBD,
      websiteTitle,
    } = req.body;

    // Validate required fields
    if (
      !primaryColor ||
      !secondaryColor ||
      !sidebarHeaderColor ||
      !sidebarBodyColor ||
      !sidebarTitle ||
      !sidebarTitleBD ||
      !websiteTitle
    ) {
      return res.status(400).json({ message: 'All required fields must be provided' });
    }

    // Validate sidebarTitle length
    if (sidebarTitle.length > 10) {
      return res.status(400).json({ message: 'Sidebar title must be 10 characters or less' });
    }

    const theme = new ThemeModel({
      primaryColor,
      secondaryColor,
      sidebarHeaderColor,
      sidebarBodyColor,
      sidebarTitle,
      sidebarTitleBD,
      websiteTitle,
      favicon: req.body.favicon || '',
      websiteLogoWhite: req.body.websiteLogoWhite || '',
      websiteLogoDark: req.body.websiteLogoDark || '',
    });

    await theme.save();
    res.status(201).json({ message: 'Theme created successfully', theme });
  } catch (error) {
    console.error('Create Theme Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get the single theme
exports.getThemes = async (req, res) => {
  try {
    const theme = await ThemeModel.findOne();
    if (!theme) {
      return res.status(200).json({}); // Return empty object if no theme exists
    }
    res.status(200).json(theme);
  } catch (error) {
    console.error('Get Themes Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update the single theme by ID
exports.updateTheme = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      primaryColor,
      secondaryColor,
      sidebarHeaderColor,
      sidebarBodyColor,
      sidebarTitle,
      sidebarTitleBD,
      websiteTitle,
      favicon,
      websiteLogoWhite,
      websiteLogoDark,
    } = req.body;

    // Validate required fields
    if (
      !primaryColor ||
      !secondaryColor ||
      !sidebarHeaderColor ||
      !sidebarBodyColor ||
      !sidebarTitle ||
      !sidebarTitleBD ||
      !websiteTitle
    ) {
      return res.status(400).json({ message: 'All required fields must be provided' });
    }

    // Validate sidebarTitle length
    if (sidebarTitle.length > 10) {
      return res.status(400).json({ message: 'Sidebar title must be 10 characters or less' });
    }

    const updatedTheme = await ThemeModel.findByIdAndUpdate(
      id,
      {
        primaryColor,
        secondaryColor,
        sidebarHeaderColor,
        sidebarBodyColor,
        sidebarTitle,
        sidebarTitleBD,
        websiteTitle,
        favicon,
        websiteLogoWhite,
        websiteLogoDark,
        updatedAt: Date.now(),
      },
      { new: true, runValidators: true }
    );

    if (!updatedTheme) {
      return res.status(404).json({ message: 'Theme not found' });
    }

    res.status(200).json({ message: 'Theme updated successfully', theme: updatedTheme });
  } catch (error) {
    console.error('Update Theme Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete the single theme by ID
exports.deleteTheme = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTheme = await ThemeModel.findByIdAndDelete(id);

    if (!deletedTheme) {
      return res.status(404).json({ message: 'Theme not found' });
    }

    res.status(200).json({ message: 'Theme deleted successfully' });
  } catch (error) {
    console.error('Delete Theme Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


















/**
 * 
// for seed

exports.seedGameNavBar = async (req, res) => {
  try {
    // Clear all existing data
    await GameNavBar.deleteMany({});
    await MenuOption.deleteMany({});
    await SubOption.deleteMany({});

    // Create MenuOptions
    const menu1 = await MenuOption.create({ title: 'Action Games', image: 'action.png' });
    const menu2 = await MenuOption.create({ title: 'Puzzle Games', image: 'puzzle.png' });

    // Create SubOptions for each menu
    await SubOption.insertMany([
      { title: 'Shooter', image: 'shooter.png', parentMenuOption: menu1._id },
      { title: 'Battle Royale', image: 'battle.png', parentMenuOption: menu1._id },
      { title: 'Sudoku', image: 'sudoku.png', parentMenuOption: menu2._id },
      { title: 'Matching', image: 'match.png', parentMenuOption: menu2._id }
    ]);

    // Create GameNavBar
    const navbar = await GameNavBar.create({
      name: 'Main Navbar',
      gameBoxMarginTop: '20px',
      gameNavMenuMarginBottom: '10px',
      headerBgColor: '#222',
      headerMarginBottom: '15px',
      headerMenuBgColor: '#333',
      headerMenuBgHoverColor: '#444',
      subOptionBgHoverColor: '#555',
      menuOptions: [menu1._id, menu2._id]
    });

    // Fetch GameNavBar with full nested structure
    const fullNav = await GameNavBar.findById(navbar._id)
      .populate({
        path: 'menuOptions',
        populate: {
          path: '_id', // this is just to ensure `.toObject()` works nicely
        }
      })
      .lean(); // Convert to plain JS object for manipulation

    // Attach subOptions inside each menuOption manually
    for (let option of fullNav.menuOptions) {
      const subOptions = await SubOption.find({ parentMenuOption: option._id });
      option.subOptions = subOptions;
    }

    res.status(201).json({
      message: 'GameNavBar seeded successfully with full nested structure',
      data: fullNav
    });
  } catch (err) {
    console.error('Seeding error:', err.message);
    res.status(500).json({
      error: 'Failed to seed GameNavBar',
      details: err.message
    });
  }
};








// GET all navbars
exports.getAllNavbars = async (req, res) => {
  try {
    const navbars = await GameNavBar.find()
      .populate({
        path: 'menuOptions',
        populate: {
          path: '_id'
        }
      })
      .lean();

    for (let nav of navbars) {
      for (let menu of nav.menuOptions) {
        const subs = await SubOption.find({ parentMenuOption: menu._id });
        menu.subOptions = subs;
      }
    }

    res.status(200).json(navbars);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};










// Navbar CRUD operations
exports.getAllNavbars = async (req, res) => {
  try {
    const navbars = await GameNavBar.find();
    res.status(200).json(navbars);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching navbars', error: err });
  }
};









const models = { GameNavBar, MenuOption, SubOption };

const handleError = (res, err, status = 500) => {
  res.status(status).json({ error: err.message || 'Server error' });
};

exports.getAllGameNavBar = (modelName) => async (req, res) => {
  try {
    if (modelName === 'GameNavBar') {
      // Return single navbar or empty array
      const navbar = await models[modelName]
        .findOne()
        .populate({
          path: 'menuOptions',
          populate: { path: 'subOptions' }
        })
        .lean();
      return res.status(200).json(navbar ? [navbar] : []);
    }
    const items = await models[modelName]
      .find()
      .populate(modelName === 'GameNavBar' ? {
        path: 'menuOptions',
        populate: { path: 'subOptions' }
      } : null)
      .lean();
    
    if (modelName === 'GameNavBar') {
      for (let item of items) {
        for (let menu of item.menuOptions || []) {
          menu.subOptions = await SubOption.find({ parentMenuOption: menu._id });
        }
      }
    }
    res.status(200).json(items);
  } catch (err) {
    handleError(res, err);
  }
};

exports.getByIdGameNavBar = (modelName) => async (req, res) => {
  try {
    const item = await models[modelName]
      .findById(req.params.id)
      .populate(modelName === 'GameNavBar' ? 'menuOptions' : null)
      .lean();
    if (!item) return res.status(404).json({ error: `${modelName} not found` });
    
    if (modelName === 'GameNavBar' && item.menuOptions) {
      for (let menu of item.menuOptions) {
        menu.subOptions = await SubOption.find({ parentMenuOption: menu._id });
      }
    }
    res.status(200).json(item);
  } catch (err) {
    handleError(res, err, 404);
  }
};

exports.createGameNavBar = (modelName) => async (req, res) => {
  try {
    if (modelName === 'GameNavBar') {
      // Check if a navbar already exists
      const existingNavbar = await models[modelName].findOne();
      if (existingNavbar) {
        return res.status(400).json({ error: 'Only one navbar can exist. Please update the existing navbar.' });
      }
      // Create with defaults (schema handles defaults)
      const navbar = await models[modelName].create(req.body || {});
      return res.status(201).json(navbar);
    }
    const item = await models[modelName].create(req.body);
    res.status(201).json(item);
  } catch (err) {
    handleError(res, err, 400);
  }
};

exports.updateGameNavBar = (modelName) => async (req, res) => {
  try {
    if (modelName === 'GameNavBar') {
      // Update the single navbar
      const navbar = await models[modelName].findOneAndUpdate({}, req.body, { new: true });
      if (!navbar) return res.status(404).json({ error: 'Navbar not found' });
      return res.status(200).json(navbar);
    }
    const item = await models[modelName].findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!item) return res.status(404).json({ error: `${modelName} not found` });
    res.status(200).json(item);
  } catch (err) {
    handleError(res, err, 400);
  }
};

exports.removeGameNavBar = (modelName) => async (req, res) => {
  try {
    if (modelName === 'GameNavBar') {
      return res.status(400).json({ error: 'Deleting the navbar is not allowed.' });
    }
    const item = await models[modelName].findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ error: `${modelName} not found` });
    res.status(200).json({ message: `${modelName} deleted` });
  } catch (err) {
    handleError(res, err, 400);
  }
};








// * ========== game section  ========== //
exports.getAllGames = async (req, res) => {
  try {
    const games = await GameModel.find()
      .populate({
        path: 'subOptions',
        populate: {
          path: 'parentMenuOption',
        },
      })
      .lean();
    res.status(200).json(games);
  } catch (err) {
    handleError(res, err);
  }
};

exports.getGameById = async (req, res) => {
  try {
    const game = await GameModel.findById(req.params.id).lean();
    if (!game) return res.status(404).json({ error: 'Game not found' });
    res.status(200).json(game);
  } catch (err) {
    handleError(res, err, 404);
  }
};

exports.createGame = async (req, res) => {
  try {
    const game = await GameModel.create(req.body);
    res.status(201).json(game);
  } catch (err) {
    handleError(res, err, 400);
  }
};

exports.updateGame = async (req, res) => {
  try {
    const game = await GameModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!game) return res.status(404).json({ error: 'Game not found' });
    res.status(200).json(game);
  } catch (err) {
    handleError(res, err, 400);
  }
};

exports.deleteGame = async (req, res) => {
  try {
    const game = await GameModel.findByIdAndDelete(req.params.id);
    if (!game) return res.status(404).json({ error: 'Game not found' });
    res.status(200).json({ message: 'Game deleted' });
  } catch (err) {
    handleError(res, err, 400);
  }
};


 */