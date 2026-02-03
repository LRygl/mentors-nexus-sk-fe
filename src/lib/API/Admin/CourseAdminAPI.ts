import { BaseApiService } from '$lib/API/APIBase';
import { API_CONFIG } from '$lib/API/APIConfiguration';
import type { Course } from '$lib/types/entities/Course';
import type { CreateSectionRequest } from '$lib/stores/defaults/CourseStore.svelte';

export class CourseAdminApiService extends BaseApiService {
	private readonly ENDPOINT = API_CONFIG.ENDPOINTS.ADMIN.COURSES;

	constructor() {
		super(API_CONFIG.BASE_URL);
	}

	// ============================================================================
	// BASIC DATA FETCHING
	// ============================================================================

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

	async getFeaturedCourses() {
		try {
			return await this.get<Course[]>(`${this.ENDPOINT}/featured`);
		} catch (error) {
			throw error;
		}
	}

	//
	// BASIC CRUD
	//

	async createCourse(
		createData: Partial<Course>,
		imageFile?: File
	): Promise<Course> {
		if (imageFile && imageFile instanceof File && imageFile.size > 0) {

			const formData = this.buildCourseFormData(createData, imageFile);
			return await this.postMultipart<Course>(`${this.ENDPOINT}`, formData);
		} else {
			return await this.post<Course>(`${this.ENDPOINT}`, createData);
		}
	}

	async updateCourse(
		courseId: string,
		updateData: Partial<Course>,
		imageFile?: File | undefined
	): Promise<Course> {
		console.log("[API] Updating course with id ", courseId);
		if (imageFile) {
			const formData = this.buildCourseFormData(updateData, imageFile);
			console.log("[API] Form JSON Data", updateData);
			console.log("[API] Multipart call with preprocessed FORM Data", formData);
			return await this.putMultipart<Course>(`${this.ENDPOINT}/${courseId}`, formData);
		} else {
			// Use regular JSON request when no image
			console.log('[API] Non-Multipart call with preprocessed data', updateData);
			return await this.put<Course>(`${this.ENDPOINT}/${courseId}`, updateData);
		}
	}

	async deleteCourse(id: string) {
		await this.delete(`${this.ENDPOINT}/${id}`)
	}


	// ============================================================================
	// SECTION MANAGEMENT
	// ============================================================================

	async createSection(courseId: string, sectionData: CreateSectionRequest): Promise<Course> {
		return await this.post<Course>(`${this.ENDPOINT}/${courseId}/section`, sectionData);
	}

	async reorderSections(courseId: string, sectionIds: number[]) {
		return await this.post<Course>(`${this.ENDPOINT}/section/reorder`, sectionIds);
	}

	async deleteSection(sectionId: string) {
		await this.delete(`${this.ENDPOINT}/section/${sectionId}`);
	}

	//
	// LESSON MANAGEMENT
	//

	async linkLesson(sectionId: string, lessonId: string) {
		return await this.post<Course>(`${this.ENDPOINT}/section/${sectionId}/lesson/${lessonId}`);
	}

	async unlinkLesson(sectionId: string, lessonId: string) {
		return await this.delete<Course>(`${this.ENDPOINT}/section/${sectionId}/lesson/${lessonId}`);
	}


	async featureCourse(courseId: string) {
		return await this.patch<Course>(`${this.ENDPOINT}/${courseId}/feature`, {})
	}

	async unfeatureCourse(courseId: string) {
		return await this.patch<Course>(`${this.ENDPOINT}/${courseId}/unfeature`, {})
	}


	//
	// UTILITY
	//

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