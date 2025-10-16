import { BaseApiService } from '$lib/API/APIBase';
import { API_CONFIG } from '$lib/API/APIConfiguration';
import type { CourseCategory } from '$lib/types/entities/CourseCategory';

export class CourseCategoryAdminApiService extends BaseApiService {
	private readonly ENDPOINT = API_CONFIG.ENDPOINTS.ADMIN.COURSE_CATEGORY;

	constructor() {
		super(API_CONFIG.BASE_URL);
	};

	async getAllCourseCategories(): Promise<CourseCategory[]> {
		try {
			return await this.get<CourseCategory[]>(`${this.ENDPOINT}/all`);
		} catch (error) {
			throw error;
		}
	};

}

export const courseCategoryAdminApiService = new CourseCategoryAdminApiService();