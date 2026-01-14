import type { PageLoad } from '/$types';
import { courseStore } from '$lib/stores/defaults/CourseStore.svelte.js';
import { authStore } from '$lib/stores/Auth.svelte.js';

export const load: PageLoad = async ({ params }) => {
	const { courseId } = params
	const course = await courseStore.fetchItem(courseId);

	let isEnrolled = false;

	if (authStore.isAuthenticated) {

	}

	return { course };
};
