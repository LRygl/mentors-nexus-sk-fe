import type { PageLoad } from '../../../../.svelte-kit/types/src/routes/admin/category/$types';
import { CourseCategory } from '$lib/types/courseCategory';

export const load: PageLoad = async (loadEvent) => {
	const { fetch } = loadEvent;
	const categoryResponse = await fetch('http://localhost:8080/api/v1/category');
	const category: CourseCategory[] = await categoryResponse.json();
	console.log(category);
	return {
		category
	}
}