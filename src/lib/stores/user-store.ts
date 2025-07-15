import { derived, get, writable } from 'svelte/store';
import { getAllUsers, getUserById, updateUserPrivacySetting } from '$lib/api/user-api';
import type { User, UserStoreState } from '$lib/types/user';
import { page } from '$app/stores';
import type { PrivacySetting } from '$lib/types/privacySetting';

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

		// Load a single user by ID and add/update in the array
		async loadUser(id: string) {
			update(state => ({ ...state, loading: true, error: null }));

			try {
				const user = await getUserById(id); // This now returns a single User

				update(state => {
					// Find if user already exists in the array
					const existingIndex = state.data.findIndex(u => u.id === user.id);

					let newData;
					if (existingIndex >= 0) {
						// Update existing user
						newData = [...state.data];
						newData[existingIndex] = user;
					} else {
						// Add new user
						newData = [...state.data, user];
					}

					return {
						...state,
						data: newData,
						loading: false,
						loaded: true
					};
				});

				return user;
			} catch (error) {
				update(state => ({
					...state,
					loading: false,
					error: error instanceof Error ? error.message : 'Unknown error'
				}));

				throw error;
			}
		},

		// NEW: Update privacy setting for a user
		async updatePrivacySetting(userId: string, setting: PrivacySetting, value: boolean) {
			const state = get(store);
			const userIndex = state.data.findIndex(u => u.id.toString() === userId.toString());

			if (userIndex === -1) {
				throw new Error(`User with ID ${userId} not found in store`);
			}

			const user = state.data[userIndex];

			// Handle both boolean and object with value property
			const currentSetting = user[setting];
			const previousValue = typeof currentSetting === 'boolean' ? currentSetting : currentSetting?.value;

			// Optimistic update
			update(state => {
				const newData = [...state.data];

				// Update based on current structure
				if (typeof user[setting] === 'boolean') {
					// Direct boolean property
					newData[userIndex] = {
						...user,
						[setting]: value
					};
				} else {
					// Object with value property
					newData[userIndex] = {
						...user,
						[setting]: {
							...(user[setting] || {}),
							value: value
						}
					};
				}

				return { ...state, data: newData };
			});

			try {
				// Call your API
				await updateUserPrivacySetting(userId, setting, value);

				console.log(`Successfully updated ${setting} to ${value} for user ${userId}`);
			} catch (error) {
				// Rollback on error
				update(state => {
					const newData = [...state.data];

					if (typeof user[setting] === 'boolean') {
						// Direct boolean property
						newData[userIndex] = {
							...user,
							[setting]: previousValue
						};
					} else {
						// Object with value property
						newData[userIndex] = {
							...user,
							[setting]: {
								...(user[setting] || {}),
								value: previousValue
							}
						};
					}

					return { ...state, data: newData };
				});

				console.error(`Failed to update ${setting}:`, error);
				throw error;
			}
		},


		// Find user by ID - first check store, then load if not found
		findById: async (id: string) => {
			let state = get(store);

			// First check if user exists in store
			const existingUser = state.data.find((user) => user.id.toString() === id.toString());
			if (existingUser) {
				return existingUser;
			}

			// If not in store, load it from API
			try {
				const user = await userStore.loadUser(id);
				return user;
			} catch (error) {
				console.error('Failed to load user:', error);
				return null;
			}
		},

		// Get user by ID from current store data only (no API call)
		getUserById(id: number): User | null {
			const state = get(store);
			return state.data.find(user => user.id === id) || null;
		},

		// Get user by ID string from current store data only (no API call)
		getUserByIdString(id: string): User | null {
			const state = get(store);
			return state.data.find(user => user.id.toString() === id) || null;
		},
		// NEW: Toggle privacy setting (convenience method)
		async togglePrivacySetting(userId: string, setting: PrivacySetting) {
			const user = userStore.getUserByIdString(userId);
			if (!user) {
				throw new Error(`User with ID ${userId} not found`);
			}

			// Handle both boolean and object with value property
			const currentSetting = user[setting];
			let currentValue: boolean;

			if (typeof currentSetting === 'boolean') {
				currentValue = currentSetting;
			} else if (currentSetting && typeof currentSetting === 'object' && 'value' in currentSetting) {
				currentValue = (currentSetting as any).value;
			} else {
				throw new Error(`Privacy setting ${setting} not found or invalid`);
			}

			await userStore.updatePrivacySetting(userId, setting, !currentValue);
		},

		// NEW: Get privacy setting value
		getPrivacySetting(userId: string, setting: PrivacySetting): boolean | null {
			const user = userStore.getUserByIdString(userId);
			if (!user) return null;

			const currentSetting = user[setting];

			if (typeof currentSetting === 'boolean') {
				return currentSetting;
			} else if (currentSetting && typeof currentSetting === 'object' && 'value' in currentSetting) {
				return (currentSetting as any).value;
			}

			return null;
		},
	};

	return userStore;
}

export const users = createUserStore();