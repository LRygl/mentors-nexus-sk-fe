import { get, writable } from 'svelte/store';
import type { Lesson, LessonStoreState } from '$lib/types/lesson';
import { getAllLessons, getLessonById } from '$lib/api/lesson-api';


function createLessonStore() {
	const store = writable<LessonStoreState>({
		data: [],
		loading: true,
		error: null,
		loaded: false,
	});

	const { subscribe, set, update } = store;

	const lessonStore = {
		subscribe,
		load: async (force = false) => {
			const state = get(store);

			if (state.loaded && !force) return state.data;

			update((state) => ({ ...state, loading: true, error: null }));

			try {
				const lessons = await getAllLessons();

				set({
					data: lessons,
					loading: false,
					error: null,
					loaded: true,
				});

				return lessons;
			} catch (error) {
				const errorMessage = error instanceof Error ? error.message : 'Unknown error';
				update((state) => ({ ...state, loading: false, error: errorMessage }));
				throw error;
			}
		},

		findById: async (id: string | number): Promise<Lesson | null> => {
			let state = get(store);

			// First check if lesson is already in store
			let lesson = state.data.find((lesson) => lesson.id.toString() === id.toString());

			if (lesson) {
				return lesson;
			}

			// If not in store, fetch from API
			try {
				lesson = await getLessonById(id);

				// Add to store
				update((state) => ({
					...state,
					data: [...state.data, lesson]
				}));

				return lesson;
			} catch (error) {
				// If individual fetch fails, try loading all lessons first
				if (!state.loaded) {
					try {
						await lessonStore.load();
						state = get(store);
						return state.data.find((lesson) => lesson.id.toString() === id.toString()) || null;
					} catch {
						return null;
					}
				}
				return null;
			}
		},

		ensureLoaded: async () => {
			const state = get(store);
			if (!state.loaded && !state.loading) {
				return await lessonStore.load();
			}
			return state.data;
		}
	};

	return lessonStore;

}

export const lessonStore = createLessonStore();