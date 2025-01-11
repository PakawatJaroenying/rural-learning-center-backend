import { Router } from "express";
import { authenMiddleware } from "../middlewares/authMiddleware";
import Container from "typedi";
import { CurrentUserService } from "../services/CurrentUserService";
import roleMiddleware from "../middlewares/roleMiddleware";
import { UserRole } from "../types/User";
import { deletUser, getAllUsers, getUserById, updateUser } from "../controllers/userController";
import upload from "../middlewares/multerMiddleware";
import { userDeleteValidator, userGetByIdValidator, userUpdateValidator } from "../validators/userValidators";
import { validateRequest } from "../middlewares/validationMiddleware";

const router = Router();

router.post(
	"/getAll",
	authenMiddleware,
	Container.get(CurrentUserService).authorizeUserMiddleware,
	roleMiddleware([UserRole.ADMIN]),
	getAllUsers
);

router.get(
	"/getById",
	authenMiddleware,
	Container.get(CurrentUserService).authorizeUserMiddleware,
	roleMiddleware([UserRole.ADMIN,UserRole.USER]),
    userGetByIdValidator,
    validateRequest,
    getUserById,
);

router.post(
    "/update",
    authenMiddleware,
    Container.get(CurrentUserService).authorizeUserMiddleware,
    roleMiddleware([UserRole.ADMIN]),
	upload.single("image"),
    userUpdateValidator,
    validateRequest,
    updateUser
);

router.post(
    "/delete",
    authenMiddleware,
    Container.get(CurrentUserService).authorizeUserMiddleware,
    roleMiddleware([UserRole.ADMIN]),
    userDeleteValidator,
    validateRequest,
    deletUser
);

export default router;
