
import { get, writable } from 'svelte/store';
import { getAllUsers } from '$lib/api/user-api';

//export const users = writable<User[]>();
export const isLoading = writable<boolean>(false);
export const isSubmitting = writable<boolean>(false);


/*
export async function loadUsers(): Promise<void> {
	isLoading.set(true);

	try {
		const response: UserListResponse = await getAllUsers();
		users.set(response.users);
	} catch (error) {
		users.set([])
	} finally {
		isLoading.set(false);
	}

}

*/

function createUserStore() {
	const { subscribe, set, update } = writable({
		data: [],
		loading: false,
		error: null,
		loaded: false,
	});

	return {
		subscribe,
		load: async (force = false) => {
			const state = get({ subscribe });

			//Skip if data is allready loaded and not forcing
			if (state.loaded && !force) return state.data;

			update(s => ({ ...s, loading: true, error: null }));

			try {
				const response = await getAllUsers();
				const users = response.users;

				set({
					data: users,
					loading: false,
					error: null,
					loaded: true,
				});

				return users;
			} catch (error) {
				update(s => ({ ...s, loading: false, error: error.message }));
				throw error;
			}
		},
		findById: async (id: string) => {
			const state = get({ subscribe });

			// Ensure data is loaded
			if (!state.loaded && !state.loading) {
				await this.load();
			}

			const currentState = get({ subscribe });
			return currentState.data.find(user => user.id.toString() === id.toString());
		},
		ensureLoaded: async () => {
			const state = get({ subscribe });
			if (!state.loaded && !state.loading) {
				return await this.load();
			}
			return state.data;
		}
	};
}

export const users = createUserStore();