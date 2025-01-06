import { S3Client } from "@aws-sdk/client-s3";
import multer, { FileFilterCallback } from "multer";
import multerS3 from "multer-s3";
import { Request } from "express";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

// ประเภทไฟล์ที่รองรับ
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/gif"];



// ตั้งค่า S3 (DigitalOcean Spaces)
const s3 = new S3Client({
	endpoint: process.env.SPACES_ENDPOINT || "",
	credentials: {
		accessKeyId: process.env.SPACES_KEY || "",
		secretAccessKey: process.env.SPACES_SECRET || "",
	},
	region: "sgp1", // specify your region
	forcePathStyle: true,
});

// กรองไฟล์เฉพาะที่รองรับ
const fileFilter = (
	req: Request,
	file: Express.Multer.File,
	cb: FileFilterCallback
) => {
	if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
		cb(null, true);
	} else {
		cb(new Error("Invalid file type, only images are allowed!"));
	}
};

// กำหนดขนาดไฟล์สูงสุด (5 MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// สร้าง Multer Middleware สำหรับอัปโหลดไปยัง Spaces
const upload = multer({
	storage: multerS3({
		s3,
		bucket: process.env.SPACES_BUCKET || "",
		acl: "public-read", // ตั้งเป็น "private" หากต้องการความเป็นส่วนตัว
		key: (req, file, cb) => {
			const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
			cb(null, `uploads/${uniqueSuffix}${path.extname(file.originalname)}`); // เก็บในโฟลเดอร์ "uploads"
		},
	}),
	fileFilter,
	limits: { fileSize: MAX_FILE_SIZE },
});

export default upload;
