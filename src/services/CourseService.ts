import { Service } from "typedi";
import { AppDataSource } from "../data-source";
import { UserEntity } from "../entities/UserEntity";
import jwt from "jsonwebtoken";
import { JwtPayload } from "../models/jwtPayloadModel";
import { CourseEntity } from "../entities/CourseEntity";
import { CreateCourseModel } from "../models/courseModel";
import { DeepPartial, LessThanOrEqual, Like, MoreThanOrEqual } from "typeorm";
import { PaginationRequest } from "../types/Pagination";

// interface CreateCourseModelRepo extends CreateCourseModel {
// 	teachers: UserEntity[];
// 	coverImage: string | null;
// 	createdAt: Date;
// 	createdBy: UserEntity;
// }

// interface UpdateCourseModelRepo extends CreateCourseModel {
// 	teachers: UserEntity[];
// 	coverImage: string | null;
// 	updatedAt: Date;
// 	updatedBy: UserEntity;
// }

@Service()
class CourseService {
	private courseRepository = AppDataSource.getRepository(CourseEntity);

	async getAllCoursesPageIndex(
		request: PaginationRequest
	): Promise<[CourseEntity[], number]> {
		const { page, pageSize } = request;
		const skip = (page - 1) * pageSize;

		return await this.courseRepository.findAndCount({
			order:
				request.sortBy && request.sortOrder
					? {
							[request.sortBy]: request.sortOrder,
					  }
					: undefined,
			where: {
				title: request.filters?.title
					? Like(`%${request.filters?.title || ""}%`)
					: undefined,
				startDate: request.filters?.startDate
					? request.filters?.startDate
					: undefined,
				endDate: request.filters?.endDate
					? request.filters?.endDate
					: undefined,
				teachingDate: request.filters?.teachingDate
					? request.filters?.teachingDate
					: undefined,
				location: request.filters?.location
					? Like(`%${request.filters?.location || ""}%`)
					: undefined,
				isActive: request.filters?.isActive
					? request.filters?.isActive
					: undefined,
			},
			skip,
			take: pageSize,
			
		});
	}

	async getAllCoursesStudentPageIndex(
		request: PaginationRequest
	): Promise<[CourseEntity[], number]> {
		const { page, pageSize } = request;
		const skip = (page - 1) * pageSize;

		return await this.courseRepository.findAndCount({
			order:
				request.sortBy && request.sortOrder
					? {
							[request.sortBy]: request.sortOrder,
					  }
					: undefined,
			where: {
				title: request.filters?.title
					? Like(`%${request.filters?.title || ""}%`)
					: undefined,
				teachingDate: request.filters?.teachingDate
					? request.filters?.teachingDate
					: undefined,
				location: request.filters?.location
					? Like(`%${request.filters?.location || ""}%`)
					: undefined,
				isActive: request.filters?.isActive
					? request.filters?.isActive
					: undefined,
			},
			skip,
			take: pageSize,
			relations: {
				courseStudents: true,
			},
		});
	}

	async getActivateCourses(): Promise<CourseEntity[]> {
		return await this.courseRepository.find({
			where: {
				isActive: true,
				startDate: LessThanOrEqual(new Date()),
				endDate: MoreThanOrEqual(new Date()),
			},
			order: {
				id: "ASC",
			},
		});
	}

	async getById(id: number): Promise<CourseEntity | null> {
		return await this.courseRepository.findOne({
			where: { id },
			relations: ["teachers", "courseStudents"],
		});
	}

	async createCourse(model: DeepPartial<CourseEntity>): Promise<CourseEntity> {
		const newCourse = this.courseRepository.create({
			...model,
		});
		return await this.courseRepository.save(newCourse);
	}

	async updateCourse(
		id: number,
		model: DeepPartial<CourseEntity>
	): Promise<CourseEntity | null> {
		const course = await this.courseRepository.findOneBy({ id });
		if (!course) {
			return null;
		}
		const updatedCourse = this.courseRepository.merge(course, model);
		return await this.courseRepository.save(updatedCourse);
	}

	async deleteCourse(id: number): Promise<void> {
		await this.courseRepository.delete(id);
	}
}

export default CourseService;
