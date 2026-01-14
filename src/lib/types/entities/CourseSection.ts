import type { BaseEntity } from '$lib/types';
import type { Lesson } from '$lib/types/entities/Lesson';

export interface CourseSection extends BaseEntity {
	id: string;
	uuid: string;
	title: string;
	description: string;
	orderIndex: number;
	lessons: Lesson[];
}