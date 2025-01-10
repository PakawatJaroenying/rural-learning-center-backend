import { Router } from "express";
import { validateRequest } from "../middlewares/validationMiddleware";
import { authenMiddleware } from "../middlewares/authMiddleware";
import {
	courseCreateValidator,
	courseEditValidator,
	courseEnrollValidator,
	courseGetByIdValidator,
} from "../validators/courseValidator";
import roleMiddleware from "../middlewares/roleMiddleware";
import { UserRole } from "../types/User";
import {
	createCourse,
	deleteCourse,
	editCourse,
	enrollCourse,
	getActivateCourses,
	getAllCourses,
	getById,
} from "../controllers/courseController";
import upload from "../middlewares/multerMiddleware";
import Container from "typedi";
import { CurrentUserService } from "../services/CurrentUserService";

const router = Router();

router.post("/getActiveCourses", getActivateCourses);

router.post(
	"/getAll",
	authenMiddleware,
	Container.get(CurrentUserService).authorizeUserMiddleware,
	roleMiddleware([UserRole.ADMIN]),
	getAllCourses
);

router.get(
	"/getById",

	courseGetByIdValidator,
	validateRequest,
	getById
);

router.post(
	"/create",
	authenMiddleware,
	Container.get(CurrentUserService).authorizeUserMiddleware,
	roleMiddleware([UserRole.ADMIN]),
	upload.single("coverImage"),
	courseCreateValidator,
	validateRequest,
	createCourse
);

router.post(
	"/update",
	authenMiddleware,
	Container.get(CurrentUserService).authorizeUserMiddleware,
	roleMiddleware([UserRole.ADMIN]),
	upload.single("coverImage"),
	courseEditValidator,
	validateRequest,
	editCourse
);

router.post(
	"/delete",
	authenMiddleware,
	Container.get(CurrentUserService).authorizeUserMiddleware,
	roleMiddleware([UserRole.ADMIN]),
	deleteCourse
);

router.post(
	"/enroll",
	authenMiddleware,
	Container.get(CurrentUserService).authorizeUserMiddleware,
	roleMiddleware([UserRole.USER]),
	courseEnrollValidator,
	validateRequest,
	enrollCourse
);

export default router;
