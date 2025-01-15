import { Service } from "typedi";
import { AppDataSource } from "../data-source";
import { UserEntity } from "../entities/UserEntity";
import jwt from "jsonwebtoken";
import { JwtPayload } from "../models/jwtPayloadModel";
import { DeepPartial, Like } from "typeorm";
import { PaginationRequest } from "../types/Pagination";

@Service()
class UserService {
	private userRepository = AppDataSource.getRepository(UserEntity);


	async getAllUserPageIndex(
		request: PaginationRequest
	): Promise<[UserEntity[], number]> {
		const { page, pageSize } = request;
		const skip = (page - 1) * pageSize;
		
		return await this.userRepository.findAndCount({
			order:
				request.sortBy && request.sortOrder
					? {
							[request.sortBy]: request.sortOrder,
					  }
					: undefined,
			where: {
				name: request.filters?.name ? Like(`%${request.filters?.name || ""}%`) : undefined,
				role: request.filters?.role ?  request.filters?.role : undefined,
				parentName: request.filters?.parentName ? Like(`%${request.filters?.parentName || ""}%`) : undefined,
				phoneNumber: request.filters?.phoneNumber ? Like(`%${request.filters?.phoneNumber || ""}%`) : undefined,
				address: request.filters?.address ? Like(`%${request.filters?.address || ""}%`) : undefined,
				schoolName: request.filters?.schoolName ? Like(`%${request.filters?.schoolName || ""}%`) : undefined,
				username: request.filters?.username ? Like(`%${request.filters?.username || ""}%`) : undefined,
			},
			skip,
			take: pageSize,
			relations: {
				courseStudent:{
					course: true
				},
				courseTeachers:true
			},
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
		const updateResult = await this.userRepository.update(
			{
				id,
			},
			data
		);
		if (updateResult.affected === 0) {
			throw new Error("User not found");
		}
		return await this.userRepository.findOneOrFail({ where: { id } });
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
