import { get, writable } from 'svelte/store';
import { getCategories } from '$lib/api/CourseCategoryAdminAPI';
import type { CategoryStoreState } from '$lib/types/category';

//Category State
function createCategoryStore() {
	const store = writable<CategoryStoreState>({
		data: [],
		loading: false,
		error: null,
		loaded: false,
	});

	const { subscribe, set, update } = store;

	const categoryStore = {
		subscribe,

		load: async (force = false) => {
			const state = get(store);

			if (state.loaded && !force) return state.data;

			update((s) => ({...s, loading: true, error: null}));

			try {
				const categories = await getCategories();

				set({
					data: categories,
					loading: false,
					error: null,
					loaded: true,
				});

				return categories;
			} catch (error) {
				const errorMessage = error instanceof Error ? error.message : "Unknown error";
				update((s) => ({...s, loading: false, error: errorMessage}));
				throw error;
			}
		},
	}

	return categoryStore;
}

export const categories = createCategoryStore();