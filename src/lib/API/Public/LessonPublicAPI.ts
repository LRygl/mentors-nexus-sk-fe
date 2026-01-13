import { BaseApiService } from '$lib/API/APIBase';
import { API_CONFIG } from '$lib/API/APIConfiguration';
import type { Lesson } from '$lib/types/entities/Lesson';

export class LessonPublicAPI extends BaseApiService {
	private readonly ENDPOINT = API_CONFIG.ENDPOINTS.LESSON;

	constructor() {
		super(API_CONFIG.BASE_URL);
	}

	async getPublicLessonByID(id: string): Promise<Lesson> {
		return await this.get<Lesson>(`${this.ENDPOINT}/${id}`);
	}
}
export const lessonPublicAPI = new LessonPublicAPI();