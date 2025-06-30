/*
export interface Course {
	id: string;
	name: string;
	status: "pending" | "processing" | "success" | "failed";
	uuid: string;
	price: number;
}

// For paginated API responses
export interface CourseListResponse {
	data: Course[];
	total: number;
	page: number;
	pageSize: number;
}

// For API request parameters
export interface CourseListParams {
	page?: number;
	pageSize?: number;
	search?: string;
	status?: Course['status'];
	sortBy?: keyof Course;
	sortOrder?: 'asc' | 'desc';
}
*/


import type { Page } from '$lib/types/page';
import type { Lesson } from '$lib/types/lesson';

export interface CourseOwner {
	id: number;
	firstName: string;
	lastName: string;
	email: string;
}

export interface Course {
	id: number;
	uuid: string;
	created: string;
	updated: string | null;
	published: string | null;
	price: number;
	status: string;
	name: string;
	labels: string[];
	categories: string[];
	lessons: Lesson[];
	owners: CourseOwner[];
	students: number;

}

export type CourseListResponse = Page<Course>;