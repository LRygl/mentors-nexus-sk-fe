// ============================================================================
// ADMIN API - For admins managing any user's enrollments
// ============================================================================

import type { EnrollmentType } from '$lib/API/Public/EnrollmentPublicAPI';
import { BaseApiService } from '$lib/API/APIBase';
import { API_CONFIG } from '$lib/API/APIConfiguration';
import type { CourseEnrollment } from '$lib/types/entities/CourseEnrollment';

export class EnrollmentAdminAPI extends BaseApiService {
	private readonly ENDPOINT = `${API_CONFIG.ENDPOINTS.ADMIN.ENROLLMENTS}`;

	constructor() {
		super(API_CONFIG.BASE_URL);
	}

	/**
	 * Get enrolled course IDs for any user
	 */
	async getEnrolledCourseIds(userId: string): Promise<number[]> {
		return this.get<number[]>(`${this.ENDPOINT}/users/${userId}`);
	}

	/**
	 * Get detailed enrollments for any user
	 */
	async getEnrolledCourses(userId: number | string): Promise<CourseEnrollment[]> {
		return this.get<CourseEnrollment[]>(`${this.ENDPOINT}/users/${userId}`);
	}

	/**
	 * Enroll any user in a course
	 */
	async enrollUser(userId: string, courseId: string): Promise<CourseEnrollment> {
		return this.post<CourseEnrollment>(`${this.ENDPOINT}/users/${userId}/courses/${courseId}`);
	}

	/**
	 * Unenroll any user from a course
	 */
	async unenrollUserFromCourse(userId: string, courseId: string): Promise<void> {
		return this.delete(`${this.ENDPOINT}/users/${userId}/courses/${courseId}`);
	}

	/**
	 * Get all students enrolled in a course
	 */
	async getCourseStudents(courseId: number): Promise<EnrollmentUserDTO[]> {
		return this.get<EnrollmentUserDTO[]>(`${this.ENDPOINT}/courses/${courseId}/students`);
	}

	/**
	 * Bulk enroll users in a course
	 */
	async bulkEnroll(
		courseId: number,
		userIds: number[],
		type: EnrollmentType = 'ADMIN_ASSIGNED'
	): Promise<void> {
		return this.post(`${this.ENDPOINT}/courses/${courseId}/bulk-enroll?type=${type}`, { userIds });
	}
}

export interface EnrollmentUserDTO {
	userId: number;
	firstName: string;
	lastName: string;
	email: string;
	enrolledAt: string;
	progress: number;
	type: EnrollmentType;
}

export const enrollmentAdminAPI = new EnrollmentAdminAPI();