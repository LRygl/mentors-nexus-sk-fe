import type { Authority } from '$lib/types/authority';
import type { Course } from './course';

export interface User {
	id: number;
	firstName: string;
	lastName: string;
	email: string;
	telephoneNumber: string;
	userProfileImageUrl: string;
	lastLoginDate: string | null;
	lastLoginDateDisplay: string | null;
	registerDate: string;
	lastUpdatedDate: string | null;
	passwordResetOperationUUID: string | null;
	passwordResetExpiryDate: string | null;
	isAccountNonLocked: boolean;
	personalDataProcessing: boolean | null;
	personalDataPublishing: boolean | null;
	forcePasswordChangeOnLogin: boolean | null;
	marketing: boolean | null;
	role: string;
	ownedCourses: Course[];
	joinedCourses: Course[];
	accountNonLocked: boolean;
	authorities: Authority[];
	accountNonExpired: boolean;
	credentialsNonExpired: boolean;
	uuid: string;
}

export interface UserSummary {
 	id: number,
	firstName: string,
	lastName: string,
	email: string,
}

export interface UserStoreState {
	data: User[];
	loading: boolean;
	error: string | null;
	loaded: boolean;
}

export type UserListResponse = User[];