import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

/** Redirect /account to /account/dashboard */
export const load: PageLoad = async () => {
	throw redirect(302, '/account/dashboard');
};
