export interface RegisterRequest {
	username: string;
	password: string;
}

export interface LoginRequest {
	username: string;
	password: string;
}

export interface RefreshTokenRequest {
	refreshToken: string;
}
