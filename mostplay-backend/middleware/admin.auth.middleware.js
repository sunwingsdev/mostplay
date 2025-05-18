const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const user_model = require("../model/user.model");
const sendResponse = require("../utils/responseHandler");


const adminAuthMiddleware = async (req, res, next) => {

 
  try {
    let token = req.header("Authorization");




    if (!token) {
      return sendResponse(res, 401, false, "Not authorized");
    }

    token = token.split(" ")[1];

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    if (!decodedToken) {
      return sendResponse(res, 401, false, "Invalid token");
    }

   
    const user = await user_model.findById(decodedToken.id);

    if(user.status === "banned"){
      return sendResponse(res, 403, false, "Your account has been banned, please contact the admin");
    }
    
    

    if (!user || user.role !== "admin") {
      return sendResponse(res, 403, false, "You are not authorized to access this route");
    }

    next();
  } catch (error) {
    sendResponse(res, 500, false, "Internal server error");
  }
};

module.exports = adminAuthMiddleware;

