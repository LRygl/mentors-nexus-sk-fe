import { BaseApiService } from '$lib/API/APIBase';
import { API_CONFIG } from '$lib/API/APIConfiguration';
import type { Lesson } from '$lib/types/entities/Lesson';

export class LessonAdminApiService extends BaseApiService {
	private readonly ENDPOINT = API_CONFIG.ENDPOINTS.ADMIN.LESSONS;

	constructor() {
		super(API_CONFIG.BASE_URL);
	};

	async getAllLessons(): Promise<Lesson[]> {
		try {
			return await this.get<Lesson[]>(`${this.ENDPOINT}/all`)
		} catch (error) {
			throw error;
		}
	};
}

export const lessonAdminApiService = new LessonAdminApiService();