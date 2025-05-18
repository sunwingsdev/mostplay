// Admin user router
const express = require('express');
const { getAllCustomer, getUserInfo, updateUserProfile } = require('../../controller/admin/userCustomer.controller');
const adminAuthMiddleware = require('../../middleware/admin.auth.middleware');
const adminUserRouter = express.Router();

adminUserRouter.get('/all-user-customer',adminAuthMiddleware, getAllCustomer);

adminUserRouter.get('/user/:userId', adminAuthMiddleware, getUserInfo);

adminUserRouter.post('/user/:userId', adminAuthMiddleware, updateUserProfile);


module.exports = adminUserRouter;
