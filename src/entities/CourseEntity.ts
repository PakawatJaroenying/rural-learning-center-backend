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

	@Column({
		type: "text",
		nullable: true,
	})
	coverImage: string | null = null;

	@Column()
	title: string = "";

	@Column({
		default: "",
	})
	titleEn: string = "";

	@Column({
		type:'float',
		default: 0
	})
	duration: number = 0;

	@Column()
	description: string = "";

	@Column({
		default: "",
	})
	shortDescription: string = "";

	@Column({
		type: "timestamp",
	})
	startDate: Date = new Date();

	@Column({
		type: "timestamp",
	})
	endDate: Date = new Date();

	@Column({
		type: "timestamp",
		default: () => "CURRENT_TIMESTAMP",
	})
	teachingDate: Date = new Date();

	@Column()
	location: string = "";

	@Column()
	youtubeLink: string = "";

	@Column({
		type: "boolean",
		default: true,
	})
	isActive: boolean = true;



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

	@ManyToMany(() => UserEntity, (teacher) => teacher.courseTeachers,{
		onDelete: "CASCADE",
	})
	@JoinTable({
		name: "course_teachers",
	})
	teachers!: UserEntity[];

	@OneToMany(() => CourseStudentEntity, (courseStudent) => courseStudent.course,{
		onDelete: "CASCADE",
	})
	courseStudents!: CourseStudentEntity[];

	@ManyToOne(() => UserEntity,{
		onDelete: "SET NULL",
	})
	createdBy!: UserEntity;

	@ManyToOne(() => UserEntity,{
		onDelete: "SET NULL"
	})
	updatedBy: UserEntity | null = null;
}
