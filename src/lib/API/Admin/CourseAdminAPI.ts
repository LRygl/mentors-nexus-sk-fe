import { BaseApiService } from '$lib/API/APIBase';
import { API_CONFIG } from '$lib/API/APIConfiguration';
import type { Course } from '$lib/types/entities/Course';


export class CourseAdminApiService extends BaseApiService {
	private readonly ENDPOINT = API_CONFIG.ENDPOINTS.ADMIN.COURSES;

	constructor() {
		super(API_CONFIG.BASE_URL);
	}

	async getAllCourses(): Promise<Course[]> {
		try {
			return await this.get<Course[]>(`${this.ENDPOINT}/all`);
		} catch (error) {
			throw error;
		}
	}

	async createCourse(createData: Partial<Course>): Promise<Course> {
		const requestData = {
			...createData
		}
		return await this.post<Course>(`${this.ENDPOINT}`, requestData);
	}

	async deleteCourse(id: string) {
		await this.delete(`${this.ENDPOINT}/${id}`)
	}
}

export const courseAdminApiService = new CourseAdminApiService();