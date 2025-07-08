import { derived, get, writable } from 'svelte/store';
import { getAllUsers } from '$lib/api/user-api';
import type { UserStoreState } from '$lib/types/user';
import { page } from '$app/stores';

export const isLoading = writable<boolean>(false);
export const isSubmitting = writable<boolean>(false);

function createUserStore() {
	const store = writable<UserStoreState>({
		data: [],
		loading: true,
		error: null,
		loaded: false
	});

	const { subscribe, set, update } = store;

	const userStore = {
		subscribe,

		load: async (force = false) => {
			const state = get(store);

			if (state.loaded && !force) return state.data;

			update((s) => ({ ...s, loading: true, error: null }));

			try {
				const users = await getAllUsers(); // assuming UserListResponse is User[]

				set({
					data: users,
					loading: false,
					error: null,
					loaded: true
				});

				return users;
			} catch (error) {
				const errorMessage = error instanceof Error ? error.message : 'Unknown error';
				update((s) => ({ ...s, loading: false, error: errorMessage }));
				throw error;
			}
		},

		findById: async (id: string) => {
			let state = get(store);

			if (!state.loaded && !state.loading) {
				await userStore.load(); // ✅ Use userStore.load() instead of this.load()
			}

			state = get(store);
			return state.data.find((user) => user.id.toString() === id.toString());
		},

		ensureLoaded: async () => {
			const state = get(store);
			if (!state.loaded && !state.loading) {
				return await userStore.load(); // ✅ Use userStore.load()
			}
			return state.data;
		}
	};

	return userStore;
}

export const users = createUserStore();