import { type EnrolledCourseDTO, enrollmentPublicAPI } from '$lib/API/Public/EnrollmentPublicAPI';
import type { Course } from '$lib/types/entities/Course';
import { BaseStoreSvelte } from '$lib/stores/BaseStore.svelte';
import { enrollmentAdminAPI, type EnrollmentAdminAPI } from '$lib/API/Admin/EnrollmentAdminAPI';
import { type CourseEnrollment, EnrollmentType } from '$lib/types/entities/CourseEnrollment';
import type { PaginatedResult, PaginationParams } from '$lib/types';

class EnrollmentStoreSvelte extends BaseStoreSvelte<
	CourseEnrollment,
	Partial<CourseEnrollment>,
	Partial<CourseEnrollment>,
	EnrollmentAdminAPI
> {
	constructor(apiService: EnrollmentAdminAPI) {
		super(apiService);
	}

	// =========================================================================
	// REACTIVE STATE
	// =========================================================================

	private _enrolledCourseIds = $state<Set<number>>(new Set());
	private _enrollments = $state<EnrolledCourseDTO[]>([]);

	protected _enrolledCoursesByUser = $state<Map<string, CourseEnrollment[]>>(new Map());
	protected _loadingEnrolledCourses = $state(false);

	// =========================================================================
	// REQUIRED ABSTRACT METHODS (unused, but required by BaseStoreSvelte)
	// =========================================================================

	async fetchPage(params: PaginationParams): Promise<PaginatedResult<CourseEnrollment>> {
		throw new Error('fetchPage not implemented - use getEnrolledCourses instead');
	}

	async fetchAll(): Promise<CourseEnrollment[]> {
		throw new Error('fetchAll not implemented - use getEnrolledCourses instead');
	}

	async fetchItem(id: string): Promise<CourseEnrollment> {
		throw new Error('fetchItem not implemented - enrollments are fetched by user');
	}

	async createItem(createRequest: Partial<CourseEnrollment>): Promise<CourseEnrollment> {
		throw new Error('createItem not implemented - use enrollUserInCourse instead');
	}

	async updateItem(id: string, data: Partial<CourseEnrollment>): Promise<CourseEnrollment> {
		throw new Error('updateItem not implemented - use updateProgress if needed');
	}

	async deleteItem(id: string | number): Promise<void> {
		throw new Error('deleteItem not implemented - use unenrollUserFromCourse instead');
	}

	// =========================================================================
	// GETTERS
	// =========================================================================

	get loadingEnrolledCourses(): boolean {
		return this._loadingEnrolledCourses;
	}

	// =========================================================================
	// ENROLLMENT OPERATIONS
	// =========================================================================

	/**
	 * Get enrolled courses for a specific user
	 */
	async enrollUserInCourse(
		userId: string,
		courseId: string,
		courseName: string
	): Promise<EnrolledCourseDTO> {
		console.log('[EnrollmentStore] Enrolling user:', { userId, courseId });

		// Get current enrollments
		const currentEnrollments = this._enrolledCoursesByUser.get(userId) || [];

		// Create optimistic enrollment
		const optimisticEnrollment: CourseEnrollment = {
			courseId: courseId,
			courseName: courseName,
			courseImageUrl: null,
			enrolledAt: new Date().toISOString(),
			progress: 0,
			type: EnrollmentType.ADMIN_ASSIGNED
		};

		// Store original state for rollback
		const originalEnrollments = [...currentEnrollments];

		try {
			// Optimistic update: Add enrollment immediately
			this._enrolledCoursesByUser.set(userId, [...currentEnrollments, optimisticEnrollment]);

			// Perform API call
			const enrollment: CourseEnrollment = await this.apiService.enrollUser(userId, courseId);

			// Update with real data from server
			const updatedEnrollments = await this.apiService.getEnrolledCourses(userId);
			this._enrolledCoursesByUser.set(userId, updatedEnrollments);

			return enrollment;
		} catch (error) {
			// Rollback on error
			this._enrolledCoursesByUser.set(userId, originalEnrollments);
			throw error;
		}
	}

	/**
	 * Unenroll user from course with optimistic update
	 */
	async unenrollUserFromCourse(userId: string, courseId: string ): Promise<void> {
		const courseIdNum = courseId;
		const currentEnrollments = this._enrolledCoursesByUser.get(userId) || [];
		const originalEnrollments = [...currentEnrollments];

		try {

			// Optimistic update - remove immediately from display list
			const optimisticEnrollments = currentEnrollments.filter((e) => e.courseId !== courseIdNum);
			this._enrolledCoursesByUser.set(userId, optimisticEnrollments);

			// Perform API call
			await this.apiService.unenrollUserFromCourse(userId, String(courseId));
		} catch (error) {
			// Rollback on error
			console.error('[EnrollmentStore] Unenrollment failed, rolling back:', error);
			this._enrolledCoursesByUser.set(userId, originalEnrollments);
			this._error = error instanceof Error ? error.message : 'Failed to unenroll user';
			throw error;
		}
	}

	// =========================================================================
	// GETTERS - Reactive access
	// =========================================================================

	get enrolledCourseIds(): Set<string> {
		return this._enrolledCourseIds;
	}

	get enrollments(): EnrolledCourseDTO[] {
		return this._enrollments;
	}

	get loading(): boolean {
		return this._loading;
	}

	get error(): string | null {
		return this._error;
	}

	get enrolledCount(): number {
		return this._enrolledCourseIds.size;
	}

	// =========================================================================
	// DERIVED STATE
	// =========================================================================

	/**
	 * Check if user is enrolled in a specific course
	 * O(1) lookup using Set
	 */
	isEnrolledIn(courseId: string): boolean {
		return this._enrolledCourseIds.has(courseId);
	}

	/**
	 * Get enrollment details for a specific course
	 */
	getEnrollment(courseId: number | string): EnrolledCourseDTO | undefined {
		return this._enrollments.find((e) => e.courseId === courseId);
	}

	/**
	 * Get enrolled courses for specific user
	 */
	async getEnrolledCourses(userId: string): Promise<CourseEnrollment[]> {
		// Return cached data if available
		if (this._enrolledCoursesByUser.has(userId)) {
			return this._enrolledCoursesByUser.get(userId)!;
		}

		this._loadingEnrolledCourses = true;
		try {
			// This endpoint returns full Course objects with enrollment data
			const courses = await this.apiService.getEnrolledCourses(userId);
			this._enrolledCoursesByUser.set(userId, courses);
			return courses;
		} catch (error) {
			console.error('[EnrollmentStore] Error fetching enrolled courses:', error);
			throw error;
		} finally {
			this._loadingEnrolledCourses = false;
		}
	}

	// =========================================================================
	// STATE MUTATIONS
	// =========================================================================

	/**
	 * Set enrolled course IDs (called on login)
	 */
	setEnrolledCourseIds(ids: number[]): void {
		this._enrolledCourseIds = new Set(ids);
	}

	/**
	 * Add a course to enrolled set
	 */
	addEnrolledCourse(courseId: string, enrollment?: EnrolledCourseDTO): void {
		this._enrolledCourseIds = new Set([...this._enrolledCourseIds, parseInt(courseId)]);

		if (enrollment) {
			this._enrollments = [...this._enrollments, enrollment];
		}
	}

	/**
	 * Remove a course from enrolled set
	 */
	removeEnrolledCourse(courseId: string): void {
		const newSet = new Set(this._enrolledCourseIds);
		newSet.delete(parseInt(courseId));
		this._enrolledCourseIds = newSet;

		this._enrollments = this._enrollments.filter((e) => e.courseId !== courseId);
	}

	/**
	 * Update enrollment progress
	 */
	updateProgress(courseId: number, progress: number): void {
		this._enrollments = this._enrollments.map((e) =>
			e.courseId === courseId ? { ...e, progress } : e
		);
	}

	/**
	 * Set loading state
	 */
	setLoading(loading: boolean): void {
		this._loading = loading;
	}

	/**
	 * Set error state
	 */
	setError(error: string | null): void {
		this._error = error;
	}

	// =========================================================================
	// DATA FETCHING
	// =========================================================================

	/**
	 * Fetch enrolled course IDs (lightweight)
	 */
	async fetchEnrolledIds(): Promise<void> {
		this._loading = true;
		this._error = null;

		try {
			const ids = await enrollmentPublicAPI.getMyEnrolledCourseIds();
			this._enrolledCourseIds = new Set(ids);
		} catch (error) {
			this._error = error instanceof Error ? error.message : 'Failed to fetch enrollments';
			throw error;
		} finally {
			this._loading = false;
		}
	}

	/**
	 * Fetch detailed enrollments
	 */
	async fetchEnrollments(): Promise<void> {
		this._loading = true;
		this._error = null;

		try {
			this._enrollments = await enrollmentPublicAPI.getMyEnrollments();
			this._enrolledCourseIds = new Set(this._enrollments.map((e) => e.courseId));
		} catch (error) {
			this._error = error instanceof Error ? error.message : 'Failed to fetch enrollments';
			throw error;
		} finally {
			this._loading = false;
		}
	}

	// =========================================================================
	// RESET
	// =========================================================================

	/**
	 * Clear all enrollment data (call on logout)
	 */
	reset(): void {
		this._enrolledCourseIds = new Set();
		this._enrollments = [];
		this._loading = false;
		this._error = null;
	}
}

export const enrollmentStore = new EnrollmentStoreSvelte(enrollmentAdminAPI);
