import type { BaseEntity } from '$lib/types';
import type { Course } from '$lib/types/entities/Course';

export interface CourseCategory extends BaseEntity {
	name?: string;
	description?: string;
	created?: Date;
	updated?: Date;
	color?: string;

	// Relations
	courses: Course[];

}