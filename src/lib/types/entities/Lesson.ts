import type { BaseEntity } from '$lib/types';
import type { Course } from '$lib/types/entities/Course';
import type { CourseSection } from '$lib/types/entities/CourseSection';
import type { LessonType } from '$lib/types/enums/LessonType';
import type { LessonCategory } from '$lib/types/enums/LessonCategory';

export interface Lesson extends BaseEntity {
	title?: string;
	description?: string;
	imageUrl?: string;
	videoUrl?: string;
	length?: number; // Duration in seconds
	duration?: number;
	orderIndex: number;
	type: LessonType;
	category: LessonCategory;

	// Relations
	course?: Course;
	section?: CourseSection;
}

