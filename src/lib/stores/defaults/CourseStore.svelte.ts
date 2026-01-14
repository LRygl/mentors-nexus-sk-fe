import { BaseStoreSvelte } from '$lib/stores/BaseStore.svelte';
import type { Course } from '$lib/types/entities/Course';
import { courseAdminApiService, type CourseAdminApiService } from '$lib/API/Admin/CourseAdminAPI';
import type { CourseSection } from '$lib/types/entities/CourseSection';
import { lessonStore } from '$lib/stores/defaults/LessonStore';

// TODO Move to separate file
// Define the section creation request type
export interface CreateSectionRequest {
	title: string;
	description: string;
	orderIndex: number;
}

export class CourseStoreSvelte extends BaseStoreSvelte<
	Course,
	Partial<Course>,
	Partial<Course>,
	CourseAdminApiService
> {

	protected _featured = $state<Course[]>([])
	protected _loadingFeatured = $state(false)
	protected _featuredError = $state<string | null>(null);

// Featured course getters
	get featured(): Course[] {
		return this._featured;
	}

	get loadingFeatured(): boolean {
		return this._loadingFeatured;
	}

	get featuredError(): string | null {
		return this._featuredError;
	}

	get hasFeatured(): boolean {
		return this._featured.length > 0;
	}



	constructor() {
		super(courseAdminApiService);
	}

	// ============================================================================
	// BASIC DATA FETCHING
	// ============================================================================

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
		this._loadingItem = true;
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


	async fetchFeatured(): Promise<Course[]> {
		this._loadingItem = true;
		this._itemError = null;

		try {
			this._featured = await this.apiService.getFeaturedCourses();
			return this._featured;

		} catch (error) {
			console.error('[STORE] Error fetching featured featured:', error);
			throw error;
		} finally {
			this._loadingItem = false;
		}
	}

	// ============================================================================
	// BASIC CRUD - These are the low-level API calls
	// ============================================================================

	async createItem(createData: Partial<Course>, imageFile?: File): Promise<Course> {
		return await this.apiService.createCourse(createData, imageFile);
	}

	async updateItem(id: string, updateData: Partial<Course>, imageFile?: File): Promise<Course> {
		return await this.apiService.updateCourse(id, updateData, imageFile);
	}

	async deleteItem(id: string): Promise<void> {
		return await this.apiService.deleteCourse(id);
	}

	// ============================================================================
	// ENHANCED CRUD - These wrap the basic CRUD with state management
	// ============================================================================

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
	// SECTION MANAGEMENT
	// ============================================================================

	/**
	 * Create a new section for a course
	 * The API returns the updated Course object with the new section
	 */
	async createSection(courseId: string, sectionData: CreateSectionRequest): Promise<Course> {
		if (!this._selectedItem) {
			throw new Error('No course selected');
		}

		try {
			const updatedCourse = await this.apiService.createSection(courseId, sectionData);

			this._selectedItem = updatedCourse;
			this.updateItemInStore(courseId, updatedCourse);

			return updatedCourse;
		} catch (error) {
			console.error('[STORE] ❌ Error creating section:', error);
			throw error;
		}
	}

	/**
	 * Delete a section from the current course
	 * Uses optimistic update for instant UI feedback with automatic rollback
	 */
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
	}

	// ============================================================================
	// FEATURED STATUS MANAGEMENT
	// ============================================================================

	async featureCourse(courseId: string): Promise<Course> {
		return this.optimisticUpdate(
			courseId,
			(currentCourse) => ({ ...currentCourse, isFeatured: true }),

			async () => {
				const updatedCourse = await this.apiService.featureCourse(courseId);
				this.updateItemInStore(courseId, updatedCourse);
				return updatedCourse;
			}
		);
	}

	async unfeatureCourse(courseId: string): Promise<Course> {
		return this.optimisticUpdate(
			courseId,
			(currentCourse) => ({ ...currentCourse, isFeatured: false }),

			async () => {
				const updatedCourse = await this.apiService.unfeatureCourse(courseId);
				this.updateItemInStore(courseId, updatedCourse);
				return updatedCourse;
			}

		);
	}

	/**
	 * Reorder course sections
	 * Uses optimistic update for instant UI feedback
	 */
	async reorderSections(courseId: string, sectionIds: number[]): Promise<Course> {
		if (!this._selectedItem) {
			throw new Error('No course selected');
		}

		await this.optimisticUpdate(
			courseId,
			// Optimistic update: reorder sections in memory
			(currentCourse) => {
				const sectionMap = new Map(
					currentCourse.sections.map(s => [parseInt(s.id, 10), s])
				);

				const reorderedSections = sectionIds
					.map((id, index) => {
						const section = sectionMap.get(id);
						return section ? { ...section, orderIndex: index + 1 } : null;
					})
					.filter((s): s is CourseSection => s !== null);

				return {
					...currentCourse,
					sections: reorderedSections
				};
			},
			// API call
			async () => {
				const updatedCourse = await this.apiService.reorderSections(courseId, sectionIds);

				// Update with server response
				this.updateItemInStore(courseId, updatedCourse);
				this._selectedItem = updatedCourse;

				return updatedCourse;
			}
		);

		return this._selectedItem as Course;
	}

	// ============================================================================
	// LESSON MANAGEMENT
	// ============================================================================

	/**
	 * Link a lesson to a course section
	 * Uses optimistic update for instant UI feedback
	 */
	async linkLesson(courseId: string, sectionId: string, lessonId: string): Promise<Course> {
		console.log('[CourseStoreSvelte] Linking lesson:', { courseId, sectionId, lessonId });

		return this.optimisticUpdate(
			courseId,
			(currentCourse) => {
				// Find the lesson to add from lessonStore
				const lessonToAdd = lessonStore.data.find(l => l.id.toString() === lessonId.toString());

				if (!lessonToAdd) {
					throw new Error(`Lesson with id ${lessonId} not found in lesson store`);
				}

				// Deep clone to avoid reference issues
				const updatedCourse = JSON.parse(JSON.stringify(currentCourse));

				// Find and update the target section
				const targetSectionIndex = updatedCourse.sections?.findIndex(
					s => s.id.toString() === sectionId.toString()
				);

				if (targetSectionIndex === -1 || targetSectionIndex === undefined) {
					throw new Error(`Section with id ${sectionId} not found`);
				}

				// Check if lesson is already in this section
				const alreadyExists = updatedCourse.sections[targetSectionIndex].lessons?.some(
					l => l.id.toString() === lessonId.toString()
				);

				if (alreadyExists) {
					console.warn('[CourseStoreSvelte] Lesson already exists in this section');
					return currentCourse;
				}

				// Add lesson to section
				if (!updatedCourse.sections[targetSectionIndex].lessons) {
					updatedCourse.sections[targetSectionIndex].lessons = [];
				}

				updatedCourse.sections[targetSectionIndex].lessons.push(lessonToAdd);

				console.log('[CourseStoreSvelte] Optimistically added lesson to section');
				return updatedCourse;
			},
			// API call
			() => this.apiService.linkLesson(sectionId, lessonId)
		);
	}

	/**
	 * Unlink a lesson from a course section
	 * Uses optimistic update for instant UI feedback
	 */
	async unlinkLesson(sectionId: string, lessonId: string): Promise<Course> {
		if (!this._selectedItem) {
			throw new Error('No course selected');
		}

		const courseId = this._selectedItem.id?.toString() || this._selectedItem.uuid;
		if (!courseId) {
			throw new Error('Course ID not found');
		}

		console.log('[CourseStoreSvelte] Unlinking lesson:', lessonId, 'from section:', sectionId);

		await this.optimisticUpdate(
			courseId,
			// Optimistic update: remove lesson from section immediately
			(currentCourse) => {
				const sectionIndex = currentCourse.sections.findIndex(s => {
					const sId = s.id?.toString() || s.uuid;
					return sId === sectionId;
				});

				if (sectionIndex === -1) {
					console.warn('[CourseStoreSvelte] Section not found for optimistic update');
					return currentCourse;
				}

				const updatedSections = [...currentCourse.sections];
				const targetSection = { ...updatedSections[sectionIndex] };

				// Remove the lesson
				targetSection.lessons = (targetSection.lessons || []).filter(lesson => {
					const lId = lesson.id?.toString() || lesson.uuid;
					return lId !== lessonId;
				});

				updatedSections[sectionIndex] = targetSection;

				return {
					...currentCourse,
					sections: updatedSections
				};
			},
			// API call
			async () => {
				const response = await this.apiService.unlinkLesson(sectionId, lessonId);

				// Update with server response
				this.updateItemInStore(courseId, response);
				this._selectedItem = response;

				console.log('[CourseStoreSvelte] Lesson unlinked successfully');
				return response;
			}
		);

		return this._selectedItem as Course;
	}

}

export const courseStore = new CourseStoreSvelte();