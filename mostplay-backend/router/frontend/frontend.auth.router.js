const express = require('express');
const { signupUserFrontend, loginUserFrontend, checkTokenFrontend, updateBirthdayFrontend, sendEmailVerificationFrontend, checkEmailVerificationFrontend, sendPhoneVerificationFrontend, checkPhoneVerificationFrontend, getBalance, changePasswordFrontend } = require('../../controller/frontend/frontendAuth.controller');


const frontendAuthRouter = express.Router();

// Signup route
frontendAuthRouter.post('/signup', signupUserFrontend);

// Login route
frontendAuthRouter.post('/login', loginUserFrontend);

// Check token middleware
frontendAuthRouter.get('/check-token', checkTokenFrontend);

// Update birthday route
frontendAuthRouter.patch('/update-birthday/:userId', updateBirthdayFrontend);

// Send email verification route
frontendAuthRouter.post('/send-email-verification', sendEmailVerificationFrontend);

// Check email verification route
frontendAuthRouter.post('/check-email-verification', checkEmailVerificationFrontend);

// Send phone verification route
frontendAuthRouter.post('/send-phone-verification', sendPhoneVerificationFrontend);

// Check phone verification route
frontendAuthRouter.post('/check-phone-verification', checkPhoneVerificationFrontend);

frontendAuthRouter.post('/balance', getBalance);

// New password change route
frontendAuthRouter.patch('/change-password', changePasswordFrontend);

module.exports = frontendAuthRouter;

