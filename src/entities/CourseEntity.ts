import {
	Column,
	Entity,
	JoinTable,
	ManyToMany,
	ManyToOne,
	OneToMany,
	OneToOne,
	PrimaryGeneratedColumn,
} from "typeorm";
import { UserEntity } from "./UserEntity";
import { CourseStudentEntity } from "./CourseStudentEntity";

@Entity("courses")
export class CourseEntity {
	@PrimaryGeneratedColumn()
	id!: number;

	@Column()
	title: string = "";

	@Column()
	description: string = "";

	@Column({
		type: "timestamp",
	})
	startDate: Date = new Date();

	@Column({
		type: "timestamp",
	})
	endDate: Date = new Date();

	@Column()
	location: string = "";

	@Column()
	youtubeLink: string = "";

	@Column({
		type: "boolean",
		default: true,
	})
	isActive: boolean = true;

	@ManyToMany(() => UserEntity, (teacher) => teacher.courseTeachers)
	@JoinTable({
		name: "course_teachers",
	})
	teachers!: UserEntity[];

	@OneToMany(() => CourseStudentEntity, (courseStudent) => courseStudent.course)
	courseStudents!: CourseStudentEntity[];

	@Column({
		type: "timestamp",
		default: () => "CURRENT_TIMESTAMP",
	})
	createdAt: Date = new Date();

	@Column({
		type: "timestamp",
		nullable: true,
	})
	updatedAt: Date | null = null;

	@ManyToOne(() => UserEntity)
	createdBy!: UserEntity;

	@ManyToOne(() => UserEntity)
	updatedBy: UserEntity | null = null;
}
