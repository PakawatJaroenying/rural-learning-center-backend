import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany } from "typeorm";
import { UserRole } from "../types/User";
import { CourseEntity } from "./CourseEntity";
import { CourseStudentEntity } from "./CourseStudentEntity";

@Entity("users")
export class UserEntity {
	@PrimaryGeneratedColumn()
	id!: number;

	@Column()
	name: string = "";

	@Column({ unique: true })
	username: string = "";

	@Column()
	password!: string;

	@Column({
		type: "enum",
		enum: UserRole,
		nullable: true,
		default: UserRole.USER,
	})
	role: UserRole = UserRole.USER;

	@Column({ type: "text", nullable: true })
	refreshToken: string | null = null;

	@ManyToMany(() => CourseEntity, course => course.teachers)
	courseTeachers!: CourseEntity[];

	@OneToMany(() => CourseStudentEntity, course => course.student)
  	courseStudent!: CourseStudentEntity[];
}
