"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const dotenv_1 = __importDefault(require("dotenv"));
const User_1 = require("./entities/User");
dotenv_1.default.config();
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: process.env.DB_SYNC === 'true', // ใช้ ENV เพื่อตั้งค่า synchronize
    logging: process.env.NODE_ENV === 'development', // เปิด logging ใน Dev Mode เท่านั้น
    entities: [User_1.User], // เพิ่ม Entity ที่ต้องการใช้
    migrations: ['./src/migrations/*.ts'],
});
