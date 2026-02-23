import { Role } from '$lib/types/enums/Role';
import type { Course } from '$lib/types/entities/Course';
import type { Company } from '$lib/types/entities/Company';
import type { BaseEntity } from '$lib/types';

/**
 * Complete User Interface
 * Matches: com.mentors.applicationstarter.Model.User
 */
export interface User extends BaseEntity {
	// Primary fields
	id: string;
	uuid: string;
	firstName: string;
	lastName: string;
	email: string;
	telephoneNumber?: string;

	// Password is write-only in backend, not included in responses
	// forgot-password?: string; // Only for registration/update requests

	// Billing address – saved on the user profile and pre-filled at checkout
	// Backend: add nullable columns to the User entity and expose them in the profile DTO
	// Endpoint:  PUT /api/v1/user/profile   (save)
	//            GET /api/v1/user/me         (returns these fields together with the rest of the user)
	billingFirstName?: string;
	billingLastName?: string;
	billingStreet?: string;
	billingCity?: string;
	billingPostalCode?: string;
	billingCountry?: string;

	// Subject details
	lastLoginDate?: string; // ISO date string
	lastLoginDateDisplay?: string; // ISO date string
	registerDate?: string; // ISO date string
	lastUpdatedDate?: string; // ISO date string
	passwordResetOperationUUID?: string;
	passwordResetExpiryDate?: string; // ISO date string
	lightBg?: string; // Hex color code
	darkBg?: string; // Hex color code

	// Account status
	isAccountNonLocked: boolean;
	forcePasswordChangeOnLogin: boolean;

	// User consent details
	personalDataProcessing: boolean;
	personalDataPublishing: boolean;
	marketing: boolean;
	cookiePolicyConsent: boolean;

	// Relationships
	ownedCourses?: Course[];
	joinedCourses?: Course[];
	company?: Company;

	// Role
	role: Role;

	// Computed field from backend
	roleName?: string;
}

/**
 * Request DTOs for profile mutations
 * Backend: POST /api/v1/user/change-password
 */
export interface PasswordChangeRequest {
	currentPassword: string;
	newPassword: string;
}

/**
 * Request DTO for profile update
 * Backend: PUT /api/v1/user/profile
 * Returns the updated User object.
 */
export interface UserProfileUpdateRequest {
	firstName?: string;
	lastName?: string;
	telephoneNumber?: string;
	// Billing address fields
	billingFirstName?: string;
	billingLastName?: string;
	billingStreet?: string;
	billingCity?: string;
	billingPostalCode?: string;
	billingCountry?: string;
	// Consent flags
	personalDataProcessing?: boolean;
	personalDataPublishing?: boolean;
	marketing?: boolean;
}

/**
 * Type Guards
 */
export function isAdmin(user: User | null): boolean {
	return user?.role === Role.ADMIN || user?.role === Role.ROLE_ADMIN;
}

export function isCourseOwner(user: User | null): boolean {
	return user?.role === Role.ROLE_COURSE_OWNER;
}

export function isRegularUser(user: User | null): boolean {
	return user?.role === Role.USER;
}
