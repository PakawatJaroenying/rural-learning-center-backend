import Container, { Inject, Service } from "typedi";
import { JwtPayload } from "../models/jwtPayloadModel";
import { AsyncLocalStorage } from "node:async_hooks";
import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/VerifyToken";
import { errorResponse } from "../utils/ApiResponse";

const asyncLocalStorage = new AsyncLocalStorage<Map<string, any>>();

@Service()
export class CurrentUserService {
	private keyCurrentUser = "currentUser";

	authorizeUserMiddleware = (req: Request, res: Response, next: NextFunction) => {
		try {
			const authHeader = req.headers.authorization;

			if (!authHeader || !authHeader.startsWith("Bearer ")) {
				throw new Error("Invalid or missing authorization header");
			}

			const token = authHeader.split(" ")[1];
			const decoded = verifyToken(token) as JwtPayload;

			// สร้าง context ใหม่
			const store = new Map<string, any>();
			store.set(this.keyCurrentUser, decoded);

			asyncLocalStorage.run(store, () => {
				next();
			});
		} catch (error) {
			console.error(error);
			errorResponse(res, "Unauthorized", 401);
		}
	};

	getCurrentUser = (): JwtPayload | null => {
		const store = asyncLocalStorage.getStore(); // ดึง context ปัจจุบันจาก AsyncLocalStorage
		if (!store) {
			throw new Error(
				"No AsyncLocalStorage context available. Ensure middleware is applied."
			);
		}
		return store.get(this.keyCurrentUser) || null;
	};
}
