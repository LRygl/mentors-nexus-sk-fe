import { BaseApiService } from '$lib/API/APIBase';
import { API_CONFIG } from '$lib/API/APIConfiguration';
import type { CourseCategory } from '$lib/types/entities/CourseCategory';

export class CourseCategoryAdminApiService extends BaseApiService {
	private readonly ENDPOINT = API_CONFIG.ENDPOINTS.ADMIN.COURSE_CATEGORY;

	constructor() {
		super(API_CONFIG.BASE_URL);
	};

	/*
	* GET METHODS
	*/
	async getAllCourseCategories(): Promise<CourseCategory[]> {
		try {
			return await this.get<CourseCategory[]>(`${this.ENDPOINT}/all`);
		} catch (error) {
			throw error;
		}
	};

	/*
	* CRUD METHODS
	*/
	async createCourseCategory(createData: Partial<CourseCategory>): Promise<CourseCategory> {
		const requestData = {
			...createData
		}
		return await this.post<CourseCategory>(`${this.ENDPOINT}`, requestData);
	}


	async deleteCourseCategory(id: string): Promise<void> {
		console.log('[API Calling DELETE on Course Category Endpoint for ID: ]',id)
		await this.delete(`${this.ENDPOINT}/${id}`)
	}
}

export const courseCategoryAdminApiService = new CourseCategoryAdminApiService();