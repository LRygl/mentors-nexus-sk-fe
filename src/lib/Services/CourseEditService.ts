import { courseStore } from '$lib/stores/defaults/CourseStore';
import { toastService } from '$lib/Services/ToastService.svelte';
import type { CourseSection } from '$lib/types/entities/CourseSection';
import type { Course } from '$lib/types/entities/Course';
import { prepareEntityDataForSubmit, validateImageFile } from '$lib/utils/ImageUtils';
import { lessonStore } from '$lib/stores/defaults/LessonStore';
import { userStore } from '$lib/stores/defaults/UserStore';
import { courseCategoryStore } from '$lib/stores/defaults/CourseCategoryStore';

/**
 * Service layer for course editing operations
 * Similar to a Spring Boot @Service class - handles business logic
 * without UI concerns
 */
export class CourseEditService {
	/**
	 * Load all required data for course editing
	 */
	async loadCourseData(courseId: string): Promise<void> {
		try {
			await Promise.all([
				this.loadCourse(courseId),
				this.loadCategories(),
				this.loadUsers(),
				this.loadLessons(),
			]);
		} catch (error) {
			console.error('[CourseEditService] Error loading course data:', error);
			throw error;
		}
	}

	/**
	 * Load and sort course with sections and lessons
	 */
	private async loadCourse(courseId: string): Promise<Course> {
		const course = await courseStore.fetchItem(courseId);

		// Sort sections and lessons by orderIndex
		course.sections.sort((a, b) => a.orderIndex - b.orderIndex);
		course.sections.forEach((section) => {
			section.lessons.sort((a, b) => a.orderIndex - b.orderIndex);
		});

		return course;
	}

	/**
	 * Load course categories
	 */
	private async loadCategories(): Promise<void> {
		try {
			await courseCategoryStore.fetchAll();
		} catch (error) {
			toastService.error('Error', 'Failed to load course categories');
			throw error;
		}
	}

	/**
	 * Load eligible users for course ownership
	 */
	private async loadUsers(): Promise<void> {
		try {
			await userStore.fetchAll();
			// TODO: Filter to only eligible users (e.g., instructors, admins)
		} catch (error) {
			console.error('[CourseEditService] Error loading users:', error);
			throw error;
		}
	}

	/**
	 * Load available lessons for linking
	 */
	private async loadLessons(): Promise<void> {
		try {
			await lessonStore.fetchAll();
			// TODO: Filter to only unlinked or available lessons
		} catch (error) {
			console.error('[CourseEditService] Error loading lessons:', error);
			throw error;
		}
	}

	/**
	 * Update course with validation and image handling
	 */
	async updateCourse(
		courseId: string,
		formData: Partial<Course>
	): Promise<void> {
		// Step 1: Prepare data and extract image file
		const { data: cleanData, imageFile } = prepareEntityDataForSubmit(formData);

		// Step 2: Validate image if present
		if (imageFile) {
			const validation = await validateImageFile(imageFile, {
				maxSizeMB: 5,
				allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
			});

			if (!validation.valid) {
				throw new Error(validation.error || 'Image validation failed');
			}
		}

		// Step 3: Transform data for backend API
		const apiData = this.transformCourseDataForApi(cleanData);

		// Step 4: Call store update
		try {
			await courseStore.update(courseId, apiData, imageFile);
			toastService.success('Success', 'Course updated successfully');
		} catch (error) {
			toastService.error('Error', 'Failed to update course');
			throw error;
		}
	}

	/**
	 * Transform frontend course data to backend API format
	 * Similar to a DTO mapper in Spring Boot
	 */
	private transformCourseDataForApi(data: Partial<Course>): any {
		return {
			...data,
			// Convert category IDs from strings to numbers
			categoryIds: data.categoryIds?.map((id: string | number) =>
				typeof id === 'string' ? parseInt(id, 10) : id
			),
			// Format published date as ISO string
			published: data.published
				? new Date(data.published).toISOString()
				: null,
			// Map ownerId to courseOwnerId for backend
			courseOwnerId: data.ownerId,
			// Remove frontend-only field
			ownerId: undefined,
		};
	}

	/**
	 * Create a new course section
	 */
	async createSection(
		courseId: string,
		section: Partial<CourseSection>
	): Promise<CourseSection> {
		try {
			const newSection = await courseStore.createSection(courseId, section);
			toastService.success('Success', 'Section created successfully');
			return newSection;
		} catch (error) {
			toastService.error('Error', 'Failed to create section');
			throw error;
		}
	}

	/**
	 * Delete a course section
	 */
	async deleteSection(sectionId: string): Promise<void> {
		try {
			await courseStore.deleteSection(sectionId);
			toastService.success('Success', 'Section deleted successfully');
		} catch (error) {
			toastService.error('Error', 'Failed to delete section');
			throw error;
		}
	}

	/**
	 * Reorder course sections
	 */
	async reorderSections(
		courseId: string,
		sections: Array<{ id?: string | number; uuid?: string }>
	): Promise<void> {
		// Extract and convert section IDs
		const sectionIds = sections
			.map((section) => {
				const id = section.id || section.uuid;
				return id ? (typeof id === 'string' ? parseInt(id, 10) : id) : null;
			})
			.filter((id): id is number => id !== null);

		if (sectionIds.length === 0) {
			throw new Error('No valid section IDs found');
		}

		try {
			await courseStore.reorderSections(courseId, sectionIds);
			toastService.success('Success', 'Sections reordered successfully');
		} catch (error) {
			toastService.error('Error', 'Failed to reorder sections');
			throw error;
		}
	}

	/**
	 * Link a lesson to a course section
	 */
	async linkLesson(
		courseId: string,
		sectionId: string,
		lessonId: string,
		orderIndex?: number
	): Promise<void> {
		try {
			// TODO: Implement lesson linking API call
			await courseStore.linkLesson(courseId, sectionId, lessonId, orderIndex);
			toastService.success('Success', 'Lesson linked successfully');
		} catch (error) {
			toastService.error('Error', 'Failed to link lesson');
			throw error;
		}
	}

	/**
	 * Unlink a lesson from a course section
	 */
	async unlinkLesson(
		courseId: string,
		sectionId: string,
		lessonId: string
	): Promise<void> {
		try {
			await courseStore.unlinkLesson(courseId, sectionId, lessonId);
			toastService.success('Success', 'Lesson unlinked successfully');
		} catch (error) {
			toastService.error('Error', 'Failed to unlink lesson');
			throw error;
		}
	}

	/**
	 * Reorder lessons within a section
	 */
	async reorderLessons(
		sectionId: string,
		lessonIds: number[]
	): Promise<void> {
		try {
			await courseStore.reorderLessons(sectionId, lessonIds);
			toastService.success('Success', 'Lessons reordered successfully');
		} catch (error) {
			toastService.error('Error', 'Failed to reorder lessons');
			throw error;
		}
	}
}

// Export singleton instance (like a Spring Bean)
export const courseEditService = new CourseEditService();