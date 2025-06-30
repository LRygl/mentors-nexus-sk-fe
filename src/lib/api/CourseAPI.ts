import { buildApiUrl } from '$lib/config/api';
import type { Course, CourseListResponse } from '$lib/types/course';

export interface GetCoursesParams {
	page?: number;
	size?: number;
	sort?: string;
}

export async function getCourses(params: GetCoursesParams): Promise<CourseListResponse> {
	try {
		const searchParams = new URLSearchParams();
		if (params.page !== undefined) searchParams.set('page', params.page.toString());
		if (params.size !== undefined) searchParams.set('size', params.size.toString());
		if (params.sort) searchParams.set('sort', params.sort);

		const response = await fetch(buildApiUrl(`/course?${searchParams}`), {
			method: 'GET',
			headers: { 'Content-Type': 'application/json' },
		});

		if (!response.ok) {
			throw new Error(`Failed to fetch courses: ${response.status} ${response.statusText}`);
		}

		return await response.json();
	} catch (error) {
		console.error('CourseAPI.getCourses error:', error);
		throw new Error(
			error instanceof Error
				? error.message
				: 'An unexpected error occurred while fetching courses'
		);
	}
}
export async function getCourse(id: string): Promise<Course> {
	const response = await fetch(buildApiUrl(`/courses/${id}`));

	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	}

	return response.json();
}

export async function createCourse(course: Omit<Course, 'id'>): Promise<Course> {
	const response = await fetch(buildApiUrl('/courses'), {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(course)
	});

	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	}

	return response.json();
}

export async function updateCourse(id: string, course: Partial<Course>): Promise<Course> {
	const response = await fetch(buildApiUrl(`/courses/${id}`), {
		method: 'PUT',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(course)
	});

	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	}

	return response.json();
}

export async function deleteCourse(id: string): Promise<void> {
	const response = await fetch(buildApiUrl(`/courses/${id}`), {
		method: 'DELETE'
	});

	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	}
}