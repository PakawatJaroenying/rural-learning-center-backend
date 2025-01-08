import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from "typeorm";
import { UserEntity } from "./UserEntity";
import { CourseEntity } from "./CourseEntity";

@Entity("course_students")
export class CourseStudentEntity {
	@PrimaryGeneratedColumn()
	id!: number;

	@ManyToOne(() => CourseEntity, (course) => course.courseStudents)
	course!: CourseEntity;

	@ManyToOne(() => UserEntity, (student) => student.courseStudent)
	student!: UserEntity;

	@Column({ type: "float", nullable: true })
	pretestScore!: number | null;

	@Column({ type: "float", nullable: true })
	posttestScore!: number | null;

	@Column({ type:'text', nullable: true })
	comment!: string | null;
}
