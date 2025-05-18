const error = (message = "something want wrong", statusCode = 500) => {
    const err = new Error(message);
    err.status = statusCode;
    return err;
  };
  
  module.exports = error;