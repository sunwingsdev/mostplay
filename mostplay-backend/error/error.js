const sendResponse = require("../utils/responseHandler");

const error = (error, _req, res, _next) => {
    console.log(error);

    const { status, message } = error;

    sendResponse(res, !status ? 500 : status, false, !message ? "server error" : message);
};

module.exports = error;
