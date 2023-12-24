"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userList = exports.detail = exports.resetPassword = exports.otpPassword = exports.forgotPasswordPost = exports.loginPost = exports.registerPost = void 0;
const user_model_1 = __importDefault(require("../model/user.model"));
const forgot_password_model_1 = __importDefault(require("../model/forgot-password.model"));
const generateString_1 = require("../../../helpers/generateString");
const sendMail_1 = require("../../../helpers/sendMail");
const bcrypt_1 = __importDefault(require("bcrypt"));
const registerPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { fullName, email, password } = req.body;
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const existedEmail = yield user_model_1.default.findOne({
            email: email,
            deleted: false
        });
        if (!existedEmail) {
            const newUser = new user_model_1.default({
                fullName: fullName,
                email: email,
                password: hashedPassword,
                token: (0, generateString_1.generateRandomString)(30)
            });
            yield newUser.save();
            const token = newUser.token;
            res.cookie("token", token);
            res.json({
                code: 200,
                message: 'New user account created successfully',
                token: token
            });
        }
        else {
            res.json({
                code: 409,
                message: 'Error occurred, email has been used'
            });
        }
    }
    catch (error) {
        console.log('Error occurred:', error);
        res.json({
            code: 400,
            message: 'Not existed'
        });
    }
});
exports.registerPost = registerPost;
const loginPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const existedUser = yield user_model_1.default.findOne({
            email: req.body.email,
            deleted: false
        });
        if (!existedUser) {
            res.json({
                code: 400,
                message: 'Incorrect email or password'
            });
            return;
        }
        const passwordMatched = yield bcrypt_1.default.compare(req.body.password, existedUser.password);
        if (passwordMatched) {
            const token = existedUser.token;
            res.cookie('token', token);
            res.json({
                code: 200,
                message: 'Login successful',
                token: token
            });
        }
        else {
            res.json({
                code: 400,
                message: 'Incorrect email or password'
            });
        }
    }
    catch (error) {
        console.log('Error occurred:', error);
        res.json({
            code: 400,
            message: 'Not existed'
        });
    }
});
exports.loginPost = loginPost;
const forgotPasswordPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const email = req.body.email;
        const emailExisted = yield user_model_1.default.findOne({
            email: email,
            deleted: false
        });
        if (!emailExisted) {
            res.json({
                code: 400,
                message: 'Email not existed'
            });
            return;
        }
        const otp = (0, generateString_1.generateRandomNumber)(6);
        const expiredTime = 5;
        const forgotPasswordObj = {
            email: email,
            otp: otp,
            expireAt: Date.now() + expiredTime * 60 * 1000
        };
        const forgotPassword = new forgot_password_model_1.default(forgotPasswordObj);
        yield forgotPassword.save();
        const subject = 'OTP verification code for retriving password';
        const content = `
      <p>Your OTP verification code is <b>${otp}</b></p>
      <p>OTP code expires in 2 minutes, do not share the code.</p>
    `;
        (0, sendMail_1.sendMailHelper)(email, subject, content);
        res.json({
            code: 200,
            message: 'OTP code sent via email '
        });
    }
    catch (error) {
        console.log('Error occurred:', error);
        res.json({
            code: 400,
            message: 'Not existed'
        });
    }
});
exports.forgotPasswordPost = forgotPasswordPost;
const otpPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const email = req.body.email;
        const otp = req.body.otp;
        const result = yield forgot_password_model_1.default.findOne({
            email: email,
            otp: otp
        });
        if (result) {
            const user = yield user_model_1.default.findOne({
                email: email
            });
            const token = user.token;
            res.cookie("token", token);
            res.json({
                code: 200,
                message: 'OTP authencation successful',
                token: token
            });
        }
        else {
            res.json({
                code: 400,
                message: 'Invalid OTP'
            });
        }
    }
    catch (error) {
        console.log('Error occurred:', error);
        res.json({
            code: 400,
            message: 'Not existed'
        });
    }
});
exports.otpPassword = otpPassword;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.body.token;
        const password = req.body.password;
        const user = yield user_model_1.default.findOne({
            token: token,
        });
        const passwordMatched = bcrypt_1.default.compare(password, user.password);
        if (passwordMatched) {
            res.json({
                code: 400,
                message: 'New password must be different from old password'
            });
            return;
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        yield user.updateOne({
            token: token
        }, {
            password: hashedPassword
        });
        res.json({
            code: 200,
            message: 'New password updated successfully'
        });
    }
    catch (error) {
        console.log('Error occurred:', error);
        res.json({
            code: 400,
            message: 'Not existed'
        });
    }
});
exports.resetPassword = resetPassword;
const detail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.json({
            code: 200,
            message: 'User info sent successfully',
            info: req["user"]
        });
    }
    catch (error) {
        console.log('Error occurred: ', error);
        res.json({
            code: 400,
            message: 'Not existed'
        });
    }
});
exports.detail = detail;
const userList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield user_model_1.default.find({
            deleted: false
        }).select('fullName email');
        res.json({
            code: 200,
            message: 'Successful!',
            users: users
        });
    }
    catch (error) {
        console.log('Error occurred: ', error);
        res.json({
            code: 400,
            message: 'Not existed'
        });
    }
});
exports.userList = userList;
