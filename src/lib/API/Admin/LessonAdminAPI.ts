import { BaseApiService } from '$lib/API/APIBase';
import { API_CONFIG } from '$lib/API/APIConfiguration';
import type { Lesson } from '$lib/types/entities/Lesson';
import type { Course } from '$lib/types/entities/Course';

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

	async createLesson(createData: Partial<Lesson>): Promise<Lesson> {
		const requestData = {
			...createData
		}
		return await this.post<Lesson>(`${this.ENDPOINT}`, requestData);
	}

	async deleteLesson(id: string) {
		await this.delete(`${this.ENDPOINT}/${id}`)
	}
}

export const lessonAdminApiService = new LessonAdminApiService();