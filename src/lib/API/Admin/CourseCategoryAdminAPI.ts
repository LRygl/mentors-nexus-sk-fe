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
		return await this.delete(`${this.ENDPOINT}/${id}`)
	}

	async getCourseCategoryById(courseCategoryId: string): Promise<CourseCategory> {
			return await this.get<CourseCategory>(`${this.ENDPOINT}/${courseCategoryId}`);
	}

	async updateCourseCategory(id: string, updateData: Partial<CourseCategory>) {
		return await this.put<CourseCategory>(`${this.ENDPOINT}/${id}`, updateData);
	}
}

export const courseCategoryAdminApiService = new CourseCategoryAdminApiService();