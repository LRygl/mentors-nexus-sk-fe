// ============================================================================
// ADMIN API - For admins managing any user's enrollments
// ============================================================================

import type { EnrolledCourseDTO, EnrollmentType } from '$lib/API/Public/EnrollmentPublicAPI';
import { BaseApiService } from '$lib/API/APIBase';
import { API_CONFIG } from '$lib/API/APIConfiguration';

export class EnrollmentAdminAPI extends BaseApiService {
	private readonly ENDPOINT = `${API_CONFIG.ENDPOINTS.ADMIN}/enrollments`;

	constructor() {
		super(API_CONFIG.BASE_URL);
	}

	/**
	 * Get enrolled course IDs for any user
	 */
	async getEnrolledCourseIds(userId: number): Promise<number[]> {
		return this.get<number[]>(`${this.ENDPOINT}/users/${userId}/ids`);
	}

	/**
	 * Get detailed enrollments for any user
	 */
	async getEnrollments(userId: number): Promise<EnrolledCourseDTO[]> {
		return this.get<EnrolledCourseDTO[]>(`${this.ENDPOINT}/users/${userId}`);
	}

	/**
	 * Enroll any user in a course
	 */
	async enrollUser(
		userId: number,
		courseId: number,
		type: EnrollmentType = 'ADMIN_ASSIGNED'
	): Promise<EnrolledCourseDTO> {
		return this.post<EnrolledCourseDTO>(
			`${this.ENDPOINT}/users/${userId}/courses/${courseId}?type=${type}`,
			{}
		);
	}

	/**
	 * Unenroll any user from a course
	 */
	async unenrollUser(userId: number, courseId: number): Promise<void> {
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