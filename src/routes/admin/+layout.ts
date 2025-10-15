import { redirect } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';
import { authStore } from '$lib/stores/Auth.svelte.js';
import { browser } from '$app/environment';

/**
 * Admin route guard
 * Protects all /admin/* routes
 * Requires authentication AND admin role
 */
export const load: LayoutLoad = async ({ url }) => {
	// Only run in browser (static adapter requirement)
	if (!browser) {
		return {};
	}

	console.log('[ADMIN GUARD] 🔒 Admin guard checking access to:', url.pathname);

	// Initialize auth if not done yet
	if (!authStore.isInitialized) {
		console.log('[ADMIN GUARD] ⏳ Initializing auth...');
		await authStore.initialize();
	}

	// Check if user is authenticated
	if (!authStore.isAuthenticated) {
		console.log('[ADMIN GUARD] ❌ Not Authenticated for: ', url.pathname);
		throw redirect(302, `/auth/login?returnUrl=${url.pathname}&error=admin_required`);
	}

	// Check if user has admin role
	const user = authStore.user;
	const isAdmin = user?.role === 'ROLE_ADMIN' || user?.role === 'ADMIN';

	console.log('[ADMIN GUARD] 👤 User:', user?.email, 'Role:', user?.role, 'Is Admin:', isAdmin);

	if (!isAdmin) {
		console.log('[ADMIN GUARD]  ❌ Not admin - access denied for: ', url.pathname);
		throw redirect(302, '/?error=unauthorized');
	}

	console.log('[ADMIN GUARD] Admin access granted');

	// Return user data to page
	return {
		user: authStore.user
	};
};

// CRITICAL: Disable SSR for static adapter
export const ssr = false;
export const prerender = false;