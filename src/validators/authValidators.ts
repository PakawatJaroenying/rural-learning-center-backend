import { body, oneOf } from "express-validator";
import Container from "typedi";
import UserService from "../services/UserService";
import bcrypt from "bcrypt";

const userService = Container.get(UserService);

export const registerValidator = [
	body("username")
		.notEmpty()
		.withMessage("Username is required")
		.isLength({ min: 3 })
		.withMessage("Username must be at least 3 characters long")
		.custom(async (username) => {
			const existingUser = await userService.findByUsername(username);
			if (existingUser) {
				throw new Error("Username is already taken");
			}
		}),
	body("password")
		.notEmpty()
		.withMessage("Password is required")
		.isLength({ min: 6 })
		.withMessage("Password must be at least 6 characters long"),
];

export const loginValidator = [
	body("username")
		.notEmpty()
		.withMessage("Username is required")
		.custom(async (username, { req }) => {
			const user = await userService.findByUsername(username);
			if (!user) {
				throw new Error("Invalid credentials");
			}
		}),
	body("password")
		.notEmpty()
		.withMessage("Password is required")
		.custom(async (password, { req }) => {
			const user = await userService.findByUsername(req.body.username);
			const isMatch = await bcrypt.compare(password, user!.password);
			if (!isMatch) {
				throw new Error("Invalid credentials");
			}
		}),
];

export const refreshTokenValidator = [
	body("refreshToken").notEmpty().withMessage("Refresh token is required"),
];
