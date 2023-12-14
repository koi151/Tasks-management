const express = require('express');
const router = express.Router();

const controller = require('../controllers/users.controller');
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

module.exports = router;