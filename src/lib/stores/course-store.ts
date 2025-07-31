// lib/stores/courses-store.ts
import { get, writable } from 'svelte/store';
import { getAllCourses } from '$lib/api/course-api';
import type { CourseStoreState } from '$lib/types/course';

function createCourseStore() {
	const store = writable<CourseStoreState>({
		data: [],
		loading: false,
		error: null,
		loaded: false,
	});

	const { subscribe, set, update } = store;

	const courseStore = {
		subscribe,

		load: async (force = false) => {
			const state = get(store);

			if (state.loaded && !force) return state.data;

			update((s) => ({...s, loading: true, error: null}));

			try {
				const courses = await getAllCourses();

				set({
					data: courses,
					loading: false,
					error: null,
					loaded: true,
				});

				return courses;
			} catch (error) {
				const errorMessage = error instanceof Error ? error.message : 'Unknown error';
				update((s) => ({ ...s, loading: false, error: errorMessage }));
				throw error;
			}
		},


	}

	return courseStore;

}

export const courses = createCourseStore();
