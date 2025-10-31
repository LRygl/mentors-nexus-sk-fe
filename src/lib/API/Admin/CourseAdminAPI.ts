import { BaseApiService } from '$lib/API/APIBase';
import { API_CONFIG } from '$lib/API/APIConfiguration';
import type { Course } from '$lib/types/entities/Course';
import type { CreateSectionRequest } from '$lib/stores/defaults/CourseStore';

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

	async getCourseById(courseId: string): Promise<Course> {
		try {
			return await this.get<Course>(`${this.ENDPOINT}/${courseId}`);
		} catch (error) {
			throw error;
		}
	}

	async createCourse(
		createData: Partial<Course>,
		imageFile?: File
	): Promise<Course> {
		console.log('=== createCourse called ===');
		console.log('imageFile:', imageFile);
		console.log('imageFile type:', typeof imageFile);
		console.log('imageFile instanceof File:', imageFile instanceof File);
		console.log('createData:', createData);

		if (imageFile && imageFile instanceof File && imageFile.size > 0) {
			console.log('✅ Using multipart/form-data');
			console.log('File details:', {
				name: imageFile.name,
				size: imageFile.size,
				type: imageFile.type
			});

			const formData = this.buildCourseFormData(createData, imageFile);

			// Log FormData contents
			console.log('=== FormData contents ===');
			for (let [key, value] of formData.entries()) {
				if (value instanceof File) {
					console.log(`${key}:`, {
						name: value.name,
						size: value.size,
						type: value.type
					});
				} else if (value instanceof Blob) {
					console.log(`${key}: Blob (size: ${value.size}, type: ${value.type})`);
				} else {
					console.log(`${key}:`, value);
				}
			}

			return await this.postMultipart<Course>(`${this.ENDPOINT}`, formData);
		} else {
			console.log('✅ Using application/json (no valid image file)');
			return await this.post<Course>(`${this.ENDPOINT}`, createData);
		}
	}
	async updateCourse(
		courseId: string,
		updateData: Partial<Course>,
		imageFile?: File
	): Promise<Course> {

		if (imageFile) {
			const formData = this.buildCourseFormData(updateData, imageFile);
			return await this.putMultipart<Course>(`${this.ENDPOINT}/${courseId}`, formData);
		} else {
			// Use regular JSON request when no image
			return await this.put<Course>(`${this.ENDPOINT}/${courseId}`, updateData);
		}
	}

	async deleteCourse(id: string) {
		await this.delete(`${this.ENDPOINT}/${id}`)
	}

	async deleteSection(sectionId: string) {
		await this.delete(`${this.ENDPOINT}/section/${sectionId}`);
	}

	async createSection(courseId: string, sectionData: CreateSectionRequest): Promise<Course> {
		return await this.post<Course>(`${this.ENDPOINT}/${courseId}/section`, sectionData);
	}

	async reorderSections(courseId: string, sectionIds: number[]) {
		return await this.post<Course>(`${this.ENDPOINT}/section/reorder`, sectionIds);
	}


	private buildCourseFormData(courseData: Partial<Course>, imageFile: File): FormData {
		const formData = new FormData();

		// Add image file
		formData.append('image', imageFile);

		// Prepare course data - remove imageUrl since we're uploading a new file
		const { imageUrl, ...courseDataWithoutImage } = courseData;

		// Create a Blob with proper JSON content type for Spring Boot @RequestPart
		const courseBlob = new Blob(
			[JSON.stringify(courseDataWithoutImage)],
			{ type: 'application/json' }
		);

		formData.append('course', courseBlob);

		return formData;
	}
}

export const courseAdminApiService = new CourseAdminApiService();