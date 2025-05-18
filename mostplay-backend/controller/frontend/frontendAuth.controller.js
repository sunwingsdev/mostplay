const user_model = require("../../model/user.model");
const WithdrawPaymentTransaction = require('../../model/WithdrawPaymentTransaction');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { getPlayerId } = require("../../utils/getPlayerId");
const sendResponse = require("../../utils/responseHandler");


exports.signupUserFrontend = async (req, res, next) => {
    try {
        const { email, password, name, phoneNumber, country, currency } = req.body;

        const userEmail = await user_model.findOne({ email });
        if (userEmail) {
            return sendResponse(res, 409, false, "Email already exists, please try another one");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new user_model({
            email,
            password: hashedPassword,
            name,
            phoneNumber,
            country,
            currency,
            player_id : getPlayerId(),
        });

        const savedUser = await user.save();
        const userToSend = savedUser.toObject();
        delete userToSend.password;
        const token = jwt.sign({ id: savedUser._id, role: savedUser.role, email: savedUser.email }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });

        const userResponse = {
            ...user.toObject(),
            emailVerifyOTP: undefined,
            phoneNumberOTP: undefined,
            password: undefined,
        };

        sendResponse(res, 201, true, "User created successfully", {
            token,
            userResponse
        });
    } catch (error) {
        console.log(error);
        sendResponse(res, 500, false, "Internal server error");
    }
};

exports.loginUserFrontend = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await user_model.findOne({ email })

      

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password || "");
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid password" });
        }

        if(user.status === "banned"){
            return res.status(403).json({ message: "Your account has been banned, please contact the admin" });
        }


        const token = jwt.sign({ id: user._id, role: user.role, email: user.email }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });

        const userResponse = {
            ...user.toObject(),
            emailVerifyOTP: undefined,
            phoneNumberOTP: undefined,
            password: undefined,
        };
        sendResponse(res, 201, true, "User logged in successfully", {
            token,
            user: userResponse
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

exports.checkTokenFrontend = async (req, res, next) => {
    try {
        let token = req.header("Authorization");

        if (!token) {
            return res.status(401).json({ message: "Token not found" });
        }
        token = token.split(" ")[1];

        


        try {
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
            if (!decodedToken) {
                return res.status(401).json({ message: "Invalid token" });
            }

            const user = await user_model.findById(decodedToken.id).select("-password -emailVerifyOTP");
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            if(user.status === "banned"){
                return res.status(403).json({ message: "Your account has been banned, please contact the admin" });
            }

            // Create JWT token
            token = jwt.sign({ id: user._id, role: user.role, email: user.email }, process.env.JWT_SECRET, {
                expiresIn: "7d",
            });

            sendResponse(res, 200, true, "User logged in successfully", {
                token,
                user: {
                    ...user.toObject(),
                    emailVerifyOTP: undefined,
                    password: undefined,
                }
            });


    
        } catch (error) {
            if (error.name === "JsonWebTokenError") {
                return sendResponse(res, 401, false, "Invalid token");
            }
            console.log(error);
            sendResponse(res, 500, false, "Internal server error");
        }
    } catch (error) {
        console.log(error);
        sendResponse(res, 500, false, "Internal server error");
    }
};





exports.updateBirthdayFrontend = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        const { birthday } = req.body;

        const user = await user_model.findById(userId).select("-password -emailVerifyOTP");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.birthday = birthday;
        await user.save();

        sendResponse(res, 200, true, "Birthday updated successfully", user);
    } catch (error) {
        console.log(error);
        sendResponse(res, 500, false, "Internal server error");
    }
};




exports.sendEmailVerificationFrontend = async (req, res, next) => {
    try {
        const { _id: userId, email: email } = req.body;
        const user = await user_model.findById(userId).select("-password");
        if (!user) {
            return sendResponse(res, 404, false, "User not found");
        }

        const emailVerifyOtp = await Math.floor(1000 + Math.random() * 9000); // Generate a 4-digit OTP
        user.emailVerifyOTP = emailVerifyOtp;
        await user.save();

        //await sendEmail(userEmail, "Verify your email", `Your OTP is: ${emailVerifyOtp}`);

        sendResponse(res, 200, true, "Please check your email to get your OTP", { ...user.toObject(), emailVerifyOTP: undefined });
    } catch (error) {
        console.log(error);
        sendResponse(res, 500, false, "Internal server error");
    }
};

exports.checkEmailVerificationFrontend = async (req, res, next) => {
    try {
        const { _id: userId, email: email ,otp: userOtp } = req.body;

        const user = await user_model.findById(userId).select("-password");
        if (!user) {
            return sendResponse(res, 404, false, "User not found");
        }
        
      
        if (user.emailVerifyOTP == userOtp) {
            user.emailVerified = true;
            user.emailVerifyOTP = 0;
            await user.save();
            return sendResponse(res, 200, true, "Email verified successfully", { ...user.toObject(), emailVerifyOTP: undefined });
        }

        sendResponse(res, 401, false, "Invalid OTP", { ...user.toObject(), emailVerifyOTP: undefined });
    } catch (error) {
        console.log(error);
        sendResponse(res, 500, false, "Internal server error");
    }
};


exports.sendPhoneVerificationFrontend = async (req, res, next) => {
    try {
        const { _id: userId, phoneNumber: phoneNumber } = req.body;
        const user = await user_model.findById(userId).select("-password");
        if (!user) {
            return sendResponse(res, 404, false, "User not found");
        }

        const phoneVerifyOtp = await Math.floor(1000 + Math.random() * 9000); // Generate a 4-digit OTP
        user.phoneNumberOTP = phoneVerifyOtp;

       
        

        await user.save();

        //await sendSms(phoneNumber, `Your OTP is: ${phoneVerifyOtp}`);

        sendResponse(res, 200, true, "Please check your phone to get your OTP", { ...user.toObject(), phoneNumberOTP: undefined });
    } catch (error) {
        console.log(error);
        sendResponse(res, 500, false, "Internal server error");
    }
};

exports.checkPhoneVerificationFrontend = async (req, res, next) => {
    try {
        const { _id: userId, phoneNumber: phoneNumber ,otp: userOtp } = req.body;

        const user = await user_model.findById(userId).select("-password");
        if (!user) {
            return sendResponse(res, 404, false, "User not found");
        }
        
      
        if (user.phoneNumberOTP == userOtp) {
            user.phoneNumberVerified = true;
            user.phoneNumberOTP = 0;
            await user.save();
            return sendResponse(res, 200, true, "Phone verified successfully", { ...user.toObject(), phoneNumberOTP: undefined });
        }

        sendResponse(res, 401, false, "Invalid OTP", { ...user.toObject(), phoneNumberOTP: undefined });
    } catch (error) {
        console.log(error);
        sendResponse(res, 500, false, "Internal server error");
    }
};



exports.getBalance = async (req, res) => {
    try {
      const userId = req.body.userId;
      const user = await user_model.findById(userId);
      const pendingWithdraws = await WithdrawPaymentTransaction.find({ userId, status: "pending" }).lean();
      if (!user) {
        return sendResponse(res, 404, false, "User not found");
      }

  

      const totalPendingWithdraw = pendingWithdraws.reduce((acc, curr) => acc + curr.amount, 0);

    

      const balance = user.balance - totalPendingWithdraw;
      sendResponse(res, 200, true, "User balance", balance);
    } catch (error) {
      console.log(error);
      sendResponse(res, 500, false, "Internal server error");
    }
  };
  




  exports.changePasswordFrontend = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const token = req.header('Authorization')?.split(' ')[1];

    if (!token) {
      return sendResponse(res, 401, false, 'Token not provided');
    }

    // Verify JWT token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return sendResponse(res, 401, false, 'Invalid token');
    }

    // Find user by ID
    const user = await user_model.findById(decoded.id);
    if (!user) {
      return sendResponse(res, 404, false, 'User not found');
    }

    // Verify old password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return sendResponse(res, 401, false, 'Incorrect old password');
    }

    // Validate new password (e.g., minimum length)
    if (newPassword.length < 6) {
      return sendResponse(res, 400, false, 'New password must be at least 6 characters long');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user’s password
    user.password = hashedPassword;
    await user.save();

    sendResponse(res, 200, true, 'Password changed successfully');
  } catch (error) {
    console.error('Change Password Error:', error);
    sendResponse(res, 500, false, 'Internal server error');
  }
};