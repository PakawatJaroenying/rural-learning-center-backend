import { Router } from "express";
import { validateRequest } from "../middlewares/validationMiddleware";
import { authMiddleware } from "../middlewares/authMiddleware";
import { courseCreateValidator, courseEditValidator, courseEnrollValidator, courseGetByIdValidator } from "../validators/courseValidator";
import roleMiddleware from "../middlewares/roleMiddleware";
import { UserRole } from "../types/User";
import { createCourse, deleteCourse, editCourse, enrollCourse, getActivateCourses, getAllCourses, getById } from "../controllers/courseController";
import upload from "../middlewares/multerMiddleware";

const router = Router();

router.post(
	"/getActiveCourses",
	getActivateCourses,
);

router.post(
	"/getAll",
	authMiddleware,
	roleMiddleware([UserRole.ADMIN]),
	// courseCreateValidator,
	// validateRequest,
	getAllCourses,
);

router.get(
	"/getById",
	// authMiddleware,
	// roleMiddleware([UserRole.ADMIN]),
	courseGetByIdValidator,
	validateRequest,
	getById,
);

router.post(
	"/create",
	authMiddleware,
	roleMiddleware([UserRole.ADMIN]),
	upload.single("coverImage"),
	courseCreateValidator,
	validateRequest,
	createCourse,
);

router.post(
	"/update",
	authMiddleware,
	roleMiddleware([UserRole.ADMIN]),
	upload.single("coverImage"),
	courseEditValidator,
	validateRequest,
	editCourse,
);

router.post(
	"/delete",
	authMiddleware,
	roleMiddleware([UserRole.ADMIN]),
	deleteCourse,
);

router.post(
	"/enroll",
	authMiddleware,
	roleMiddleware([UserRole.USER]),
	courseEnrollValidator,
	validateRequest,
	enrollCourse,
);

export default router;
