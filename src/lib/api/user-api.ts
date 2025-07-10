import { buildApiUrl} from '$lib/config/api';
import type { UserListResponse } from '$lib/types/user';

export async function getAllUsers(): Promise<UserListResponse> {
	try {
		const response = await fetch(buildApiUrl(`/user`),{
			method: 'GET',
				headers: { 'Content-Type': 'application/json' },
		});

		if (!response.ok) {
			throw new Error(response.statusText);
		}

		const data = await response.json();
		return data as UserListResponse;
	} catch (error) {
		console.error(error);
		throw error;
	}
}

export async function deleteUser(id: string): Promise<void> {
	console.log("API CALL To Delete User with ID " + id);
	const response = await fetch(buildApiUrl(`/user/${id}`), {
		method: 'DELETE'
	});

	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	}
}

