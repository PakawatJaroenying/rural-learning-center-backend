import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { UserEntity } from "./entities/UserEntity";

dotenv.config();

export const AppDataSource = new DataSource({
	type: "postgres",
	host: process.env.DB_HOST,
	port: Number(process.env.DB_PORT),
	username: process.env.DB_USERNAME,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
	synchronize: process.env.DB_SYNC === "true", // ใช้ ENV เพื่อตั้งค่า synchronize
	logging: process.env.NODE_ENV === "development", // เปิด logging ใน Dev Mode เท่านั้น
	entities: [UserEntity], // เพิ่ม Entity ที่ต้องการใช้
	migrations: ["./src/migrations/*.ts"],
	ssl: {
		rejectUnauthorized: false, // ปิดการตรวจสอบใบรับรอง
	  },
});
