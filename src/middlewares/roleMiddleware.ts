import { Request, Response, NextFunction } from "express";
import { UserRole } from "../types/User";
import Container from "typedi";
import { CurrentUserService } from "../services/CurrentUserService";
import UserService from "../services/UserService";
import { errorResponse } from "../utils/ApiResponse";

const currentUserService = Container.get(CurrentUserService);
const userService = Container.get(UserService);

const roleMiddleware = (requiredRole: UserRole[]) => {
	return async (req: Request, res: Response, next: NextFunction) => {
		if (!currentUserService.getCurrentUser()) {
			errorResponse(res, "Unauthorized", 401);
			return;
		}
		const user = await userService.findByUsername(
			currentUserService.getCurrentUser()!.username
		);
		if (!user) {
			errorResponse(res, "Unauthorized", 401);
			return;
		}


		if (!requiredRole.includes(user.role)) {
			errorResponse(res, "Forbidden", 403);
			return;
		}
		next();
	};
};

export default roleMiddleware;
