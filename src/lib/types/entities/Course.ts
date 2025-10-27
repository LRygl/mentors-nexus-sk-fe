import type { BaseEntity } from '$lib/types';
import type { CourseSection } from '$lib/types/entities/CourseSection';
import type { CourseStatus } from '$lib/types/enums/CourseStatus';
import type { User } from '$lib/types/entities/User';

/**
 * Course Interface
 * Represents a course with all its details, sections, and relationships
 */
export interface Course extends BaseEntity {
	// Core identifiers
	id: string;
	uuid?: string;

	// Basic information
	name: string;
	price: number;
	status: CourseStatus | string;

	// Timestamps
	created?: string;  // ✅ Changed from Date to string (API returns ISO string)
	updated?: string;  // ✅ Changed from Date to string
	published?: string | null;  // ✅ Changed from Date to string

	// Feature flag
	featured?: boolean;

	// Relations - ✅ ADDED MISSING FIELDS
	owner?: User;
	labels?: string[];  // Array of label names
	categoryIds?: string[];  // Array of category IDs (for form)
	categories?: string[];  // Array of category names (for display)

	//owner?: Owner;  // Course owner/instructor
	sections: CourseSection[];  // Course sections with lessons
	students?: number;  // Number of enrolled students
}
