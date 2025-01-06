import { validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import { errorResponse } from "../utils/ApiResponse";

export const validateRequest = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
        errorResponse(res, errors.array().map((error) => error.msg).join(", "), 400);
		return;
	}
	next();
};
