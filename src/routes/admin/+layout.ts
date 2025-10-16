import { redirect } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';
import { authStore } from '$lib/stores/Auth.svelte.js';

/**
 * Admin route guard
 * Protects all /admin/* routes
 * Requires authentication AND admin role
 */
export const load: LayoutLoad = async ({ url }) => {
	console.log('[ADMIN GUARD] 🔒 Checking access to:', url.pathname);

	// ✅ Check authStore directly (it's always up-to-date)
	console.log('[ADMIN GUARD] 📊 AuthStore state:', {
		isAuthenticated: authStore.isAuthenticated,
		hasUser: !!authStore.user,
		userRole: authStore.user?.role,
		isInitialized: authStore.isInitialized
	});

	// Ensure auth is initialized
	if (!authStore.isInitialized) {
		console.log('[ADMIN GUARD] ⏳ Initializing auth...');
		await authStore.initialize();
	}

	// Check if user is authenticated
	if (!authStore.isAuthenticated || !authStore.user) {
		console.log('[ADMIN GUARD] ❌ Not authenticated');
		throw redirect(302, `/auth/login?returnUrl=${url.pathname}&error=admin_required`);
	}

	// Check admin role
	const userRole = authStore.user.role?.toUpperCase();
	const isAdmin = userRole === 'ROLE_ADMIN' || userRole === 'ADMIN';

	console.log('[ADMIN GUARD] 🔒 User role:', userRole, 'Is Admin:', isAdmin);

	if (!isAdmin) {
		console.log('[ADMIN GUARD] ❌ Not admin - access denied');
		throw redirect(302, '/?error=unauthorized');
	}

	console.log('[ADMIN GUARD] ✅ Admin access granted');

	// Return user data (fresh from authStore)
	return {
		user: authStore.user,
		isAuthenticated: true,
		isAdminArea: true
	};
};

export const ssr = false;
export const prerender = false;