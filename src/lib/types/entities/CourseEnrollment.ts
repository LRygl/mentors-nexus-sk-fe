import type { User } from '$lib/types/entities/User';
import type { Course } from '$lib/types/entities/Course';
import type { BaseEntity } from '$lib/types';

/**
 * Enrollment type enum matching Spring Boot backend
 */
export enum EnrollmentType {
	PURCHASED = 'PURCHASED',
	GIFTED = 'GIFTED',
	ADMIN_ASSIGNED = 'ADMIN_ASSIGNED',
	FREE = 'FREE',
	PROMOTIONAL = 'PROMOTIONAL'
}


/**
 * Full CourseEnrollment entity
 * Maps to com.mentors.applicationstarter.Model.CourseEnrollment
 */
export interface CourseEnrollment extends BaseEntity {
	// Related entities (can be full objects or just IDs depending on fetch strategy)
	user: User | number;  // User object or userId
	course: Course | number;  // Course object or courseId

	enrolledAt: string;  // ISO 8601 string (Instant from backend)
	type: EnrollmentType;
	progressPercent: number;
	lastAccessedAt?: string | null;  // ISO 8601 string, nullable
	orderId?: number | null;
}

/**
 * Simplified DTO for enrolled courses list
 * Maps to com.mentors.applicationstarter.DTO.Course.EnrolledCourseDTO
 */
export interface EnrolledCourseDTO {
	courseId: number;
	courseName: string;
	courseImageUrl?: string | null;
	enrolledAt: string;  // ISO 8601 string
	progress?: number | null;  // Completion percentage (0-100)
}

/**
 * Request payload for creating a new enrollment
 */
export interface CreateEnrollmentRequest {
	userId: number;
	courseId: number;
	type?: EnrollmentType;
	orderId?: number;
}

/**
 * Request payload for updating enrollment progress
 */
export interface UpdateEnrollmentRequest {
	progressPercent?: number;
	lastAccessedAt?: string;
}

/**
 * Enrollment with course details (common response format)
 */
export interface EnrollmentWithCourse extends Omit<CourseEnrollment, 'course'> {
	course: Course;  // Always populated
}

/**
 * Enrollment with user details (common for admin views)
 */
export interface EnrollmentWithUser extends Omit<CourseEnrollment, 'user'> {
	user: User;  // Always populated
}

/**
 * Type guard to check if enrollment has full course object
 */
export function hasFullCourse(enrollment: CourseEnrollment): enrollment is EnrollmentWithCourse {
	return typeof enrollment.course === 'object';
}

/**
 * Type guard to check if enrollment has full user object
 */
export function hasFullUser(enrollment: CourseEnrollment): enrollment is EnrollmentWithUser {
	return typeof enrollment.user === 'object';
}

/**
 * Helper to extract course ID from enrollment
 */
export function getCourseId(enrollment: CourseEnrollment): string {
	return typeof enrollment.course === 'number'
		? enrollment.course
		: enrollment.course.id;
}

/**
 * Helper to extract user ID from enrollment
 */
export function getUserId(enrollment: CourseEnrollment): number {
	return typeof enrollment.user === 'number'
		? enrollment.user
		: enrollment.user.id;
}