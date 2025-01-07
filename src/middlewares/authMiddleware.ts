import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { Container } from "typedi";
import { JwtPayload } from "../models/jwtPayloadModel";
import { CurrentUserService } from "../services/CurrentUserService";
import { errorResponse } from "../utils/ApiResponse";

const currentUserService = Container.get(CurrentUserService);

export const authMiddleware = (req: Request, res: Response, next: NextFunction):  void => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            errorResponse(res, "Unauthorized", 401);
            return;
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

        // Inject user into DI Container
        currentUserService.setCurrentUser(decoded);
        
        next();
    } catch (error) {
        console.error(error);
        errorResponse(res, "Unauthorized", 401);
    }
};
