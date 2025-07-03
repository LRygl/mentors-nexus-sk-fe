// lib/stores/courses-store.ts
import { writable } from 'svelte/store';
import type { Course, GetCoursesParams, CourseListResponse } from '$lib/types/course'; // adjust import paths
import { getCourses } from '$lib/api/course-api';

export const courses = writable<Course[]>([]);
export const isLoading = writable<boolean>(false);
export const currentParams = writable<GetCoursesParams | null>(null);

export async function loadCourses(params: GetCoursesParams): Promise<void> {
	isLoading.set(true);
	currentParams.set(params);

	try {
		const response: CourseListResponse = await getCourses(params);
		courses.set(response.courses); // adjust based on your response structure
	} catch (error) {
		console.log("Error loading courses data", error);
		courses.set([]);
	} finally {
		isLoading.set(false);
	}
}

export async function refreshCourses(): Promise<void> {
	const params = currentParams.get();
	if (params) {
		await loadCourses(params);
	}
}

export function removeCourse(id: string): void {
	courses.update(coursesList => coursesList.filter(course => course.id !== id));
}

export function addCourse(course: Course): void {
	courses.update(coursesList => [...coursesList, course]);
}

export function updateCourse(updatedCourse: Course): void {
	courses.update(coursesList =>
		coursesList.map(course =>
			course.id === updatedCourse.id ? updatedCourse : course
		)
	);
}