import { BaseApiService } from '$lib/API/APIBase';
import { API_CONFIG } from '$lib/API/APIConfiguration';
import type { Lesson } from '$lib/types/entities/Lesson';
import type { Course } from '$lib/types/entities/Course';
import { FormDataUtils } from '$lib/utils/formSubmitHelpers';
import { FILE_FIELD_CONFIGS } from '$lib/utils/FormDataConfigs';

export class LessonAdminApiService extends BaseApiService {
	private readonly ENDPOINT = API_CONFIG.ENDPOINTS.ADMIN.LESSONS;
	private readonly FILE_MAPPINGS = FILE_FIELD_CONFIGS.LESSON;
	private readonly JSON_PART_NAME = 'lesson';

	constructor() {
		super(API_CONFIG.BASE_URL);
	}

	async getAllLessons(): Promise<Lesson[]> {
		try {
			return await this.get<Lesson[]>(`${this.ENDPOINT}/all`);
		} catch (error) {
			throw error;
		}
	}

	async getLessonById(lessonId: string) {
		try {
			return await this.get<Lesson>(`${this.ENDPOINT}/${lessonId}`);
		} catch (error) {
			throw error;
		}
	}

	// ============================================================================
	// BASIC CRUD - These are the low-level API calls
	// ============================================================================

	async createLesson(createData: Partial<Lesson>): Promise<Lesson> {
		const requestData = {
			...createData
		};
		return await this.post<Lesson>(`${this.ENDPOINT}`, requestData);
	}

	async updateLesson(lessonId: string, updateData: Partial<Course>): Promise<Lesson> {
		const hasFiles = FormDataUtils.hasFiles(updateData);

		if (hasFiles) {
			const formData = FormDataUtils.buildFormData(updateData, {
				jsonPartName: this.JSON_PART_NAME,
				fileFieldMappings: this.FILE_MAPPINGS,
				debug: true,
				logPrefix: 'LessonAPI'
			});

			await FormDataUtils.logFormData(formData, `Request`, `Lesson API`)

			return await this.putMultipart<Lesson>(`${this.ENDPOINT}/${lessonId}`, formData);
		} else {
			return await this.put<Lesson>(`${this.ENDPOINT}/${lessonId}`, updateData);
		}
	}

	async deleteLesson(id: string) {
		await this.delete(`${this.ENDPOINT}/${id}`);
	}

	private buildLessonFormData(lessonData: Partial<Lesson>, imageFile: File): FormData {
		const formData = new FormData();

		// Add image file
		formData.append('image', imageFile);

		// Prepare course data - remove imageUrl since we're uploading a new file
		const { imageUrl, ...lessonDataWithoutImage } = lessonData;

		// Create a Blob with proper JSON content type for Spring Boot @RequestPart
		const courseBlob = new Blob([JSON.stringify(lessonDataWithoutImage)], {
			type: 'application/json'
		});

		formData.append('lesson', courseBlob);

		return formData;
	}
}

export const lessonAdminApiService = new LessonAdminApiService();