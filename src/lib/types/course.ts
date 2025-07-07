import type { Page } from '$lib/types/page';
import type { Lesson } from '$lib/types/lesson';

export enum CourseStatus {
	PUBLISHED = "PUBLISHED",
	UNPUBLISHED = "UNPUBLISHED",
	HIDDEN = "HIDDEN",
	PRIVATE = "PRIVATE"
}

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
	status: CourseStatus;
	name: string;
	labels: string[];
	categories: string[];
	lessons: Lesson[];
	owner: CourseOwner;
	students: number;
	courseOwnerId: number;

}

export interface CourseFormData {
	name: string;
	price: string;
	labels: string[];
	categories: string[];
	courseOwnerId: string;
}

export interface CreateCourseRequest {
	name: string;
	price: number;
	labels: string[];
	categories: string[];
	courseOwnerId: number; // number for API
}

export interface CourseResponse extends Course {
	id: number;
	createdAt?: string;
	updatedAt?: string;
}

export interface CourseStoreState {
	data: Course[],
	loading: boolean,
	error: string | null;
	loaded: boolean;
}

export type CourseListPagedResponse = Page<Course>;
export type CourseListResponse = Course[];