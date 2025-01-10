import { Service } from "typedi";
import { AppDataSource } from "../data-source";
import { UserEntity } from "../entities/UserEntity";
import jwt from "jsonwebtoken";
import { JwtPayload } from "../models/jwtPayloadModel";
import { DeepPartial } from "typeorm";

@Service()
class UserService {
	private userRepository = AppDataSource.getRepository(UserEntity);

	async getAllUsers(): Promise<UserEntity[]> {
		return await this.userRepository.find({
			relations: ["courseStudent", "courseStudent.course"],
		});
	}

	async getUserById(id: number): Promise<UserEntity> {
		return await this.userRepository.findOneOrFail({
			where: { id },
		});
	}

	async updateUserById(
		id: number,
		data: DeepPartial<UserEntity>
	): Promise<UserEntity> {
		const oldUser = await this.userRepository.findOneOrFail({ where: { id } });
		const updatedUser = this.userRepository.merge(oldUser, data);
		return await this.userRepository.save(updatedUser);
	}

	async deleteUserById(id: number): Promise<void> {
		await this.userRepository.delete(id);
	}

	async findByUsername(username: string): Promise<UserEntity | null> {
		return await this.userRepository.findOneBy({ username });
	}

	async createUser({
		username,
		hashedPassword,
		parentName,
		phoneNumber,
		address,
		schoolName,
		name,
	}: {
		username: string;
		hashedPassword: string;
		name: string;
		parentName?: string;
		phoneNumber?: string;
		address?: string;
		schoolName?: string;
	}): Promise<UserEntity> {
		const newUser = this.userRepository.create({
			name,
			parentName,
			phoneNumber,
			address,
			schoolName,
			username,
			password: hashedPassword,
		});
		return await this.userRepository.save(newUser);
	}

	async saveRefreshToken(userId: number, refreshToken: string) {
		await this.userRepository.update(userId, { refreshToken });
	}

	generateAccessToken = (payload: JwtPayload) => {
		return jwt.sign(payload, process.env.JWT_SECRET!, {
			expiresIn: process.env.JWT_EXPIRES_IN!,
		});
	};

	generateRefreshToken = (payload: JwtPayload) => {
		return jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, {
			expiresIn: process.env.JWT_REFRESH_EXPIRES_IN!,
		});
	};
}

export default UserService;
