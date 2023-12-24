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
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordPost = exports.loginPost = exports.forgotPasswordPost = exports.registerPost = void 0;
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};
const registerPost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body.fullName) {
        res.json({
            code: 400,
            message: "Empty name"
        });
        return;
    }
    if (req.body.fullName.length < 5) {
        res.json({
            code: 400,
            message: "Full name must be at least 5 degits length"
        });
        return;
    }
    if (!req.body.email) {
        res.json({
            code: 400,
            message: "Empty email"
        });
        return;
    }
    if (!isValidEmail(req.body.email)) {
        res.json({
            code: 400,
            message: "Invalid email format"
        });
        return;
    }
    if (req.body.password.length < 6) {
        res.json({
            code: 400,
            message: "Pass word must be at least 5 degits length"
        });
        return;
    }
    next();
});
exports.registerPost = registerPost;
const forgotPasswordPost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body.email) {
        res.json({
            code: 400,
            message: "Empty email"
        });
        return;
    }
    if (!isValidEmail(req.body.email)) {
        res.json({
            code: 400,
            message: "Invalid email format"
        });
        return;
    }
    next();
});
exports.forgotPasswordPost = forgotPasswordPost;
const loginPost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body.email) {
        res.json({
            code: 400,
            message: "Empty email"
        });
        return;
    }
    if (!isValidEmail(req.body.email)) {
        res.json({
            code: 400,
            message: "Invalid email format"
        });
        return;
    }
    next();
});
exports.loginPost = loginPost;
const resetPasswordPost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body.password) {
        res.json({
            code: 400,
            message: "Password must not be empty"
        });
        return;
    }
    if (!req.body.confirmPassword) {
        res.json({
            code: 400,
            message: "Password did not confirmed"
        });
        return;
    }
    if (req.body.confirmPassword != req.body.password) {
        res.json({
            code: 400,
            message: "Password confirm does not match"
        });
        return;
    }
    next();
});
exports.resetPasswordPost = resetPasswordPost;
