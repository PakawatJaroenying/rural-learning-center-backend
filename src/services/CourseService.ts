import { Service } from "typedi";
import { AppDataSource } from "../data-source";
import { UserEntity } from "../entities/UserEntity";
import jwt from "jsonwebtoken";
import { JwtPayload } from "../models/jwtPayloadModel";
import { CourseEntity } from "../entities/CourseEntity";
import { CreateCourseModel } from "../models/courseModel";
import { LessThanOrEqual, MoreThanOrEqual } from "typeorm";

interface CreateCourseModelRepo extends CreateCourseModel {
	teachers: UserEntity[];
	coverImage: string | null;
	createdAt: Date;
	createdBy: UserEntity;
}

interface UpdateCourseModelRepo extends CreateCourseModel {
	teachers: UserEntity[];
	coverImage: string | null;
	updatedAt: Date;
	updatedBy: UserEntity;
}

@Service()
class CourseService {
	private courseRepository = AppDataSource.getRepository(CourseEntity);
	
	async getAllCourses(): Promise<CourseEntity[]> {
		return await this.courseRepository.find({
			order: {
				id: "ASC",
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
			relations: ["teachers",'courseStudents'],
		});
	}

	async createCourse(model: CreateCourseModelRepo): Promise<CourseEntity> {
		const newCourse = this.courseRepository.create(model);
		return await this.courseRepository.save(newCourse);
	}

	async updateCourse(
		id: number,
		model: UpdateCourseModelRepo
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
