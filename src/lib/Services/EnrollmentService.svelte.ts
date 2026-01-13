import { ROUTES } from '$lib/Config/routes.config';
import { goto } from '$app/navigation';
import { toastService } from '$lib/Services/ToastService.svelte';
import { authStore } from '$lib/stores/Auth.svelte';
import { enrollmentStore } from '$lib/stores/defaults/EnrollmentStore.svelte';
import { enrollmentPublicAPI } from '$lib/API/Public/EnrollmentPublicAPI';

class EnrollmentServiceSvelte {
	// =========================================================================
	// INITIALIZATION
	// =========================================================================

	/**
	 * Initialize enrollment data after login
	 * Called from AuthService after successful authentication
	 */
	async initialize(enrolledCourseIds?: number[]): Promise<void> {
		console.log('[Auth] Courses');
		if (enrolledCourseIds) {
			// Use IDs from login response (faster)
			console.log('Enrollment Ids:', enrolledCourseIds);
			enrollmentStore.setEnrolledCourseIds(enrolledCourseIds);
		} else {
			// Fetch from API if not provided
			console.log('Enrollment Id not set');
			await enrollmentStore.fetchEnrolledIds();
		}
	}

	/**
	 * Refresh enrollment data from server
	 */
	async refresh(): Promise<void> {
		await enrollmentStore.fetchEnrollments();
	}

	// =========================================================================
	// ENROLLMENT OPERATIONS
	// =========================================================================

	/**
	 * Enroll current user in a course
	 * Handles authentication check and redirects
	 */
	async enrollInCourse(courseId: number, returnUrl?: string): Promise<boolean> {
		// Check if logged in
		if (!authStore.isAuthenticated) {
			const redirect = returnUrl || window.location.pathname;
			goto(`${ROUTES.AUTH.LOGIN}?redirect=${encodeURIComponent(redirect)}`);
			return false;
		}

		// Check if already enrolled
		if (enrollmentStore.isEnrolledIn(courseId)) {
			toastService.info('Info', 'You are already enrolled in this course');
			return true;
		}

		enrollmentStore.setLoading(true);
		enrollmentStore.setError(null);

		try {
			const enrollment = await enrollmentPublicAPI.enroll(courseId);

			// Update store
			enrollmentStore.addEnrolledCourse(courseId, enrollment);

			toastService.success('Success', 'Successfully enrolled in course!');
			return true;
		} catch (error) {
			const message = error instanceof Error ? error.message : 'Failed to enroll';
			enrollmentStore.setError(message);
			toastService.error('Error', message);
			return false;
		} finally {
			enrollmentStore.setLoading(false);
		}
	}

	/**
	 * Unenroll current user from a course
	 */
	async unenrollFromCourse(courseId: number, confirmMessage?: string): Promise<boolean> {
		// Confirm action
		const message = confirmMessage || 'Are you sure you want to unenroll from this course?';
		if (!confirm(message)) {
			return false;
		}

		enrollmentStore.setLoading(true);
		enrollmentStore.setError(null);

		try {
			await enrollmentPublicAPI.unenroll(courseId);

			// Update store
			enrollmentStore.removeEnrolledCourse(courseId);

			toastService.success('Success', 'Successfully unenrolled from course');
			return true;
		} catch (error) {
			const message = error instanceof Error ? error.message : 'Failed to unenroll';
			enrollmentStore.setError(message);
			toastService.error('Error', message);
			return false;
		} finally {
			enrollmentStore.setLoading(false);
		}
	}

	// =========================================================================
	// COURSE ACCESS
	// =========================================================================

	/**
	 * Check if user can access course content
	 */
	canAccessCourse(courseId: number): boolean {
		return enrollmentStore.isEnrolledIn(courseId);
	}

	/**
	 * Navigate to course content (with access check)
	 */
	async goToCourseContent(courseId: number): Promise<void> {
		if (!this.canAccessCourse(courseId)) {
			toastService.error('Access Denied', 'You need to enroll in this course first');
			goto(`${ROUTES.PUBLIC.COURSE}/${courseId}`);
			return;
		}

		goto(`${ROUTES.LEARN.COURSE}/${courseId}`);
	}

	// =========================================================================
	// PROGRESS TRACKING
	// =========================================================================

	/**
	 * Update lesson completion and recalculate progress
	 */
	async completeLesson(courseId: number, lessonId: number): Promise<void> {
		try {
			// Call API to mark lesson complete
			// const result = await enrollmentPublicAPI.completeLesson(courseId, lessonId);
			// Update local progress
			// enrollmentStore.updateProgress(courseId, result.progress);
		} catch (error) {
			console.error('Failed to update progress:', error);
		}
	}

	// =========================================================================
	// CLEANUP
	// =========================================================================

	/**
	 * Clear enrollment data on logout
	 */
	clear(): void {
		enrollmentStore.reset();
	}
}

export const enrollmentService = new EnrollmentServiceSvelte();
