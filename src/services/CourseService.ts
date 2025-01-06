import { Service } from "typedi";
import { AppDataSource } from "../data-source";
import { UserEntity } from "../entities/UserEntity";
import jwt from "jsonwebtoken";
import { JwtPayload } from "../models/jwtPayloadModel";
import { CourseEntity } from "../entities/CourseEntity";
import { CreateCourseModel } from "../models/courseModel";

interface CreateCourseModelRepo extends CreateCourseModel {
	teachers: UserEntity[];
}

@Service()
class CourseService {
	private courseRepository = AppDataSource.getRepository(CourseEntity);

	async getAllCourses(): Promise<CourseEntity[]> {
		return await this.courseRepository.find();
	}

	async getById(id: number): Promise<CourseEntity | null> {
		return await this.courseRepository.findOneBy({
			id,
		});
	}

	async createCourse(model: CreateCourseModelRepo): Promise<CourseEntity> {
		const newCourse = this.courseRepository.create(model);
		return await this.courseRepository.save(newCourse);
	}

	async updateCourse(id: number, model: CreateCourseModelRepo): Promise<CourseEntity | null> {
		const course = await this.courseRepository.findOneBy({ id });
		if (!course) {
			return null;
		}
		const updatedCourse = this.courseRepository.merge(course, model);
		return await this.courseRepository.save(updatedCourse);
	}
}

export default CourseService;
