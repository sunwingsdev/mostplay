const { fstat } = require("fs");
const user_model = require("../../model/user.model");
const  sendResponse  = require("../../utils/responseHandler");


exports.getAllCustomer = async (req, res) => {
  try {
    const users = await user_model.find({ role: { $ne: "admin" } });
    sendResponse(res, 200, true, "All customer users without admin", users);
  } catch (error) {
    console.log(error);
    sendResponse(res, 500, false, "Internal server error");
  }
};



exports.getUserInfo = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await user_model.findById(userId);
    if (!user) {
      return sendResponse(res, 404, false, "User not found");
    }
    sendResponse(res, 200, true, "User info", user);
  } catch (error) {
    console.log(error);
    sendResponse(res, 500, false, "Internal server error");
  }
};


exports.updateUserProfile = async (req, res) => {
  try {
    const userId = req.params.userId;
    const {
      name,
      email,
      country,
      currency,
      phoneNumber,
      player_id,
      promoCode,
      isVerified,
      emailVerified,
      phoneNumberVerified,
      status,
      balance,
      deposit,
      withdraw,
      bonusSelection,
      role,
      profileImage,
    } = req.body;

    // Validate input using user model schema
    const user = await user_model.findById(userId);

    if (!user) {
      return sendResponse(res, 404, false, "User not found");
    }

    // Update user info
    user.name = name || user.name;
    user.email = email || user.email;
    user.country = country || user.country;
    user.currency = currency || user.currency;
    user.phoneNumber = phoneNumber || user.phoneNumber;
    user.player_id = player_id || user.player_id;
    user.promoCode = promoCode || user.promoCode;
    user.isVerified = isVerified !== undefined ? isVerified : user.isVerified;
    user.emailVerified = emailVerified !== undefined ? emailVerified : user.emailVerified;
    user.phoneNumberVerified = phoneNumberVerified !== undefined ? phoneNumberVerified : user.phoneNumberVerified;
    user.status = status || user.status;
    user.balance = balance !== undefined ? balance : user.balance;
    user.deposit = deposit !== undefined ? deposit : user.deposit;
    user.withdraw = withdraw !== undefined ? withdraw : user.withdraw;
    user.bonusSelection = bonusSelection || user.bonusSelection;
    user.role = role || user.role;
    user.profileImage = profileImage === null ? "" : profileImage || user.profileImage;

    // Save updated user
    await user.save();
    sendResponse(res, 200, true, "User profile updated successfully", user);
  } catch (error) {
    console.log(error);
    sendResponse(res, 500, false, "Internal server error");
  }
};


