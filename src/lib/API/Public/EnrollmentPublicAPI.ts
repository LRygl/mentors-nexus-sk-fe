import { BaseApiService } from '$lib/API/APIBase';
import { API_CONFIG } from '$lib/API/APIConfiguration';

export type EnrollmentType = 'PURCHASED' | 'ADMIN_ASSIGNED' | 'GIFTED' | 'FREE' | 'PROMOTIONAL';

// Types
export interface EnrolledCourseDTO {
	courseId: number;
	courseName: string;
	courseImageUrl: string | null;
	enrolledAt: string;
	progress: number;
	type: EnrollmentType;
}

// ============================================================================
// PUBLIC API - For authenticated users managing their own enrollments
// ============================================================================

export class EnrollmentPublicAPI extends BaseApiService {
	private readonly ENDPOINT = `${API_CONFIG.ENDPOINTS.PUBLIC}/enrollments`;

	constructor() {
		super(API_CONFIG.BASE_URL);
	}

	/**
	 * Get current user's enrolled course IDs
	 */
	async getMyEnrolledCourseIds(): Promise<number[]> {
		return this.get<number[]>(`${this.ENDPOINT}/ids`);
	}

	/**
	 * Get current user's detailed enrollments
	 */
	async getMyEnrollments(): Promise<EnrolledCourseDTO[]> {
		return this.get<EnrolledCourseDTO[]>(`${this.ENDPOINT}`);
	}

	/**
	 * Check if current user is enrolled in a course
	 */
	async checkEnrollmentStatus(courseId: number): Promise<boolean> {
		const response = await this.get<{ enrolled: boolean }>(
			`${this.ENDPOINT}/courses/${courseId}/status`
		);
		return response.enrolled;
	}

	/**
	 * Enroll current user in a course
	 */
	async enroll(courseId: number): Promise<EnrolledCourseDTO> {
		return this.post<EnrolledCourseDTO>(`${this.ENDPOINT}/courses/${courseId}`, {});
	}

	/**
	 * Unenroll current user from a course
	 */
	async unenroll(courseId: number): Promise<void> {
		return this.delete(`${this.ENDPOINT}/courses/${courseId}`);
	}
}

export const enrollmentPublicAPI = new EnrollmentPublicAPI();