import { BaseStoreSvelte } from '$lib/stores/BaseStore.svelte';
import type { Course } from '$lib/types/entities/Course';
import { courseAdminApiService, type CourseAdminApiService } from '$lib/API/Admin/CourseAdminAPI';
import type { CourseSection } from '$lib/types/entities/CourseSection';

// TODO Move to separate file
// Define the section creation request type
export interface CreateSectionRequest {
	title: string;
	description: string;
	orderIndex: number;
}

export class CourseStore extends BaseStoreSvelte<
	Course,
	Partial<Course>,
	Partial<Course>,
	CourseAdminApiService
> {

constructor() {
		super(courseAdminApiService);
	}

	async fetchAll(): Promise<Course[]> {
		this._loading = true;

		try {
			this._data = await this.apiService.getAllCourses();
			return this._data;
		} catch (error)  {
			console.error('[STORE] Error fetching all Courses');
			throw error;
		} finally {
			this._loading = false;
		}
	}

	async fetchItem(courseId: string): Promise<Course> {
		this._loadingItem = true;  // Use item loading state
		this._itemError = null;

		try {
			const course = await this.apiService.getCourseById(courseId);
			this._selectedItem = course;  // ← Store in selectedItem, not data array
			return course;
		} catch (error) {
			this._itemError = error instanceof Error ? error.message : 'Failed to load course';
			console.error('[STORE] Error fetching course:', error);
			throw error;
		} finally {
			this._loadingItem = false;
		}
	}

	/*
	* BASIC CRUD ACTIONS
	*/
	async createItem(createData: Partial<Course>, imageFile?: File): Promise<Course> {
		return await this.apiService.createCourse(createData, imageFile);
	}

	/**
	 * Update course with optional image
	 * @param id - Course ID
	 * @param updateData - Course data
	 * @param imageFile - Optional image file
	 */
	async updateItem(id: string, updateData: Partial<Course>, imageFile?: File): Promise<Course> {
		return await this.apiService.updateCourse(id, updateData, imageFile);
	}

	async deleteItem(id: string): Promise<void> {
		return await this.apiService.deleteCourse(id);
	}

	/**
	 * Wrapper for create that includes image handling and state management
	 * This is what the page should call
	 */
	async create(createData: Partial<Course>, imageFile?: File): Promise<Course | null> {
		// Prevent concurrent create operations
		if (this._creating) return null;

		this._creating = true;
		this._createError = null;

		try {
			// Call the basic CRUD method
			const newItem = await this.createItem(createData, imageFile);

			// Add the new item to the beginning of the data array
			this._data = [newItem, ...this._data]; // Trigger reactivity

			// Optionally set as selected item (useful for navigation after creation)
			this._selectedItem = newItem;

			return newItem;
		} catch (error) {
			this._createError = error instanceof Error ? error.message : 'Failed to create item';
			console.error('[STORE] Error creating course:', error);
			throw error;
		} finally {
			this._creating = false;
		}
	}
	/**
	 * Wrapper for update that includes image handling
	 * This is what the page should call
	 */
	async update(id: string, updateData: Partial<Course>, imageFile?: File): Promise<Course | null> {
		if (this._updating) return null;

		this._updating = true;
		this._updateError = null;

		try {
			const updatedItem = await this.updateItem(id, updateData, imageFile);

			// Update the item in the data array
			const index = this._data.findIndex(item => item.id === id);
			if (index !== -1) {
				this._data[index] = updatedItem;
				this._data = [...this._data]; // Trigger reactivity
			}

			// Update selected item if it's the same
			if (this._selectedItem?.id === id) {
				this._selectedItem = updatedItem;
			}

			return updatedItem;
		} catch (error) {
			this._updateError = error instanceof Error ? error.message : 'Failed to update item';
			console.error('[STORE] Error updating course:', error);
			throw error;
		} finally {
			this._updating = false;
		}
	}








	async deleteSection(sectionId: string): Promise<void> {
		if (!this._selectedItem) {
			throw new Error('No course selected');
		}

		const courseId = this._selectedItem.id?.toString() || this._selectedItem.uuid;

		if (!courseId) {
			throw new Error('Course ID not found');
		}

		// Use base store's optimisticUpdate for automatic rollback on error
		await this.optimisticUpdate(
			courseId,
			// Optimistic update function: remove section immediately
			(currentCourse) => ({
				...currentCourse,
				sections: currentCourse.sections.filter(s => {
					const sId = s.id?.toString() || s.uuid;
					return sId !== sectionId;
				})
			}),
			// API call
			async () => {
				await this.apiService.deleteSection(sectionId);
			}
		);

		console.log('✅ Section deleted with optimistic update');
	}

	/**
	 * Create a new section for a course
	 * The API returns the updated Course object, which we use to update the store
	 * This maintains reactivity automatically
	 */
	async createSection(courseId: string, sectionData: CreateSectionRequest): Promise<Course> {
		console.log('[STORE] createSection called');
		console.log('[STORE] courseId:', courseId);
		console.log('[STORE] sectionData:', sectionData);

		if (!this._selectedItem) {
			throw new Error('No course selected');
		}

		console.log('[STORE] Current sections before create:', this._selectedItem.sections.length);

		try {
			// Call the API to create the section - it returns the full updated course
			console.log('[STORE] Calling API to create section...');
			const updatedCourse = await this.apiService.createSection(courseId, sectionData);

			console.log('[STORE] API returned updated course with sections:', updatedCourse.sections.length);

			// ✅ DIRECTLY update selectedItem since we're on a detail page
			this._selectedItem = updatedCourse;

			// Also update in _data array IF it exists there (for list page consistency)
			const index = this._data.findIndex(item => {
				const id = item.id?.toString() || item.uuid;
				return id === courseId;
			});

			if (index !== -1) {
				console.log('[STORE] Also updating course in _data array at index:', index);
				this._data[index] = updatedCourse;
				this._data = [...this._data]; // Trigger reactivity
			}

			console.log('[STORE] ✅ Section created successfully');
			console.log('[STORE] New section count:', this._selectedItem.sections.length);

			return updatedCourse;

		} catch (error) {
			console.error('[STORE] ❌ Error creating section:', error);
			throw error;
		}
	}





	/**
	 * Reorder course sections
	 * @param courseId - The course ID
	 * @param sectionIds - Array of section IDs in the new order
	 */
	async reorderSections(courseId: string, sectionIds: number[]): Promise<Course> {
		console.log('[STORE] Reordering sections for course:', courseId);
		console.log('[STORE] New section order:', sectionIds);

		if (!this._selectedItem) {
			throw new Error('No course selected');
		}

		// Use optimistic update for instant UI feedback
		await this.optimisticUpdate(
			courseId,
			// Optimistic update: reorder sections in memory
			(currentCourse) => {
				// Create a map of sections by ID for quick lookup
				const sectionMap = new Map(
					currentCourse.sections.map(s => [
						parseInt(s.id, 10),
						s
					])
				);

				// Reorder sections based on the new order
				const reorderedSections = sectionIds
					.map((id, index) => {
						const section = sectionMap.get(id);
						if (section) {
							return { ...section, orderIndex: index + 1 };
						}
						return null;
					})
					.filter((s): s is CourseSection => s !== null);

				console.log('[STORE] Optimistically reordered sections:', reorderedSections.length);

				return {
					...currentCourse,
					sections: reorderedSections
				};
			},
			// API call
			async () => {
				console.log('[STORE] Calling API to reorder sections...');
				const updatedCourse = await this.apiService.reorderSections(courseId, sectionIds);

				// Update with server response
				this.updateItemInStore(courseId, updatedCourse);
				this._selectedItem = updatedCourse;

				console.log('[STORE] ✅ Sections reordered successfully');
				return updatedCourse;
			}
		);

		return this._selectedItem as Course;
	}

}

export const courseStore = new CourseStore();