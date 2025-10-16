import type { BaseEntity } from '$lib/types';

/**
 * Course Interface (minimal)
 * Referenced by User model
 */
export interface Course extends BaseEntity {
	id: string; // corresponds to UUID in Java
	uuid?: string;
	name?: string;
	category?: string;
	//status?: CourseStatus;
	price?: number;
	created?: Date;
	updated?: Date;
	published?: Date;
	featured?: boolean;

}


// Relations
//labels: Set<Label> = new Set();
//categories: Set<Category> = new Set();
//owner?: User;
//students: Set<User> = new Set();
//lessons: Set<Lesson> = new Set();