import Container from "typedi";
import { CurrentUserService } from "../services/CurrentUserService";
import { errorResponse, successResponse } from "../utils/ApiResponse";
import UserService from "../services/UserService";
import { Request, Response } from "express";
import { UserRole } from "../types/User";
import { body } from "express-validator";
import { PaginationRequest, PaginationResponse } from "../types/Pagination";

const currentUserService = Container.get(CurrentUserService);
const userService = Container.get(UserService);

export const getAllUsers = async (
	req: Request<{}, {}, PaginationRequest>,
	res: Response
) => {
	try {

		const [users,totalItems] = await userService.getAllUserPageIndex(req.body);
		const response: PaginationResponse<any> = {
			data: users.map((x) => ({
				...x,
				enrolledCourses: x.courseStudent.map((y) => ({
					id: y.course.id,
					name: y.course.title,
				})),
			})),
			currentPage: req.body.page,
			pageSize: req.body.pageSize,
			totalItems,
			totalPages: Math.ceil(totalItems / req.body.pageSize),
		};

		// ส่ง Response
		successResponse(res, response, "Users retrieved successfully", 200);
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
			name?: string;
			parentName?: string;
			phoneNumber?: string;
			address?: string;
			schoolName?: string;
			role?: UserRole;
		},
		{
			id: string;
		}
	>,
	res: Response
) => {
	try {
		const { name, parentName, phoneNumber, address, schoolName, role } =
			req.body;
		const file = req.file;
		const updatedUser = await userService.updateUserById(Number(req.query.id), {
			name: name,
			parentName: parentName || null,
			phoneNumber: phoneNumber || null,
			address: address || null,
			schoolName: schoolName || null,
			role: role || UserRole.USER,
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
