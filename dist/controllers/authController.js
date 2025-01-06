"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const ApiResponse_1 = require("../utils/ApiResponse");
const typedi_1 = __importDefault(require("typedi"));
const UserService_1 = __importDefault(require("../services/UserService"));
const userService = typedi_1.default.get(UserService_1.default);
const register = async (req, res) => {
    try {
        const { username, password } = req.body;
        const existingUser = await userService.findByUsername(username);
        if (existingUser) {
            res.status(400).json({ message: "User already exists" });
        }
        // Hash the password
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        // Create new user
        const newUser = await userService.createUser(username, hashedPassword);
        (0, ApiResponse_1.successResponse)(res, newUser, "User registered successfully", 201);
    }
    catch (error) {
        console.error(error);
        (0, ApiResponse_1.errorResponse)(res, "Server error", 500);
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await userService.findByUsername(username);
        if (!user) {
            (0, ApiResponse_1.errorResponse)(res, "Invalid credentials", 400);
            return;
        }
        const isMatch = await bcrypt_1.default.compare(password, user.password);
        if (!isMatch) {
            (0, ApiResponse_1.errorResponse)(res, "Invalid credentials", 400);
        }
        const accessToken = userService.generateAccessToken(user.id);
        const refreshToken = userService.generateRefreshToken(user.id);
        await userService.saveRefreshToken(user.id, refreshToken);
        (0, ApiResponse_1.successResponse)(res, {
            user,
            accessToken,
            refreshToken,
        }, "Login successful");
    }
    catch (error) {
        console.error(error);
        (0, ApiResponse_1.errorResponse)(res, "Server error", 500);
    }
};
exports.login = login;
