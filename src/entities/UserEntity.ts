import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { UserRole } from "../types/User";

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
}
