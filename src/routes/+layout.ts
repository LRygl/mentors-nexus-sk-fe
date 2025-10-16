import type { LayoutLoad } from '../../.svelte-kit/types/src/routes/$types';
import { browser } from '$app/environment';
import { authStore } from '$lib/stores/Auth.svelte';

export const load: LayoutLoad = async () => {
	if (!browser) {
		return {};
	}

	// Initialize auth on first load (only if not already initialized)
	if (!authStore.isInitialized) {
		console.log('[ROOT LAYOUT] 🔄 Initializing auth...');
		await authStore.initialize();
	}

	// No need to return user data - components access authStore directly
	return {};
};

export const ssr = false;
export const prerender = false;