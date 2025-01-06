"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const routes_1 = __importDefault(require("./routes"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// เชื่อมต่อฐานข้อมูล
// AppDataSource.initialize()
// 	.then(() => {
// 		console.log("Database connected!");
// 	})
// 	.catch((error) => {
// 		console.error("Database connection failed:", error);
// 	});
// Middleware
app.use((0, helmet_1.default)()); // ป้องกัน HTTP Header ที่ไม่จำเป็น
app.use((0, compression_1.default)()); // บีบอัดข้อมูลก่อนส่งไปหา Client
app.use((0, morgan_1.default)("dev")); // แสดง Log ของ Request ที่เข้ามา
// ตั้งค่าให้อนุญาตทุก Origin (ไม่แนะนำใน Production)
app.use((0, cors_1.default)());
// หรืออนุญาตเฉพาะ Origin บางที่
// app.use(cors({
//     origin: ['http://frontend.example.com', 'http://another-frontend.com']
// }));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true })); // แปลง URL-encoded Body ให้เป็น JavaScript Object
// app.use(logger);
// Routes
app.get("/", (req, res) => {
    res.send("Hello World!");
});
app.use("/", routes_1.default);
// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
