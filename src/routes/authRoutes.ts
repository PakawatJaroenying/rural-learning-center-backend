import { Router } from "express";
import { login, refreshToken, register } from "../controllers/authController";
import {
	registerValidator,
	loginValidator,
	refreshTokenValidator,
} from "../validators/authValidators";
import { validateRequest } from "../middlewares/validationMiddleware";
import { authenMiddleware } from "../middlewares/authMiddleware";
import Container from "typedi";
import { CurrentUserService } from "../services/CurrentUserService";

const router = Router();
router.post("/login", loginValidator, validateRequest, login);
router.post("/register", registerValidator, validateRequest, register);
router.post(
	"/refresh-token",
	refreshTokenValidator,
	validateRequest,
	authenMiddleware,
	Container.get(CurrentUserService).authorizeUserMiddleware,
	refreshToken
);

export default router;
