import Container, { Service } from "typedi";
import { AppDataSource } from "../data-source";
import { UserEntity } from "../entities/UserEntity";
import { CourseEntity } from "../entities/CourseEntity";
import { CourseStudentEntity } from "../entities/CourseStudentEntity";
import { CurrentUserService } from "./CurrentUserService";
import { UpdateScoreModel } from "../models/scoreModel";

@Service()
class CourseStudentService {
	private courseRepository = AppDataSource.getRepository(CourseEntity);
	private courseStudentEntity =
		AppDataSource.getRepository(CourseStudentEntity);
	private userEntity = AppDataSource.getRepository(UserEntity);

	async checkEnrolled(courseId: number): Promise<boolean> {
		console.log("courseId", courseId);
		console.log(
			"Container.get(CurrentUserService).getCurrentUser()?.id",
			Container.get(CurrentUserService).getCurrentUser()?.id
		);
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
		const courseStudent = this.courseStudentEntity.create({
			course: {
				id: courseId,
			},
			student: {
				id: Container.get(CurrentUserService).getCurrentUser()?.id,
			},
		});
		return await this.courseStudentEntity.save(courseStudent);
	}

	async getById(courseId: number): Promise<CourseStudentEntity[] | null> {
		return await this.courseStudentEntity.find({
			where: {
				course: {
					id: courseId,
				},
			},
			order:{
				id: "ASC"
			},
			relations: ["course", "student"],
		});
	}

	async updateScore(
		model: UpdateScoreModel[]
	): Promise<CourseStudentEntity[] | null> {
		const updatedCourseStudents = await Promise.all(
			model.map(async (item) => {
				await this.courseStudentEntity.update(
					{ id: item.id },
					{
						pretestScore: item.pretestScore || null,
						posttestScore: item.posttestScore || null,
						comment: item.comment || null,
					}
				);
				return await this.courseStudentEntity.findOne({ where: { id: item.id } });
			})
		);
	
		return updatedCourseStudents.filter((student): student is CourseStudentEntity => student !== null);
	}
}

export default CourseStudentService;
