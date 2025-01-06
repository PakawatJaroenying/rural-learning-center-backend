import { UserRole } from "../types/User";

export interface JwtPayload {
	id: number; // หรือ string หาก id เป็น UUID
	username: string;
}
