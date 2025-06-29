import { buildApiUrl } from '$lib/config/api';
import type { Course, CourseListParams, CourseListResponse } from '$lib/types/course';

export async function getCourses(params: CourseListParams = {}): Promise<CourseListResponse> {
	const queryParams = new URLSearchParams();

	if (params.page !== undefined) queryParams.append('page', params.page.toString());
	if (params.pageSize !== undefined) queryParams.append('pageSize', params.pageSize.toString());
	if (params.search) queryParams.append('search', params.search);
	if (params.status) queryParams.append('status', params.status);
	if (params.sortBy) queryParams.append('sortBy', params.sortBy);
	if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);

	const queryString = queryParams.toString();
	const url = buildApiUrl(`/courses${queryString ? `?${queryString}` : ''}`);

	const response = await fetch(url);

	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	}

	return response.json();
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