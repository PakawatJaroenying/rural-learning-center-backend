import { body, query } from "express-validator";

export const userGetByIdValidator = [
	query("id").notEmpty().withMessage("ID is required"),
];

export const userUpdateValidator = [
	query("id")
		.notEmpty()
		.withMessage("ID is required")
];

export const userDeleteValidator = [
	body("id")
		.notEmpty()
		.withMessage("ID is required")
		.isNumeric()
		.withMessage("ID must be a number"),
];
