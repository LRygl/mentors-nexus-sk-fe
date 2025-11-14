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


	// ============================================================================
	// BASIC DATA FETCHING
	// ============================================================================


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

	async fetchItem(courseCategoryId: string): Promise<CourseCategory> {
		this._loadingItem = true;
		this._itemError = null;

		try {
			const courseCategory = await this.apiService.getCourseCategoryById(courseCategoryId);
			this._selectedItem = courseCategory;
			return courseCategory;
		} catch (error) {
			this._itemError = error instanceof Error ? error.message : 'Failed to load course category';
			throw error;
		} finally {
			this._loadingItem = false;
		}
	}

	// ============================================================================
	// BASIC CRUD - These are the low-level API calls
	// ============================================================================

	async createItem(createData: Partial<CourseCategory>): Promise<CourseCategory> {
		return await this.apiService.createCourseCategory(createData);
	}

	async updateItem(id: string, updateData: Partial<CourseCategory>): Promise<CourseCategory> {
		return await this.apiService.updateCourseCategory(id, updateData);
	}

	async deleteItem(id: string): Promise<void> {
		return await this.apiService.deleteCourseCategory(id);
	}

}

export const courseCategoryStore = new CourseCategoryStore();