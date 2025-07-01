import { buildApiUrl} from '$lib/config/api';
import type { UserListResponse } from '$lib/types/user';

export async function getAllUsers(): Promise<UserListResponse> {
	try {
		const response = await fetch(buildApiUrl(`/user`),{
			method: 'POST',
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
