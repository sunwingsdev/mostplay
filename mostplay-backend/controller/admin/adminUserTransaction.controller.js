const mongoose = require('mongoose');
const PaymentTransaction = require('../../model/paymentTransactionSchema');
const DepositPaymentMethod = require('../../model/depositePayment.model');
const user_model = require('../../model/user.model');
const Promotion = require('../../model/promotion.model');
const WithdrawPaymentTransaction = require('../../model/WithdrawPaymentTransaction');

// Get all deposit transactions
const getAllDepositTransactions = async (req, res) => {
  try {
    const transactions = await PaymentTransaction
      .find()
      .populate('userId', 'name email phoneNumber')
      .populate('promotionId', 'title')
      .lean();

    // Calculate total amount (amount + bonus)
    const transactionsWithTotal = transactions.map(transaction => {
      let totalAmount = transaction.amount;
      if (transaction.promotionBonus && transaction.promotionBonus.bonus) {
        if (transaction.promotionBonus.bonus_type === 'Fix') {
          totalAmount += transaction.promotionBonus.bonus;
        } else if (transaction.promotionBonus.bonus_type === 'Percentage') {
          totalAmount += (transaction.amount * transaction.promotionBonus.bonus) / 100;
        }
      }
      return { ...transaction, totalAmount };
    });

    res.status(200).json({
      success: true,
      data: transactionsWithTotal,
    });
  } catch (error) {
    console.error('Error in getAllDepositTransactions:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch deposit transactions',
      error: error.message,
    });
  }
};

// Search deposit transactions by user ID, name, or email
const searchDepositTransactions = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ success: false, message: 'Query parameter is required' });
    }

    const pipeline = [
      {
        $match: mongoose.Types.ObjectId.isValid(query)
          ? { _id: new mongoose.Types.ObjectId(query) }
          : {},
      },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'userId',
        },
      },
      {
        $unwind: {
          path: '$userId',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $match: {
          $or: [
            mongoose.Types.ObjectId.isValid(query) ? { _id: new mongoose.Types.ObjectId(query) } : null,
            { 'userId.name': { $regex: query, $options: 'i' } },
            { 'userId.email': { $regex: query, $options: 'i' } },
          ].filter(Boolean),
        },
      },
      {
        $lookup: {
          from: 'promotions',
          localField: 'promotionId',
          foreignField: '_id',
          as: 'promotionId',
        },
      },
      {
        $unwind: {
          path: '$promotionId',
          preserveNullAndEmptyArrays: true,
        },
      },
    ];

    const transactions = await PaymentTransaction.aggregate(pipeline).exec();

    // Calculate total amount for search results
    const transactionsWithTotal = transactions.map(transaction => {
      let totalAmount = transaction.amount;
      if (transaction.promotionBonus && transaction.promotionBonus.bonus) {
        if (transaction.promotionBonus.bonus_type === 'Fix') {
          totalAmount += transaction.promotionBonus.bonus;
        } else if (transaction.promotionBonus.bonus_type === 'Percentage') {
          totalAmount += (transaction.amount * transaction.promotionBonus.bonus) / 100;
        }
      }
      return { ...transaction, totalAmount };
    });

    if (!transactionsWithTotal.length) {
      return res.status(200).json({ success: true, data: [], message: 'No transactions found' });
    }

    res.status(200).json({ success: true, data: transactionsWithTotal });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ success: false, message: 'Failed to search transactions' });
  }
};

// Get deposit transactions by user ID
const getDepositTransactionsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID',
      });
    }
    const transactions = await PaymentTransaction
      .find({ userId })
      .populate('userId', 'name email phoneNumber')
      .populate('promotionId', 'title')
      .lean();

    // Calculate total amount
    const transactionsWithTotal = transactions.map(transaction => {
      let totalAmount = transaction.amount;
      if (transaction.promotionBonus && transaction.promotionBonus.bonus) {
        if (transaction.promotionBonus.bonus_type === 'Fix') {
          totalAmount += transaction.promotionBonus.bonus;
        } else if (transaction.promotionBonus.bonus_type === 'Percentage') {
          totalAmount += (transaction.amount * transaction.promotionBonus.bonus) / 100;
        }
      }
      return { ...transaction, totalAmount };
    });

    res.status(200).json({
      success: true,
      data: transactionsWithTotal,
    });
  } catch (error) {
    console.error('Error in getDepositTransactionsByUserId:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch transactions for user',
      error: error.message,
    });
  }
};

// Get a single deposit transaction by ID
const getDepositTransactionById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.warn(`Invalid transaction ID received: ${id}`);
      return res.status(400).json({
        success: false,
        message: 'Invalid transaction ID',
      });
    }

    const transaction = await PaymentTransaction
      .findById(id)
      .populate({
        path: 'userId',
        select: 'name email phoneNumber',
        match: { _id: { $exists: true } },
      })
      .populate({
        path: 'promotionId',
        select: 'title',
        match: { _id: { $exists: true } },
      })
      .lean();

    if (!transaction) {
      console.warn(`Transaction not found for ID: ${id}`);
      return res.status(404).json({
        success: false,
        message: `Transaction not found for ID: ${id}`,
      });
    }

    // Calculate total amount
    let totalAmount = transaction.amount;
    if (transaction.promotionBonus && transaction.promotionBonus.bonus) {
      if (transaction.promotionBonus.bonus_type === 'Fix') {
        totalAmount += transaction.promotionBonus.bonus;
      } else if (transaction.promotionBonus.bonus_type === 'Percentage') {
        totalAmount += (transaction.amount * transaction.promotionBonus.bonus) / 100;
      }
    }

    res.status(200).json({
      success: true,
      data: { ...transaction, totalAmount },
    });
  } catch (error) {
    console.error(`Error fetching transaction:`, error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch transaction',
      error: error.message,
    });
  }
};

// Create a new deposit transaction
const createDepositTransaction = async (req, res) => {
  try {
    const {
      userId,
      paymentMethod,
      channel,
      amount,
      promotionId,
      userInputs,
      status = 'pending',
    } = req.body;

    if (!userId || !paymentMethod || !amount) {
      return res.status(400).json({
        success: false,
        message: 'userId, paymentMethod, and amount are required',
      });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid userId',
      });
    }

    const requiredPaymentMethodFields = ['methodName', 'agentWalletNumber', 'agentWalletText', 'methodImage'];
    if (!requiredPaymentMethodFields.every((field) => paymentMethod[field])) {
      return res.status(400).json({
        success: false,
        message: 'paymentMethod must include methodName, agentWalletNumber, agentWalletText, and methodImage',
      });
    }

    if (promotionId && !mongoose.Types.ObjectId.isValid(promotionId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid promotionId',
      });
    }

    const transaction = new PaymentTransaction({
      userId,
      paymentMethod,
      channel: channel || '',
      amount,
      promotionId: promotionId || null,
      userInputs: userInputs || [],
      status,
    });

    await transaction.save();

    const populatedTransaction = await PaymentTransaction
      .findById(transaction._id)
      .populate('userId', 'name email phoneNumber')
      .populate('promotionId', 'title')
      .lean();

    // Calculate total amount
    let totalAmount = populatedTransaction.amount;
    if (populatedTransaction.promotionBonus && populatedTransaction.promotionBonus.bonus) {
      if (populatedTransaction.promotionBonus.bonus_type === 'Fix') {
        totalAmount += populatedTransaction.promotionBonus.bonus;
      } else if (populatedTransaction.promotionBonus.bonus_type === 'Percentage') {
        totalAmount += (populatedTransaction.amount * populatedTransaction.promotionBonus.bonus) / 100;
      }
    }

    res.status(201).json({
      success: true,
      data: { ...populatedTransaction, totalAmount },
    });
  } catch (error) {
    console.error('Error in createDepositTransaction:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create deposit transaction',
      error: error.message,
    });
  }
};

// Update a deposit transaction
const updateDepositTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, amount, reason } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid transaction ID',
      });
    }

    const transaction = await PaymentTransaction.findById(id);
    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found',
      });
    }

    const updateData = {};
    if (status) updateData.status = status;
    if (amount) updateData.amount = amount;
    if (reason !== undefined) updateData.reason = reason; // Allow reason update anytime

    // Handle acceptance: Update user balance and deposit
    if (status === 'completed' && transaction.status !== 'completed') {
      let totalAmount = transaction.amount;
      if (transaction.promotionBonus && transaction.promotionBonus.bonus) {
        if (transaction.promotionBonus.bonus_type === 'Fix') {
          totalAmount += transaction.promotionBonus.bonus;
        } else if (transaction.promotionBonus.bonus_type === 'Percentage') {
          totalAmount += (transaction.amount * transaction.promotionBonus.bonus) / 100;
        }
      }

      // Update user's balance and deposit
      await user_model.findByIdAndUpdate(
        transaction.userId,
        {
          $inc: {
            balance: totalAmount,
            deposit: totalAmount,
          },
        },
        { new: true }
      );
    }

    const updatedTransaction = await PaymentTransaction
      .findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true, runValidators: true }
      )
      .populate('userId', 'name email phoneNumber')
      .populate('promotionId', 'title')
      .lean();

    // Calculate total amount
    let totalAmount = updatedTransaction.amount;
    if (updatedTransaction.promotionBonus && updatedTransaction.promotionBonus.bonus) {
      if (updatedTransaction.promotionBonus.bonus_type === 'Fix') {
        totalAmount += updatedTransaction.promotionBonus.bonus;
      } else if (updatedTransaction.promotionBonus.bonus_type === 'Percentage') {
        totalAmount += (updatedTransaction.amount * updatedTransaction.promotionBonus.bonus) / 100;
      }
    }

    res.status(200).json({
      success: true,
      data: { ...updatedTransaction, totalAmount },
    });
  } catch (error) {
    console.error('Error in updateDepositTransaction:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update deposit transaction',
      error: error.message,
    });
  }
};
// Delete a deposit transaction
const deleteDepositTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid transaction ID',
      });
    }

    const transaction = await PaymentTransaction.findByIdAndDelete(id);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Deposit transaction deleted successfully',
    });
  } catch (error) {
    console.error('Error in deleteDepositTransaction:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete deposit transaction',
      error: error.message,
    });
  }
};

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await user_model.find({ role: 'user' }, 'name email _id phoneNumber').lean();
    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.error('Error in getAllUsers:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users',
      error: error.message,
    });
  }
};

// Get all payment methods
const getAllDepositPaymentMethods = async (req, res) => {
  try {
    const paymentMethods = await DepositPaymentMethod.find().lean();
    res.status(200).json({
      success: true,
      data: paymentMethods,
    });
  } catch (error) {
    console.error('Error in getAllDepositPaymentMethods:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payment methods',
      error: error.message,
    });
  }
};

// Get all promotions
const getAllPromotions = async (req, res) => {
  try {
    const promotions = await Promotion.find({}, 'title _id').lean();
    res.status(200).json({
      success: true,
      data: promotions,
    });
  } catch (error) {
    console.error('Error in getAllPromotions:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch promotions',
      error: error.message,
    });
  }
};













// Get all withdraw transactions
const getAllWithdrawTransactions = async (req, res) => {
  try {
    const transactions = await WithdrawPaymentTransaction
      .find()
      .populate('userId', 'name email phoneNumber')
      .lean();

    res.status(200).json({
      success: true,
      data: transactions,
    });
  } catch (error) {
    console.error('Error in getAllWithdrawTransactions:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch withdraw transactions',
      error: error.message,
    });
  }
};

// Search withdraw transactions by user ID, name, or email
const searchWithdrawTransactions = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ success: false, message: 'Query parameter is required' });
    }

    const pipeline = [
      {
        $match: mongoose.Types.ObjectId.isValid(query)
          ? { _id: new mongoose.Types.ObjectId(query) }
          : {},
      },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'userId',
        },
      },
      {
        $unwind: {
          path: '$userId',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $match: {
          $or: [
            mongoose.Types.ObjectId.isValid(query) ? { _id: new mongoose.Types.ObjectId(query) } : null,
            { 'userId.name': { $regex: query, $options: 'i' } },
            { 'userId.email': { $regex: query, $options: 'i' } },
          ].filter(Boolean),
        },
      },
    ];

    const transactions = await WithdrawPaymentTransaction.aggregate(pipeline).exec();

    if (!transactions.length) {
      return res.status(200).json({ success: true, data: [], message: 'No transactions found' });
    }

    res.status(200).json({ success: true, data: transactions });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ success: false, message: 'Failed to search transactions' });
  }
};

// Get withdraw transactions by user ID
const getWithdrawTransactionsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID',
      });
    }
    const transactions = await WithdrawPaymentTransaction
      .find({ userId })
      .populate('userId', 'name email phoneNumber')
      .lean();

    res.status(200).json({
      success: true,
      data: transactions,
    });
  } catch (error) {
    console.error('Error in getWithdrawTransactionsByUserId:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch transactions for user',
      error: error.message,
    });
  }
};

// Get a single withdraw transaction by ID
const getWithdrawTransactionById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.warn(`Invalid transaction ID received: ${id}`);
      return res.status(400).json({
        success: false,
        message: 'Invalid transaction ID',
      });
    }

    const transaction = await WithdrawPaymentTransaction
      .findById(id)
      .populate({
        path: 'userId',
        select: 'name email phoneNumber',
        match: { _id: { $exists: true } },
      })
      .lean();

    if (!transaction) {
      console.warn(`Transaction not found for ID: ${id}`);
      return res.status(404).json({
        success: false,
        message: `Transaction not found for ID: ${id}`,
      });
    }

    res.status(200).json({
      success: true,
      data: transaction,
    });
  } catch (error) {
    console.error(`Error fetching transaction:`, error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch transaction',
      error: error.message,
    });
  }
};

// Create a new withdraw transaction
const createWithdrawTransaction = async (req, res) => {
  try {
    const {
      userId,
      paymentMethod,
      channel,
      amount,
      userInputs,
      status = 'pending',
    } = req.body;

    if (!userId || !paymentMethod || !amount) {
      return res.status(400).json({
        success: false,
        message: 'userId, paymentMethod, and amount are required',
      });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid userId',
      });
    }

    const requiredPaymentMethodFields = ['methodName', 'methodImage'];
    if (!requiredPaymentMethodFields.every((field) => paymentMethod[field])) {
      return res.status(400).json({
        success: false,
        message: 'paymentMethod must include methodName and methodImage',
      });
    }

    const transaction = new WithdrawPaymentTransaction({
      userId,
      paymentMethod,
      channel: channel || '',
      amount,
      userInputs: userInputs || [],
      status,
    });

    await transaction.save();

    const populatedTransaction = await WithdrawPaymentTransaction
      .findById(transaction._id)
      .populate('userId', 'name email phoneNumber')
      .lean();

    res.status(201).json({
      success: true,
      data: populatedTransaction,
    });
  } catch (error) {
    console.error('Error in createWithdrawTransaction:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create withdraw transaction',
      error: error.message,
    });
  }
};

// Update a withdraw transaction
const updateWithdrawTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, amount, reason } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid transaction ID',
      });
    }

    const transaction = await WithdrawPaymentTransaction.findById(id);
    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found',
      });
    }

    const updateData = {};
    if (status) updateData.status = status;
    if (amount) updateData.amount = amount;
    if (reason !== undefined) updateData.reason = reason;

    // Handle acceptance: Update user balance and withdraw
    if (status === 'completed' && transaction.status !== 'completed') {
      const user = await user_model.findById(transaction.userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }
      if (user.balance < transaction.amount) {
        return res.status(400).json({
          success: false,
          message: 'Insufficient user balance',
        });
      }

      await user_model.findByIdAndUpdate(
        transaction.userId,
        {
          $inc: {
            balance: -transaction.amount,
            withdraw: transaction.amount,
          },
        },
        { new: true }
      );
    }

    const updatedTransaction = await WithdrawPaymentTransaction
      .findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true, runValidators: true }
      )
      .populate('userId', 'name email phoneNumber')
      .lean();

    res.status(200).json({
      success: true,
      data: updatedTransaction,
    });
  } catch (error) {
    console.error('Error in updateWithdrawTransaction:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update withdraw transaction',
      error: error.message,
    });
  }
};

// Delete a withdraw transaction
const deleteWithdrawTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid transaction ID',
      });
    }

    const transaction = await WithdrawPaymentTransaction.findByIdAndDelete(id);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Withdraw transaction deleted successfully',
    });
  } catch (error) {
    console.error('Error in deleteWithdrawTransaction:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete withdraw transaction',
      error: error.message,
    });
  }
};














module.exports = {
  getAllDepositTransactions,
  searchDepositTransactions,
  getDepositTransactionsByUserId,
  getDepositTransactionById,
  createDepositTransaction,
  updateDepositTransaction,
  deleteDepositTransaction,
  getAllUsers,
  getAllDepositPaymentMethods,
  getAllPromotions,
  getWithdrawTransactionsByUserId,
  getWithdrawTransactionById,
  createWithdrawTransaction,
  updateWithdrawTransaction,
  deleteWithdrawTransaction,
  getAllWithdrawTransactions,
  searchWithdrawTransactions
};