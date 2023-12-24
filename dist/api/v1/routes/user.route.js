"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const express_1 = require("express");
const router = (0, express_1.Router)();
const controller = __importStar(require("../controllers/user.controller"));
const validate = __importStar(require("../../../validate/user.validate"));
const authMiddleware = __importStar(require("../../../middlewares/auth.middleware"));
router.post('/register', validate.registerPost, controller.registerPost);
router.post('/login', validate.loginPost, controller.loginPost);
router.post('/login/forgot', validate.forgotPasswordPost, controller.forgotPasswordPost);
router.post('/login/otp', controller.otpPassword);
router.post('/login/reset', controller.resetPassword);
router.get('/detail', authMiddleware.authRequire, controller.detail);
router.get('/user-list', authMiddleware.authRequire, controller.userList);
exports.userRoutes = router;
