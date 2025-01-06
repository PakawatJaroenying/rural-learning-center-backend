import express, { Application, Request, Response } from "express";
import routes from "./routes";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import dotenv from "dotenv";
import { AppDataSource } from "./data-source";
import { setupSwagger } from "./swagger";
import { authMiddleware } from "./middlewares/authMiddleware";
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || process.env.BACKEND_PORT || 3000;


// เชื่อมต่อฐานข้อมูล
AppDataSource.initialize()
	.then(() => {
		console.log("Database connected!");
	})
	.catch((error) => {
		console.error("Database connection failed:", error);
	});

// Middleware
app.use(helmet()); // ป้องกัน HTTP Header ที่ไม่จำเป็น
app.use(compression()); // บีบอัดข้อมูลก่อนส่งไปหา Client
app.use(morgan("dev")); // แสดง Log ของ Request ที่เข้ามา
// ตั้งค่าให้อนุญาตทุก Origin (ไม่แนะนำใน Production)
app.use(cors());
// หรืออนุญาตเฉพาะ Origin บางที่
// app.use(cors({
//     origin: ['http://frontend.example.com', 'http://another-frontend.com']
// }));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // แปลง URL-encoded Body ให้เป็น JavaScript Object
// app.use(logger);
// app.use(authMiddleware);  
// Setup Swagger
setupSwagger(app);


// Routes
app.get("/", (req: Request, res: Response) => {
	res.send("Hello World!");
});
app.use("/", routes);


// Start Server
app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});
