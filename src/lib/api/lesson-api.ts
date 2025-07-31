import type { Lesson } from '$lib/types/lesson';
import { buildApiUrl } from '$lib/config/api';

export async function getAllLessons(): Promise<Lesson[]> {
	try {
		const response = await fetch(buildApiUrl(`/lesson/all`), {
			method: 'GET',
			headers: { 'Content-Type': 'application/json' },
		});

		if (!response.ok) {
			throw new Error(response.statusText);
		}

		const data = await response.json();
		return data as Lesson[];
	} catch (error) {
		console.error(error);
		throw error;
	}
}

export async function getLessonById(id: string | number): Promise<Lesson> {
	const response = await fetch(buildApiUrl(`$/lessons/${id}`));
	if (!response.ok) {
		if (response.status === 404) {
			throw new Error('Lesson not found');
		}
		throw new Error(`Failed to fetch lesson: ${response.status}`);
	}
	return response.json();
}