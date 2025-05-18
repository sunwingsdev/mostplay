
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const sendResponse = require("../../utils/responseHandler");
const user_model = require("../../model/user.model");


exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("Admin login attempt", email);



    // Find user by email and role "admin"
    const user = await user_model.findOne({ email, role: "admin" });
    if (!user) {
      return sendResponse(res, 404, false, "User not found");
    }


    // Check if password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return sendResponse(res, 401, false, "Invalid credentials");
    }

    // Create JWT token
    const token = jwt.sign({ id: user._id, role: user.role, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    // Respond with token
    sendResponse(res, 200, true, "User logged in successfully", {
      token,
      user: {
        _id: user._id,
        name: user.name,
      },
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};


// Check token middleware
exports.checkToken = async (req, res, next) => {
  try {

    let token = req.header("Authorization");

    if (!token) {
      return sendResponse(res, 401, false, "Token not found");
    }
    token = token.split(" ")[1];

    try {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      if (!decodedToken) {
        return sendResponse(res, 401, false, "Invalid token");
      }

      const user = await user_model.findById(decodedToken.id);
      if (!user) {
        return sendResponse(res, 404, false, "User not found");
      }

      // Create JWT token
      token = jwt.sign({ id: user._id, role: user.role, email: user.email }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });

      // Respond with token
      sendResponse(res, 200, true, "User logged in successfully", {
        token,
        user: {
          _id: user._id,
          name: user.name,
        },
      });
    } catch (error) {
      if (error.name === "JsonWebTokenError") {
        return sendResponse(res, 401, false, "Invalid token");
      }
      console.log(error);
      res.status(500).json({ message: "Internal server error" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
