import { writable } from 'svelte/store';
import type { User } from '$lib/types/user';
import { getAllUsers } from '$lib/api/user-api';

export const users = writable<User[]>([]);
export const isSubmitting = writable<boolean>(false);

export async function loadUsers(): Promise<void> {
	try {
		const usersData = await getAllUsers();
		users.set(usersData);

	} catch (error) {
		console.log("Error loading user data", error);
	}
}