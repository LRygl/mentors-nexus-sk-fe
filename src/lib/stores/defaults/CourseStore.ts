import { BaseStoreSvelte } from '$lib/stores/BaseStore.svelte';
import type { Course } from '$lib/types/entities/Course';
import { courseAdminApiService, type CourseAdminApiService } from '$lib/API/Admin/CourseAdminAPI';

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
	async createItem(createData: Partial<Course>): Promise<Course> {
		return await this.apiService.createCourse(createData);
	}

	async deleteItem(id: string): Promise<void> {
		return await this.apiService.deleteCourse(id);
	}


	/**
	 * Create a new section for a course
	 * The API returns the updated Course object, which we use to update the store
	 * This maintains reactivity automatically
	 */
	async createSection(courseId: string, sectionData: CreateSectionRequest): Promise<Course | null> {


		try {
			// Call the API to create the section
			const updatedCourse = await this.apiService.createSection(courseId, sectionData);

			// Update the course in the data array if it exists
			this.updateItemInStore(courseId, updatedCourse);

			// If this course is the selected item, update it
			if (this._selectedItem?.id === courseId) {
				this._selectedItem = updatedCourse;
			}

			return updatedCourse;
		} catch (error) {
			console.error('[STORE] Error creating section:', error);
			return null;
		}
	}

}

export const courseStore = new CourseStore();