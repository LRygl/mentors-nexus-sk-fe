import { BaseStoreSvelte } from '$lib/stores/BaseStore.svelte';
import type { CourseCategory } from '$lib/types/entities/CourseCategory';
import  { courseCategoryAdminApiService, type CourseCategoryAdminApiService } from '$lib/API/Admin/CourseCategoryAdminAPI';

export class CourseCategoryStore extends BaseStoreSvelte<
	CourseCategory,
	Partial<CourseCategory>,
	Partial<CourseCategory>,
	CourseCategoryAdminApiService> {

	constructor() {
		super(courseCategoryAdminApiService);
	};

	async fetchAll(): Promise<CourseCategory[]> {
		this._loading = true;

		try {
			this._data = await this.apiService.getAllCourseCategories();
			return this._data;
		} catch (error) {
			console.error('[STORE] Error fetching all Course Categories:', error);
			throw error;
		} finally {
			this._loading = false;
		}
	};

}

export const courseCategoryStore = new CourseCategoryStore();