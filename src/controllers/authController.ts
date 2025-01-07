import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { errorResponse, successResponse } from "../utils/ApiResponse";
import Container from "typedi";
import UserService from "../services/UserService";
import {
	RegisterRequest,
	LoginRequest,
	RefreshTokenRequest,
} from "../models/authModel";
import bcrypt from "bcrypt";
import { JwtPayload } from "../models/jwtPayloadModel";
import { CurrentUserService } from "../services/CurrentUserService";
import dayjs from "dayjs";

const userService = Container.get(UserService);
const currentUserService = Container.get(CurrentUserService);

const register = async (
	req: Request<{}, {}, RegisterRequest>,
	res: Response
) => {
	try {
		const {
			name,
			username,
			password,
			address,
			parentName,
			phoneNumber,
			schoolName,
		} = req.body;
		const queryRunner = AppDataSource.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction();
		try {
			const hashedPassword = await bcrypt.hash(password, 10);
			const newUser = await userService.createUser({
				name,
				address,
				parentName,
				phoneNumber,
				schoolName,
				username,
				hashedPassword,
			});
			successResponse(res, newUser, "User registered successfully", 201);
		} catch {
			await queryRunner.rollbackTransaction();
			throw new Error("Failed to create user");
		}
	} catch (error) {
		console.error(error);
		errorResponse(res, "Server error", 500);
	}
};

const login = async (req: Request<{}, {}, LoginRequest>, res: Response) => {
	try {
		const { username, password } = req.body;
		const user = await userService.findByUsername(username);
		const payload: JwtPayload = {
			id: user!.id,
			username: user!.username,
		};
		const accessToken = userService.generateAccessToken(payload);
		const refreshToken = userService.generateRefreshToken(payload);

		await userService.saveRefreshToken(user!.id, refreshToken);

		successResponse(
			res,
			{
				user: {
					username: user?.username,
					role: user?.role,
				},
				accessToken,
				accessTokenExpireIn: dayjs().add(
					parseInt(process.env.JWT_EXPIRES_IN_SECONDS!),
					"second"
				),
				refreshToken,
				refreshTokenExpireIn: dayjs().add(
					parseInt(process.env.JWT_REFRESH_EXPIRES_IN_SECONDS!),
					"second"
				),
			},
			"Login successful"
		);
	} catch (error) {
		console.error(error);
		errorResponse(res, "Server error", 500);
	}
};

const refreshToken = async (
	req: Request<{}, {}, RefreshTokenRequest>,
	res: Response
) => {
	try {
		const user = await userService.findByUsername(
			currentUserService.getCurrentUser()?.username!
		);
		if (!user || user.refreshToken !== req.body.refreshToken) {
			errorResponse(res, "Invalid refresh token", 400);
			return;
		}
		const payload: JwtPayload = {
			id: user!.id,
			username: user!.username,
		};
		const accessToken = userService.generateAccessToken(payload);
		const newRefreshToken = userService.generateRefreshToken(payload);

		await userService.saveRefreshToken(user!.id, newRefreshToken);

		successResponse(
			res,
			{
				accessToken,
				accessTokenExpireIn: dayjs().add(
					parseInt(process.env.JWT_EXPIRES_IN_SECONDS!),
					"second"
				),
				refreshToken: newRefreshToken,
				refreshTokenExpireIn: dayjs().add(
					parseInt(process.env.JWT_REFRESH_EXPIRES_IN_SECONDS!),
					"second"
				),
			},
			"Token refreshed successfully"
		);
	} catch (error) {
		console.error(error);
		errorResponse(res, "Server error", 500);
	}
};

export { register, login, refreshToken };
