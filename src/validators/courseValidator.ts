import { body, oneOf, query } from "express-validator";
import Container from "typedi";
import UserService from "../services/UserService";
import bcrypt from "bcrypt";
import { CurrentUserService } from "../services/CurrentUserService";
import CourseService from "../services/CourseService";
import CourseStudentService from "../services/CourseStudentService";

const currentUserService = Container.get(CurrentUserService);
const courseService = Container.get(CourseService);
const courseStudentService = Container.get(CourseStudentService);

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

export const courseEnrollValidator = [
	body("id")
		.notEmpty()
		.withMessage("Course ID is required")
		.custom(async (value) => {
			const userService = Container.get(UserService);
			const user = await userService.findByUsername(
				currentUserService.getCurrentUser()?.username!
			);
			if (!user) {
				throw new Error("User not found");
			}
			
			const course = await courseService.getById(Number(value));
			if(!course || course.isActive === false){
				throw new Error("Course not found or inactive");
			}

			const isEnrolled = await courseStudentService.isUserEnrolledInCourse(Number(value))
			if(isEnrolled){
				throw new Error("ลงทะเบียนเรียนไปแล้ว");
			}
			return true;
		}),
];
