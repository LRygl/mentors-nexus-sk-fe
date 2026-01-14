import type { EnrolledCourseDTO, EnrollmentType } from '$lib/API/Public/EnrollmentPublicAPI';
import { enrollmentAdminAPI, type EnrollmentUserDTO } from '$lib/API/Admin/EnrollmentAdminAPI';
import { toastService } from '$lib/Services/ToastService.svelte';

class EnrollmentAdminService {
	// =========================================================================
	// USER ENROLLMENTS
	// =========================================================================

	/**
	 * Get all enrollments for a specific user
	 */
	async getUserEnrollments(userId: number): Promise<EnrolledCourseDTO[]> {
		try {
			return await enrollmentAdminAPI.getEnrollments(userId);
		} catch (error) {
			toastService.error('Error', 'Failed to load user enrollments');
			throw error;
		}
	}

	/**
	 * Get enrolled course IDs for a user
	 */
	async getUserEnrolledIds(userId: number): Promise<number[]> {
		try {
			return await enrollmentAdminAPI.getEnrolledCourseIds(userId);
		} catch (error) {
			toastService.error('Error', 'Failed to load enrollment IDs');
			throw error;
		}
	}

	/**
	 * Enroll a user in a course
	 */
	async enrollUser(
		userId: number,
		courseId: number,
		type: EnrollmentType = 'ADMIN_ASSIGNED'
	): Promise<EnrolledCourseDTO> {
		try {
			const enrollment = await enrollmentAdminAPI.enrollUser(userId, courseId, type);
			toastService.success('Success', 'User enrolled successfully');
			return enrollment;
		} catch (error) {
			const message = error instanceof Error ? error.message : 'Failed to enroll user';
			toastService.error('Error', message);
			throw error;
		}
	}

	/**
	 * Unenroll a user from a course
	 */
	async unenrollUser(userId: number, courseId: number, userName?: string): Promise<boolean> {
		const message = userName
			? `Remove ${userName} from this course?`
			: 'Remove user from this course?';

		if (!confirm(message)) {
			return false;
		}

		try {
			await enrollmentAdminAPI.unenrollUser(userId, courseId);
			toastService.success('Success', 'User unenrolled successfully');
			return true;
		} catch (error) {
			toastService.error('Error', 'Failed to unenroll user');
			throw error;
		}
	}

	// =========================================================================
	// COURSE STUDENTS
	// =========================================================================

	/**
	 * Get all students enrolled in a course
	 */
	async getCourseStudents(courseId: number): Promise<EnrollmentUserDTO[]> {
		try {
			return await enrollmentAdminAPI.getCourseStudents(courseId);
		} catch (error) {
			toastService.error('Error', 'Failed to load course students');
			throw error;
		}
	}

	/**
	 * Bulk enroll users in a course
	 */
	async bulkEnrollUsers(
		courseId: number,
		userIds: number[],
		type: EnrollmentType = 'ADMIN_ASSIGNED'
	): Promise<void> {
		if (userIds.length === 0) {
			toastService.warning('Warning', 'No users selected');
			return;
		}

		try {
			await enrollmentAdminAPI.bulkEnroll(courseId, userIds, type);
			toastService.success('Success', `${userIds.length} users enrolled successfully`);
		} catch (error) {
			toastService.error('Error', 'Failed to enroll users');
			throw error;
		}
	}
}

export const enrollmentAdminService = new EnrollmentAdminService();
