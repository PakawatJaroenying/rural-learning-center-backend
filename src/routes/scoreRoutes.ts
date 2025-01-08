import { Router } from "express";
import { validateRequest } from "../middlewares/validationMiddleware";
import { authMiddleware } from "../middlewares/authMiddleware";
import { courseCreateValidator, courseEditValidator, courseEnrollValidator, courseGetByIdValidator } from "../validators/courseValidator";
import roleMiddleware from "../middlewares/roleMiddleware";
import { UserRole } from "../types/User";
import upload from "../middlewares/multerMiddleware";
import { getAllScores, getById, updateScore } from "../controllers/scoreController";
import { scoreGetByIdValidator } from "../validators/scoreValidator";

const router = Router();


router.post(
	"/getAll",
	authMiddleware,
	roleMiddleware([UserRole.ADMIN]),
	getAllScores,
);

router.get(
	"/getById",
	authMiddleware,
	roleMiddleware([UserRole.ADMIN]),
	scoreGetByIdValidator,
	validateRequest,
	getById,
);

router.post(
	"/update",
	authMiddleware,
	roleMiddleware([UserRole.ADMIN]),
	// courseEditValidator,
	// validateRequest,
	updateScore,
);


export default router;
