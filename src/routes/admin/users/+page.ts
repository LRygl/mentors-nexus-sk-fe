import type { User } from '$lib/types/user.ts';
import type { PageLoad } from '../../../../.svelte-kit/types/src/routes/admin/users/$types';


export const load: PageLoad = async (loadEvent) => {
  const { fetch } = loadEvent;
	const usersResponse = await fetch('http://localhost:8080/api/v1/user');
	const users: User[] = await usersResponse.json();
	console.log(users);
	return {
		users
	}
}
