import type { BaseEntity, PaginationParams } from '$lib/types/common';
import type { CourseCategory } from './CourseCategory';
import type { User } from './User';

export type CourseStatus = 'DRAFT' | 'UNPUBLISHED' | 'PUBLISHED';

export interface Course extends BaseEntity {
	id: string;
	uuid: string;
	name: string;
	slug: string;
	price: number;
	status: CourseStatus;
	imageUrl?: string;
	labels?: string[];
	published?: Date;
	isFeatured: boolean;

	// Relations
	ownerId: string;
	owner?: User;
	categoryIds: string[];
	categories?: CourseCategory[];

	createdAt: Date;
	updatedAt: Date;
}

export interface CoursePaginationParams extends PaginationParams {
	search?: string;
	status?: CourseStatus;
	isFeatured?: boolean;
	categoryId?: string;
	ownerId?: string;
	sortBy?: 'name' | 'price' | 'createdAt' | 'published';
	sortDirection?: 'asc' | 'desc';
}

// Request types for API operations
export interface CreateCourseRequest {
	name: string;
	price: number;
	status: CourseStatus;
	imageUrl?: string;
	labels?: string[];
	published?: Date;
	isFeatured?: boolean;
	ownerId: string;
	categoryIds: string[];
	slug?: string; // Optional, can be auto-generated from name
}

export interface UpdateCourseRequest {
	name?: string;
	price?: number;
	status?: CourseStatus;
	imageUrl?: string;
	labels?: string[];
	published?: Date;
	isFeatured?: boolean;
	ownerId?: string;
	categoryIds?: string[];
	slug?: string;
}

// Response types for API operations
export interface CourseResponse {
	course: Course;
	message?: string;
}

export interface CourseListResponse {
	courses: Course[];
	totalCount: number;
	message?: string;
}

// Form validation types
export interface CourseFormData {
	name: string;
	price: number;
	status: CourseStatus;
	imageUrl?: string;
	labels?: string[];
	published?: Date;
	isFeatured: boolean;
	ownerId: string;
	categoryIds: string[];
}
