const express = require('express');
const { loginAdmin, checkToken } = require('../../controller/admin/adminAuth.controller');
const { sendEmailVerificationFrontend, checkEmailVerificationFrontend, sendPhoneVerificationFrontend, checkPhoneVerificationFrontend } = require('../../controller/frontend/frontendAuth.controller');
const adminAuthRouter = express.Router();

// Admin login route
adminAuthRouter.post('/login', loginAdmin);

adminAuthRouter.get('/check-token', checkToken);


// Send email verification route
adminAuthRouter.post('/send-email-verification', sendEmailVerificationFrontend);

// Check email verification route
adminAuthRouter.post('/check-email-verification', checkEmailVerificationFrontend);

// Send phone verification route
adminAuthRouter.post('/send-phone-verification', sendPhoneVerificationFrontend);

// Check phone verification route
adminAuthRouter.post('/check-phone-verification', checkPhoneVerificationFrontend);





module.exports = adminAuthRouter;

