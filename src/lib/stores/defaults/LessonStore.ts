import { BaseStoreSvelte } from '$lib/stores/BaseStore.svelte';
import type { Lesson } from '$lib/types/entities/Lesson';
import { lessonAdminApiService, type LessonAdminApiService } from '$lib/API/Admin/LessonAdminAPI';
import type { Course } from '$lib/types/entities/Course';


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

	/*
* BASIC CRUD ACTIONS
*/
	async createItem(createData: Partial<Lesson>): Promise<Lesson> {
		return await this.apiService.createLesson(createData);
	}

	async deleteItem(id: string): Promise<void> {
		return await this.apiService.deleteLesson(id);
	}


}

export const lessonStore = new LessonStoreSvelte();