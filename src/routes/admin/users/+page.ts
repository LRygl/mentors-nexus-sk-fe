import type { User } from '$lib/types/user.ts';
import type { PageLoad } from '../../../../.svelte-kit/types/src/routes/admin/users/$types';


export const load: PageLoad = async (loadEvent) => {
  const { fetch } = loadEvent;

	try {
		const usersResponse = await fetch('http://localhost:8080/api/v1/user');

		if (!usersResponse.ok) {
			throw new Error(`HTTP error! status: ${usersResponse.status}`);
		}

		const users: User[] = await usersResponse.json();
		console.log(users);
		return {
			users,
			error: null
		};
	} catch (error) {
		console.error('Failed to fetch users:', error);

		return {
			users: [],
			error: 'Failed to load users. Please check your connection and try again.'
		}
	}



}
