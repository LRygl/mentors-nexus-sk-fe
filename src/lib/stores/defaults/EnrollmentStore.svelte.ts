import { type EnrolledCourseDTO, enrollmentPublicAPI } from '$lib/API/Public/EnrollmentPublicAPI';

class EnrollmentStoreSvelte {
	// =========================================================================
	// REACTIVE STATE
	// =========================================================================

	private _enrolledCourseIds = $state<Set<number>>(new Set());
	private _enrollments = $state<EnrolledCourseDTO[]>([]);
	private _loading = $state(false);
	private _error = $state<string | null>(null);
	private _initialized = $state(false);

	// =========================================================================
	// GETTERS - Reactive access
	// =========================================================================

	get enrolledCourseIds(): Set<number> {
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

	get initialized(): boolean {
		return this._initialized;
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
	isEnrolledIn(courseId: number | string): boolean {
		const numericId = typeof courseId === 'string' ? parseInt(courseId, 10) : courseId;
		return this._enrolledCourseIds.has(numericId);
	}

	/**
	 * Get enrollment details for a specific course
	 */
	getEnrollment(courseId: number): EnrolledCourseDTO | undefined {
		return this._enrollments.find((e) => e.courseId === courseId);
	}

	/**
	 * Get enrollments sorted by date (newest first)
	 */
	get recentEnrollments(): EnrolledCourseDTO[] {
		return [...this._enrollments].sort(
			(a, b) => new Date(b.enrolledAt).getTime() - new Date(a.enrolledAt).getTime()
		);
	}

	/**
	 * Get enrollments in progress (< 100%)
	 */
	get inProgressEnrollments(): EnrolledCourseDTO[] {
		return this._enrollments.filter((e) => e.progress > 0 && e.progress < 100);
	}

	/**
	 * Get completed enrollments
	 */
	get completedEnrollments(): EnrolledCourseDTO[] {
		return this._enrollments.filter((e) => e.progress === 100);
	}

	// =========================================================================
	// STATE MUTATIONS
	// =========================================================================

	/**
	 * Set enrolled course IDs (called on login)
	 */
	setEnrolledCourseIds(ids: number[]): void {
		this._enrolledCourseIds = new Set(ids);
		this._initialized = true;
	}

	/**
	 * Add a course to enrolled set
	 */
	addEnrolledCourse(courseId: number, enrollment?: EnrolledCourseDTO): void {
		this._enrolledCourseIds = new Set([...this._enrolledCourseIds, courseId]);

		if (enrollment) {
			this._enrollments = [...this._enrollments, enrollment];
		}
	}

	/**
	 * Remove a course from enrolled set
	 */
	removeEnrolledCourse(courseId: number): void {
		const newSet = new Set(this._enrolledCourseIds);
		newSet.delete(courseId);
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
			this._initialized = true;
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
			this._initialized = true;
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
		this._initialized = false;
	}
}

export const enrollmentStore = new EnrollmentStoreSvelte();
