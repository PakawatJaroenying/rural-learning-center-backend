import Container from "typedi";
import { CurrentUserService } from "../services/CurrentUserService";
import { errorResponse, successResponse } from "../utils/ApiResponse";
import UserService from "../services/UserService";
import { Request, Response } from "express";
import { UserRole } from "../types/User";
import { body } from "express-validator";

const currentUserService = Container.get(CurrentUserService);
const userService = Container.get(UserService);

export const getAllUsers = async (req: Request, res: Response) => {
	try {
		const users = await userService.getAllUsers();
		successResponse(
			res,
			users.map((x) => ({
				...x,
				enrolledCourses: x.courseStudent.map((y) => ({
					id: y.course.id,
					name: y.course.title,
				})),
			})),
			"Users retrieved successfully",
			200
		);
	} catch (error) {
		console.error(error);
		errorResponse(res, "Server error", 500);
	}
};

export const getUserById = async (
	req: Request<{}, {}, {}, { id: string }>,
	res: Response
) => {
	try {
		const { id } = req.query;
		const user = await userService.getUserById(Number(id));
		successResponse(res, user, "User retrieved successfully", 200);
	} catch (error) {
		console.error(error);
		errorResponse(res, "Server error", 500);
	}
};

export const deletUser = async (
	req: Request<{}, {}, { id: number }, {}>,
	res: Response
) => {
	try {
		const { id } = req.body;
		await userService.deleteUserById(Number(id));
		successResponse(res, {}, "User deleted successfully", 200);
	} catch (error) {
		console.error(error);
		errorResponse(res, "Server error", 500);
	}
};

export const updateUser = async (
	req: Request<
		{},
		{},
		{
			id: number;
			name?: string;
			parentName?: string;
			phoneNumber?: string;
			address?: string;
			schoolName?: string;
			role?: UserRole;
		},
		{}
	>,
	res: Response
) => {
	try {
		const file = req.file;
		const updatedUser = await userService.updateUserById(req.body.id, {
			...req.body,
			image: file ? (file as any).location : null,
			updatedAt: new Date(),
			updatedBy: {
				id: currentUserService.getCurrentUser()!.id,
			},
		});
		successResponse(res, updatedUser, "User updated successfully", 200);
	} catch (error) {
		console.error(error);
		errorResponse(res, "Server error", 500);
	}
};
