import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { errorResponse, successResponse } from "../utils/ApiResponse";
import Container from "typedi";
import { CurrentUserService } from "../services/CurrentUserService";
import { CreateCourseModel } from "../models/courseModel";
import CourseService from "../services/CourseService";
import CourseStudentService from "../services/CourseStudentService";
import { UpdateScoreModel } from "../models/scoreModel";

const courseService = Container.get(CourseService);
const courseStudentService = Container.get(CourseStudentService);
const currentUserService = Container.get(CurrentUserService);

const getAllScores = async (req: Request, res: Response) => {
	try {
		const courses = await courseService.getAllCourses();
		successResponse(
			res,
			courses.map((course) => ({
				...course,
				applicants_count: course?.courseStudents?.length || 0,
			})),
			"Courses retrieved successfully",
			200
		);
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
		const courseStudents = await courseStudentService.getById(Number(id));
		successResponse(
			res,
			courseStudents?.map((courseStudent) => ({
                id : courseStudent.id,
				courseId: courseStudent.course.id,
				courseTitle: courseStudent.course.title,
				studentId: courseStudent.student.id,
				studentName: courseStudent.student.name,
				phoneNumber: courseStudent.student.phoneNumber,
				pretestScore: courseStudent.pretestScore,
				posttestScore: courseStudent.posttestScore,
				comment: courseStudent.comment,
			})),
			"Course retrieved successfully",
			200
		);
	} catch (error) {
		errorResponse(res, "Server error", 500);
	}
};

const updateScore = async (
	req: Request<{}, {}, UpdateScoreModel[], {}>,
	res: Response
) => {
	try {
		const scores = req.body;

		const queryRunner = AppDataSource.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction();
		try {
			const updatedScores = await courseStudentService.updateScore(scores);
			successResponse(res, updatedScores, "updated score successfully", 201);
		} catch {
			await queryRunner.rollbackTransaction();
			throw new Error("Failed to update score");
		}
	} catch (error) {
		console.error(error);
		errorResponse(res, "Server error", 500);
	}
};

export { getAllScores, getById, updateScore };