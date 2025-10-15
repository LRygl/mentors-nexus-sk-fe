import type { User } from '$lib/types/entities/User';

export interface LoginRequest {
	email: string;
	password: string;
	rememberMe: boolean;
}

export interface LoginResponse {
	user: User;
}

export interface RegisterRequest {
	firstName: string;
	lastName: string;
	email: string;
	telephoneNumber: string;
	password: string;
	personalDataProcessing: boolean;
	personalDataPublishing: boolean;
	marketing: boolean;
}


