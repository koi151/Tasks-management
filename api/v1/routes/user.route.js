const express = require('express');
const router = express.Router();

const controller = require('../controllers/user.controller');
const validate = require('../../../validate/user.validate');

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

router.get('/detail', controller.detail);

module.exports = router;