import Container, { Service } from "typedi";
import { AppDataSource } from "../data-source";
import { UserEntity } from "../entities/UserEntity";
import jwt from "jsonwebtoken";
import { JwtPayload } from "../models/jwtPayloadModel";
import { CourseEntity } from "../entities/CourseEntity";
import { CreateCourseModel } from "../models/courseModel";
import { LessThanOrEqual, MoreThanOrEqual } from "typeorm";
import { CourseStudentEntity } from "../entities/CourseStudentEntity";
import { CurrentUserService } from "./CurrentUserService";

@Service()
class CourseStudentService {
	private courseRepository = AppDataSource.getRepository(CourseEntity);
	private courseStudentEntity =
		AppDataSource.getRepository(CourseStudentEntity);
	private userEntity = AppDataSource.getRepository(UserEntity);

	async checkEnrolled(courseId: number): Promise<boolean> {
        console.log('courseId',courseId)
        console.log('Container.get(CurrentUserService).getCurrentUser()?.id',Container.get(CurrentUserService).getCurrentUser()?.id)
		return !!(await this.courseStudentEntity.findOne({
			where: {
				course: {
					id: courseId,
				},
				student: {
					id: Container.get(CurrentUserService).getCurrentUser()?.id,
				},
			},
		}));
	}

	async enrollCourse(courseId: number): Promise<CourseStudentEntity | null> {
		const course = await this.courseRepository.findOneBy({ id: courseId });

		const student = await this.userEntity.findOneBy({
			id: Container.get(CurrentUserService).getCurrentUser()?.id,
		});

		if (!course || !student) {
			return null;
		}

		const courseStudent = this.courseStudentEntity.create({
			course,
			student,
		});
		return await this.courseStudentEntity.save(courseStudent);
	}
}

export default CourseStudentService;
