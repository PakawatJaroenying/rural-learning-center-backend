import { body, oneOf, query } from "express-validator";
import Container from "typedi";
import UserService from "../services/UserService";
import bcrypt from "bcrypt";


export const courseCreateValidator = [
	body("title").notEmpty().withMessage("Title is required"),
	body("description").notEmpty().withMessage("Description is required"),
	body("startDate").notEmpty().withMessage("Start date is required"),
	body("endDate").notEmpty().withMessage("End date is required"),
	body("location").notEmpty().withMessage("Location is required"),
	body("youtubeLink").notEmpty().withMessage("YouTube link is required"),
	body("isActive").notEmpty().withMessage("Active status is required"),
	body("startDate").custom((value, { req }) => {
		if (new Date(value) >= new Date(req.body.endDate)) {
			throw new Error("Start date must be before end date");
		}
		return true;
	}),
];

export const courseEditValidator = [
    ...courseCreateValidator,
    query("id").notEmpty().withMessage("ID is required"),
];

export const courseGetByIdValidator = [
    query("id").notEmpty().withMessage("ID is required"),
];
