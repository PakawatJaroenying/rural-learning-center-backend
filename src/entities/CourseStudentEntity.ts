import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, JoinColumn } from "typeorm";
import { UserEntity } from "./UserEntity";
import { CourseEntity } from "./CourseEntity";

@Entity("course_students")
export class CourseStudentEntity {
	@PrimaryGeneratedColumn()
	id!: number;

	@Column({ type: "float", nullable: true })
	pretestScore!: number | null;

	@Column({ type: "float", nullable: true })
	posttestScore!: number | null;

	@Column({ type:'text', nullable: true })
	comment!: string | null;


	@ManyToOne(() => CourseEntity, (course) => course.courseStudents,{
		onDelete: "CASCADE",
	})
	@JoinColumn()
	course!: CourseEntity;

	@ManyToOne(() => UserEntity, (student) => student.courseStudent,{
		onDelete: "CASCADE",
	})
	@JoinColumn()
	student!: UserEntity;

}
