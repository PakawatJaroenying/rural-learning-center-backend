import { Service } from "typedi";
import { AppDataSource } from "../data-source";
import { UserEntity } from "../entities/UserEntity";
import jwt from "jsonwebtoken";
import { JwtPayload } from "../models/jwtPayloadModel";

@Service()
class UserService {
	private userRepository = AppDataSource.getRepository(UserEntity);

	async findByUsername(username: string): Promise<UserEntity | null> {
		return await this.userRepository.findOneBy({ username });
	}

	async createUser(
		username: string,
		hashedPassword: string
	): Promise<UserEntity> {
		const newUser = this.userRepository.create({
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
