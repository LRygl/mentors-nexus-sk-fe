import { redirect } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';
import { authStore } from '$lib/stores/Auth.svelte.js';

/**
 * Account route guard
 * Protects all /account/* routes
 * Requires authentication (any role)
 */
export const load: LayoutLoad = async ({ url, parent }) => {
	// Wait for the root layout to finish — auth initialization happens there.
	// Without this, SvelteKit runs parent and child load functions concurrently,
	// causing the guard to see isInitialized=false and race with the root layout.
	await parent();

	// Check if user is authenticated
	if (!authStore.isAuthenticated || !authStore.user) {
		console.log('[ACCOUNT GUARD] Not authenticated, redirecting to login');
		throw redirect(302, `/auth/login?returnUrl=${url.pathname}`);
	}

	console.log('[ACCOUNT GUARD] Access granted for:', authStore.user.email);

	return {
		user: authStore.user,
		isAuthenticated: true
	};
};

export const ssr = false;
export const prerender = false;
