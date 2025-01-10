import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	OneToMany,
	ManyToMany,
	OneToOne,
} from "typeorm";
import { UserRole } from "../types/User";
import { CourseEntity } from "./CourseEntity";
import { CourseStudentEntity } from "./CourseStudentEntity";

@Entity("users")
export class UserEntity {
	@PrimaryGeneratedColumn()
	id!: number;

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

	@Column()
	name: string = "";

	@Column({ type: "text", nullable: true })
	parentName: string | null = null;

	@Column({ type: "text", nullable: true })
	phoneNumber: string | null = null;

	@Column({ type: "text", nullable: true })
	address: string | null = null;

	@Column({ type: "text", nullable: true })
	schoolName: string | null = null;

	@Column({ type: "text", nullable: true })
	image: string | null = null;

	@ManyToMany(() => CourseEntity, (course) => course.teachers, {
		cascade: true,
	})
	courseTeachers!: CourseEntity[];

	@OneToMany(() => CourseStudentEntity, (course) => course.student, {
		cascade: true,
	})
	courseStudent!: CourseStudentEntity[];

	//updateBy
	@OneToOne(() => UserEntity)
	updatedBy: UserEntity | null = null;

	@Column({
		type: "timestamp",
		nullable: true,
	})
	updatedAt: Date | null = null;
}
