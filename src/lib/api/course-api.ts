import { buildApiUrl } from '$lib/config/api';
import type {
	Course,
	CourseFormData,
	CourseListPagedResponse, CourseListResponse,
	CourseResponse,
	CreateCourseRequest
} from '$lib/types/course';

export interface GetCoursesParams {
	page?: number;
	size?: number;
	sort?: string;
}

export async function getAllCourses(): Promise<CourseListResponse> {
	try {
		const response = await fetch(buildApiUrl(`/course/all`), {
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

export async function getCourses(params: GetCoursesParams): Promise<CourseListPagedResponse> {
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

		const data = await response.json();
		console.log('Raw API response in getCourses:', data); // Add this line
		return data; // Should return the full response object with content, totalElements, etc.

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

export async function createCourse(courseData: CourseFormData): Promise<CourseResponse> {
	const payload: CreateCourseRequest = {
		name: courseData.name,
		price: parseInt(courseData.price),
		labels: courseData.labels,
		categories: courseData.categories,
		courseOwnerId: parseInt(courseData.courseOwnerId),
	};

	console.log(JSON.stringify(payload));

	const response = await fetch(buildApiUrl(`/course`), {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(payload),
	})

	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	}

	return response.json();
}

export async function updateCourse(id: string, course: Partial<Course>): Promise<Course> {
	const response = await fetch(buildApiUrl(`/course/${id}`), {
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
	console.log("API CALL To Delete Course ID " + id);
	const response = await fetch(buildApiUrl(`/course/${id}`), {
		method: 'DELETE'
	});

	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	}
}