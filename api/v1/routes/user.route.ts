import { Router } from 'express';

const router: Router = Router();

import * as controller from '../controllers/user.controller';
import * as validate from "../../../validate/user.validate";
import * as authMiddleware from "../../../middlewares/auth.middleware";

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


export const userRoutes: Router = router;