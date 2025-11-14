import type { BaseEntity } from '$lib/types';

export interface Lesson extends BaseEntity {
	id: string; // corresponds to Long/UUID in Java
	uuid?: string;
	title?: string;
	description?: string;
	imageUrl?: string;
	videoUrl?: string;
	length?: number; // Duration in seconds
	duration?: number;
	orderIndex: number;

	// Relations
	//course?: Course;
}