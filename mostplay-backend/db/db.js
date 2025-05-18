const mongoose = require("mongoose");

const connectDb = (connectionString) => {
  mongoose.set("strictQuery", true);

  return mongoose.connect(connectionString);
};

module.exports = connectDb;