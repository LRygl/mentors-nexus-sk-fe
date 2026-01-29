import type { User } from '$lib/types/entities/User';

export interface AuthUser {
	id: string;
	uuid: string;
	firstName: string;
	lastName: string;
	email: string;
	role: string;
	enrolledCourseIds: number[];
	enrolledCoursesCount?: number;
}

export interface LoginRequest {
	email: string;
	password: string;
	rememberMe: boolean;
}

export interface LoginApiResponse {
	user: AuthUser;
	expiresIn: number;
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


