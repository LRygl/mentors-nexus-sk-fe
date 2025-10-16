import type { BaseEntity } from '$lib/types';

export interface CourseCategory extends BaseEntity {

	id: string; // corresponds to Long/UUID in Java
	uuid?: string;
	name?: string;
	description?: string;
	created?: Date;
	updated?: Date;
	color?: string;

	// Relations
	//courses: Set<Course>;

}