import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { errorResponse, successResponse } from "../utils/ApiResponse";
import Container from "typedi";
import UserService from "../services/UserService";
import { RegisterRequest } from "../models/authModel";
import bcrypt from "bcrypt";
import { CurrentUserService } from "../services/CurrentUserService";
import { CreateCourseModel } from "../models/courseModel";
import CourseService from "../services/CourseService";
import CourseStudentService from "../services/CourseStudentService";
import { verifyToken } from "../utils/VerifyToken";
import { PaginationResponse } from "../types/Pagination";

const courseService = Container.get(CourseService);
const courseStudentService = Container.get(CourseStudentService);
const currentUserService = Container.get(CurrentUserService);

const getAllCourses = async (req: Request, res: Response) => {
	try {
		const [courses, totalItems] = await courseService.getAllCoursesPageIndex(
			req.body
		);
		const response: PaginationResponse<any> = {
			data: courses.map((x) => ({
				...x,
			})),
			currentPage: req.body.page,
			pageSize: req.body.pageSize,
			totalItems,
			totalPages: Math.ceil(totalItems / req.body.pageSize),
		};
		successResponse(
			res,
			response,
			"Courses retrieved successfully",
			200
		);
	} catch (error) {
		console.error(error);
		errorResponse(res, "Server error", 500);
	}
};

const getActivateCourses = async (req: Request, res: Response) => {
	try {
		const courses = await courseService.getActivateCourses();
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
		const currentUser = verifyToken(
			req.headers.authorization?.split(" ")[1] || ""
		);
		console.log(currentUser);

		successResponse(
			res,
			{
				...course,
				teachers: course?.teachers.map((teacher) => ({
					image: teacher.image,
					name: teacher.name,
				})),
				can_enroll: !currentUser
					? true
					: !(await courseStudentService.isUserEnrolledInCourse(
							Number(id),
							currentUser?.id
					  )),
				applicants_count: course?.courseStudents?.length || 0,
			},
			"Course retrieved successfully",
			200
		);
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
			duration,
			shortDescription,
			teachingDate,
			titleEn,
		} = req.body;

		const file = req.file;

		const queryRunner = AppDataSource.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction();
		try {
			const newCourse = await courseService.createCourse({
				coverImage: file ? (file as any).location : null, // URL ของไฟล์ใน Spaces
				title,
				description,
				startDate,
				endDate,
				location,
				youtubeLink,
				isActive,
				duration,
				shortDescription,
				teachingDate,
				titleEn,
				teachers: [
					{
						id: currentUserService.getCurrentUser()?.id!,
					},
				],
				createdAt: new Date(),
				createdBy: {
					id: currentUserService.getCurrentUser()?.id!,
				},
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
			duration,
			shortDescription,
			teachingDate,
			titleEn,
		} = req.body;

		const file = req.file;
		const queryRunner = AppDataSource.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction();
		try {
			const updatedCourse = await courseService.updateCourse(
				Number(req.query.id),
				{
					coverImage: file ? (file as any).location : null,
					title,
					description,
					startDate,
					endDate,
					location,
					youtubeLink,
					isActive,
					duration,
					shortDescription,
					teachingDate,
					titleEn,
					updatedAt: new Date(),
					updatedBy: { id: currentUserService.getCurrentUser()?.id! },
					teachers: [
						{
							id: currentUserService.getCurrentUser()?.id!,
						},
					],
				}
			);
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

const deleteCourse = async (
	req: Request<
		{},
		{},
		{
			id: string;
		},
		{}
	>,
	res: Response
) => {
	try {
		const course = await courseService.getById(Number(req.body.id));
		if (!course) {
			errorResponse(res, "Course not found", 404);
			return;
		}
		await courseService.deleteCourse(Number(req.body.id));
		successResponse(res, null, "Course deleted successfully", 200);
	} catch (error) {
		console.error(error);
		errorResponse(res, "Server error", 500);
	}
};

const enrollCourse = async (
	req: Request<
		{},
		{},
		{
			id: string;
		},
		{}
	>,
	res: Response
) => {
	try {
		const createdCourseStudent = await courseStudentService.addStudentToCourse(
			Number(req.body.id)
		);
		successResponse(
			res,
			createdCourseStudent,
			"Course enrolled successfully",
			200
		);
	} catch (error) {
		console.error(error);
		errorResponse(res, "Server error", 500);
	}
};

export {
	createCourse,
	getAllCourses,
	getById,
	editCourse,
	getActivateCourses,
	deleteCourse,
	enrollCourse,
};
