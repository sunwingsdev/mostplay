// utils/responseHandler.js
function sendResponse(res, statusCode, success, message, data = {}) {
    return res.status(statusCode).json({
      success,
      message,
      data,
    });
  }
  
module.exports = sendResponse;
  