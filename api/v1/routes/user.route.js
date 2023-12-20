const express = require('express');
const router = express.Router();

const controller = require('../controllers/user.controller');
const validate = require('../../../validate/user.validate');
const authMiddleware = require('../../../middlewares/auth.middleware');

router.post(
  '/register',
  validate.registerPost, 
  controller.registerPost
);

router.post(
  '/login',
  validate.loginPost, 
  controller.loginPost
);

router.post(
  '/login/forgot',
  validate.forgotPasswordPost, 
  controller.forgotPasswordPost
);

router.post('/login/otp', controller.otpPassword);

router.post('/login/reset', controller.resetPassword);

router.get('/detail', authMiddleware.authRequire , controller.detail);

router.get('/user-list', authMiddleware.authRequire , controller.userList);


module.exports = router;