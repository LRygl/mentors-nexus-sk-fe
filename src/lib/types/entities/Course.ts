import type { BaseEntity } from '$lib/types';
import type { CourseSection } from '$lib/types/entities/CourseSection';
import type { CourseStatus } from '$lib/types/enums/CourseStatus';
import type { User } from '$lib/types/entities/User';

/**
 * Course Interface
 * Represents a course with all its details, sections, and relationships
 */
export interface Course extends BaseEntity {
	// Basic information
	name: string;
	description: string;
	price: number;
	status: CourseStatus | string;
	imageUrl: string;


	published?: string | null;
	publishedAt?: Date;

	// Feature flag
	featured?: boolean;

	// Relations
	owner?: User;
	courseOwnerId?: string;
	labels?: string[];  // Array of label names
	categoryIds?: string[];  // Array of category IDs (for form)
	categories?: string[];  // Array of category names (for display)

	level?: string;

	sections: CourseSection[];  // Course sections with lessons
	duration?: number;
	students?: number;  // Number of enrolled students
	rating?: number;

	goals: string[];
	requirements: string[];


}

