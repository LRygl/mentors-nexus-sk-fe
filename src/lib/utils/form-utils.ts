import type { CourseFormData } from '$lib/types/course';

export function createFormData(): {
	name: string;
	price: string;
	labels: any[];
	categories: any[];
	courseOwnerId: string
} {
	return {
		name: "",
		price: "",
		labels: [],
		categories: [],
		courseOwnerId: ""
	};
}

export function validateForm(formData: CourseFormData): boolean {
	return !!(formData.name &&
		formData.price &&
		formData.courseOwnerId);
}

export function addToArray(array: string[], item: string): string[] {
	const trimmedItem = item.trim();
	if (trimmedItem && !array.includes(trimmedItem)) {
		return [...array, trimmedItem];
	}
	return array;
}

export function removeFromArray(array: string[], item: string): string[] {
	return array.filter(arrayItem => arrayItem !== item);
}
