import type { PageLoad } from '../../../../../../.svelte-kit/types/src/routes/(public)/store/course/[id]/$types';
import { courseStore } from '$lib/stores/defaults/CourseStore.svelte';
import { authStore } from '$lib/stores/Auth.svelte';

export const load: PageLoad = async ({ params }) => {
	const course = await courseStore.fetchItem(params.id);

	let isEnrolled = false;

	if (authStore.isAuthenticated) {

	}



	return { course };
};
