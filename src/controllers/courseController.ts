import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { errorResponse, successResponse } from "../utils/ApiResponse";
import Container from "typedi";
import UserService from "../services/UserService";
import { RegisterRequest } from "../models/authModel";
import bcrypt from "bcrypt";
import { CurrentUserService } from "../services/CurrentUser";
import { CreateCourseModel } from "../models/courseModel";
import CourseService from "../services/CourseService";

const courseService = Container.get(CourseService);
const userService = Container.get(UserService);
const currentUserService = Container.get(CurrentUserService);

const getAllCourses = async (req: Request, res: Response) => {
	try {
		const courses = await courseService.getAllCourses();
		successResponse(res, courses, "Courses retrieved successfully", 200);
	} catch (error) {
		console.error(error);
		errorResponse(res, "Server error", 500);
	}
};

const getById = async (
	req: Request<
		{},
		{},
		{},
		{
			id: string;
		}
	>,
	res: Response
) => {
	try {
		const { id } = req.query;
		const course = await courseService.getById(Number(id));
		console.log("-----------");
		console.log(course);
		successResponse(res, course, "Course retrieved successfully", 200);
	} catch (error) {
		errorResponse(res, "Server error", 500);
	}
};

const createCourse = async (
	req: Request<{}, {}, CreateCourseModel>,
	res: Response
) => {
	try {
		const {
			title,
			description,
			startDate,
			endDate,
			location,
			youtubeLink,
			isActive,
		} = req.body;

		const queryRunner = AppDataSource.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction();
		try {
			const teacher = await userService.findByUsername(
				currentUserService.getCurrentUser()!.username
			);
			const newCourse = await courseService.createCourse({
				title,
				description,
				startDate,
				endDate,
				location,
				youtubeLink,
				isActive,
				teachers: [teacher!],
			});
			successResponse(res, newCourse, "User registered successfully", 201);
		} catch {
			await queryRunner.rollbackTransaction();
			throw new Error("Failed to create course");
		}
	} catch (error) {
		console.error(error);
		errorResponse(res, "Server error", 500);
	}
};

const editCourse = async (
	req: Request<
		{},
		{},
		CreateCourseModel,
		{
			id: string;
		}
	>,
	res: Response
) => {
	try {
		const {
			title,
			description,
			startDate,
			endDate,
			location,
			youtubeLink,
			isActive,
		} = req.body;

		const queryRunner = AppDataSource.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction();
		try {
			const teacher = await userService.findByUsername(
				currentUserService.getCurrentUser()!.username
			);
			const updatedCourse = await courseService.updateCourse(Number(req.query.id), {
				title,
				description,
				startDate,
				endDate,
				location,
				youtubeLink,
				isActive,
				teachers: [teacher!],
			});
			successResponse(res, updatedCourse, "User registered successfully", 201);
		} catch {
			await queryRunner.rollbackTransaction();
			throw new Error("Failed to create course");
		}
	} catch (error) {
		console.error(error);
		errorResponse(res, "Server error", 500);
	}
};

export { createCourse, getAllCourses, getById, editCourse };
