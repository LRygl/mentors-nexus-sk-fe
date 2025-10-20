import { BaseStoreSvelte } from '$lib/stores/BaseStore.svelte';
import type { Course } from '$lib/types/entities/Course';
import { courseAdminApiService, type CourseAdminApiService } from '$lib/API/Admin/CourseAdminAPI';

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

	/*
	* BASIC CRUD ACTIONS
	*/
	async createItem(createData: Partial<Course>): Promise<Course> {
		return await this.apiService.createCourse(createData);
	}

	async deleteItem(id: string): Promise<void> {
		return await this.apiService.deleteCourse(id);
	}

}

export const courseStore = new CourseStore();