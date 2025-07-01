import type { Authority } from '$lib/types/authority';

export interface User {
	id: number;
	firstName: string;
	lastName: string;
	email: string;
	telephoneNumber: string;
	lastLoginDate: string | null;
	lastLoginDateDisplay: string | null;
	registerDate: string;
	lastUpdatedDate: string | null;
	passwordResetOperationUUID: string | null;
	passwordResetExpiryDate: string | null;
	isAccountNonLocked: boolean;
	personalDataProcessing: boolean | null;
	personalDataPublishing: boolean | null;
	marketing: boolean | null;
	role: string;
	enabled: boolean;
	username: string;
	accountNonLocked: boolean;
	authorities: Authority[];
	accountNonExpired: boolean;
	credentialsNonExpired: boolean;
	uuid: string;
}

export interface UserListResponse {

}