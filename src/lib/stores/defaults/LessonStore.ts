import { BaseStoreSvelte } from '$lib/stores/BaseStore.svelte';
import type { Lesson } from '$lib/types/entities/Lesson';
import { lessonAdminApiService, type LessonAdminApiService } from '$lib/API/Admin/LessonAdminAPI';
import type { Course } from '$lib/types/entities/Course';
import { courseAdminApiService } from '$lib/API/Admin/CourseAdminAPI';


export class LessonStoreSvelte extends BaseStoreSvelte<
	Lesson,
	Partial<Lesson>,
	Partial<Lesson>,
	LessonAdminApiService> {

	constructor() {
		super(lessonAdminApiService);
	}

	async fetchAll(): Promise<Lesson[]> {
		this._loading = true;

		try {
			this._data = await this.apiService.getAllLessons();
			return this._data;
		} catch (error) {
			console.error('[STORE] Error fetching all Lessons:', error);
			throw error;
		} finally {
			this._loading = false;
		}
	}

	async fetchItem(lessonId: string): Promise<Lesson> {
		this._loadingItem = true;  // Use item loading state
		this._itemError = null;

		try {
			const course = await this.apiService.getLessonById(lessonId);
			this._selectedItem = course;  // ← Store in selectedItem, not data array
			return course;
		} catch (error) {
			this._itemError = error instanceof Error ? error.message : 'Failed to load lesson';
			console.error('[STORE] Error fetching lesson:', error);
			throw error;
		} finally {
			this._loadingItem = false;
		}
	}

	// ============================================================================
	// BASIC CRUD - These are the low-level API calls
	// ============================================================================

	async createItem(createData: Partial<Lesson>): Promise<Lesson> {
		return await this.apiService.createLesson(createData);
	}

	async updateItem(lessonId: string, updateData: Partial<Lesson>, imageFile?: File): Promise<Lesson> {
		return await this.apiService.updateLesson(lessonId, updateData, imageFile);
	}


	async deleteItem(id: string): Promise<void> {
		return await this.apiService.deleteLesson(id);
	}

	// ============================================================================
	// ENHANCED CRUD - These wrap the basic CRUD with state management
	// ============================================================================

	/**
	 * Wrapper for update that includes image handling
	 * This is what the page should call
	 */
	async update(id: string, updateData: Partial<Lesson>, imageFile?: File): Promise<Lesson | null> {
		if (this._updating) {
			console.warn('[CourseStoreSvelte] Update already in progress');
			return null;
		}

		this._updating = true;
		this._updateError = null;

		try {
			const updatedItem = await this.updateItem(id, updateData, imageFile);

			// Update in data array using the base store utility
			this.updateItemInStore(id, updatedItem);

			return updatedItem;
		} catch (error) {
			this._updateError = error instanceof Error ? error.message : 'Failed to update course';
			console.error('[CourseStoreSvelte] Error updating course:', error);
			throw error;
		} finally {
			this._updating = false;
		}
	}

	// ============================================================================
	// External entity lesson link/unlink
	// ============================================================================

	/**
	 * Unlink a lesson from its section
	 * Used when unlinking from Lessons page (no course context)
	 * Updates the lesson list after successful unlink
	 */
	async unlinkFromCourseSection(lessonId: string, sectionId: string): Promise<void> {
		console.log('[LessonStore] Unlinking lesson:', lessonId, 'from section:', sectionId);

		// Find the lesson in the store
		const lesson = this.getItemById(lessonId);

		if (!lesson) {
			throw new Error(`Lesson with id ${lessonId} not found`);
		}

		// Store original for potential rollback
		const originalLesson = { ...lesson };

		try {
			// Optimistic update: clear section reference
			this.updateItemInStore(lessonId, {
				...lesson,
				sectionId: undefined,
				section: undefined
			} as Lesson);

			// Make API call using course API service
			await courseAdminApiService.unlinkLesson(sectionId, lessonId);

			// Refresh the lesson to get updated state from server
			await this.refreshItem(lessonId);

			console.log('[LessonStore] Lesson unlinked and refreshed successfully');
		} catch (error) {
			// Rollback on error
			console.error('[LessonStore] Error unlinking lesson, rolling back:', error);
			this.updateItemInStore(lessonId, originalLesson);
			throw error;
		}
	}

}

export const lessonStore = new LessonStoreSvelte();