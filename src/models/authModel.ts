export interface RegisterRequest {
	username: string;
	password: string;
	name: string;
	parentName?: string;
	phoneNumber?: string;
	address?: string;
	schoolName?: string;
}

export interface LoginRequest {
	username: string;
	password: string;
}

export interface RefreshTokenRequest {
	refreshToken: string;
}
