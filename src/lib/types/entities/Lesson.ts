import type { BaseEntity } from '$lib/types';

export interface Lesson extends BaseEntity {
	id: string; // corresponds to Long/UUID in Java
	uuid?: string;
	title?: string;
	description?: string;
	videoUrl?: string;
	length?: number; // Duration in seconds
	createdDate?: Date;
	updatedDate?: Date;
	orderIndex: number;

	// Relations
	//course?: Course;
}