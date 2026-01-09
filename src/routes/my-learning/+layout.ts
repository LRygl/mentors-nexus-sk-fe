import type { LayoutLoad } from './$types';
import { authStore } from '$lib/stores/Auth.svelte.js';
import { redirect } from '@sveltejs/kit';

/**
 * Registered user route guard
 * Protects all /my-learning/* routes
 * Requires authentication AND admin role
 */
export const load: LayoutLoad = async ({ url }) => {
	console.log('[USER GUARD] 🔒 Checking access to:', url.pathname);

	// ✅ Check authStore directly (it's always up-to-date)
	console.log('[USER GUARD] 📊 AuthStore state:', {
		isAuthenticated: authStore.isAuthenticated,
		hasUser: !!authStore.user,
		userRole: authStore.user?.role,
		isInitialized: authStore.isInitialized
	});

	// Ensure auth is initialized
	if (!authStore.isInitialized) {
		console.log('[USER GUARD] ⏳ Initializing auth...');
		await authStore.initialize();
	}

	// Check if user is authenticated
	if (!authStore.isAuthenticated || !authStore.user) {
		console.log('[USER GUARD] ❌ Not authenticated');
		throw redirect(302, `/auth/login?returnUrl=${url.pathname}&error=admin_required`);
	}

	// Check admin role
	const userRole = authStore.user.role?.toUpperCase();
	const isAdmin = userRole === 'USER' || userRole === 'USER';

	console.log('[USER GUARD] 🔒 User role:', userRole, 'Is Admin:', isAdmin);

	if (!isAdmin) {
		console.log('[USER GUARD] ❌ Not admin - access denied');
		throw redirect(302, '/?error=unauthorized');
	}

	console.log('[USER GUARD] ✅ Admin access granted');

	// Return user data (fresh from authStore)
	return {
		user: authStore.user,
		isAuthenticated: true,
		isAdminArea: true
	};
};

export const ssr = false;
export const prerender = false;
