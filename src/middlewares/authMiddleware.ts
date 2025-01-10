import { Request, Response, NextFunction } from "express";
import { errorResponse } from "../utils/ApiResponse";
import { verifyToken } from "../utils/VerifyToken";

export const authenMiddleware = (
	req: Request,
	res: Response,
	next: NextFunction
): void => {
	try {
		const authHeader = req.headers.authorization;
		if (!authHeader || !authHeader.startsWith("Bearer ")) {
			errorResponse(res, "Unauthorized", 401);
			return;
		}
		const token = authHeader.split(" ")[1];
		const decoded = verifyToken(token);
		if (!decoded) {
			errorResponse(res, "Unauthorized", 401);
			return;
		}

		next();
	} catch (error) {
		console.error(error);
		errorResponse(res, "Unauthorized", 401);
	}
};
