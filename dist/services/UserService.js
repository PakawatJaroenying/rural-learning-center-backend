"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typedi_1 = require("typedi");
const data_source_1 = require("../data-source");
const User_1 = require("../entities/User");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
let UserService = class UserService {
    constructor() {
        this.userRepository = data_source_1.AppDataSource.getRepository(User_1.User);
        this.generateAccessToken = (userId) => {
            return jsonwebtoken_1.default.sign({ userId }, process.env.JWT_SECRET, {
                expiresIn: process.env.JWT_EXPIRES_IN,
            });
        };
        this.generateRefreshToken = (userId) => {
            return jsonwebtoken_1.default.sign({ userId }, process.env.JWT_REFRESH_SECRET, {
                expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
            });
        };
    }
    async findByUsername(username) {
        return await this.userRepository.findOneBy({ username });
    }
    async createUser(username, hashedPassword) {
        const newUser = this.userRepository.create({
            username,
            password: hashedPassword,
        });
        return await this.userRepository.save(newUser);
    }
    async saveRefreshToken(userId, refreshToken) {
        await this.userRepository.update(userId, { refreshToken });
    }
};
UserService = __decorate([
    (0, typedi_1.Service)()
], UserService);
exports.default = UserService;
