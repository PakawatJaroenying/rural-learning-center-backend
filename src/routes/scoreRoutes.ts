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
import upload from "../middlewares/multerMiddleware";
import {
	getAllScores,
	getById,
	updateScore,
} from "../controllers/scoreController";
import { scoreGetByIdValidator, scoreUpdateValidator } from "../validators/scoreValidator";
import Container from "typedi";
import { CurrentUserService } from "../services/CurrentUserService";

const router = Router();

router.post(
	"/getAll",
	authenMiddleware,
	Container.get(CurrentUserService).authorizeUserMiddleware,
	roleMiddleware([UserRole.ADMIN]),
	getAllScores
);

router.get(
	"/getById",
	authenMiddleware,
	Container.get(CurrentUserService).authorizeUserMiddleware,
	roleMiddleware([UserRole.ADMIN]),
	scoreGetByIdValidator,
	validateRequest,
	getById
);

router.post(
	"/update",
	authenMiddleware,
	Container.get(CurrentUserService).authorizeUserMiddleware,
	roleMiddleware([UserRole.ADMIN]),
	scoreUpdateValidator,
	updateScore
);

export default router;
