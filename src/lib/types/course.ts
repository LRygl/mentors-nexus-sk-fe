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
	courseOwnerId: number;

}

export interface CourseFormData {
	name: string;
	price: number;
	labels: string[];
	categories: string[];
	courseOwnerId: number;
}

export interface CourseResponse extends Course {
	id: number;
	createdAt?: string;
	updatedAt?: string;
}

export type CourseListResponse = Page<Course>;