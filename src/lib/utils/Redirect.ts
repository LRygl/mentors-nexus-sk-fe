// ============================================
// Helper functions for safe redirect handling
// ============================================

import { ROUTES} from '$lib/Config/routes.config';
import { DEFAULT_REDIRECT, ROLE_REDIRECTS, LOGOUT_REDIRECT } from '$lib/Config/role-redirect.config';

/**
 * Validate that a return URL is safe (no open redirect vulnerability)
 */
export function isSafeReturnUrl(url: string | null): boolean {
	if (!url) return false;

	// Must start with / (internal path only)
	if (!url.startsWith('/')) return false;

	// Block external URLs
	if (url.startsWith('//') || url.includes('://')) return false;

	// Block javascript: and data: URIs
	return !(url.toLowerCase().startsWith('javascript:') ||
		url.toLowerCase().startsWith('data:'));


}

/**
 * Get a safe return URL from query params or default path
 */
export function getSafeReturnUrl(
	returnUrl: string | null,
	defaultPath: string = DEFAULT_REDIRECT
): string {
	if (isSafeReturnUrl(returnUrl)) {
		return returnUrl!;
	}
	return defaultPath;
}

/**
 * Get redirect path based on user's role
 */
export function getLoginRedirectPath(
	userRole: string | string[] | null | undefined
): string {
	if (!userRole) {
		return DEFAULT_REDIRECT;
	}

	const roles = Array.isArray(userRole) ? userRole : [userRole];

	const matchingRedirects = ROLE_REDIRECTS.filter(redirect =>
		roles.includes(redirect.role)
	);

	if (matchingRedirects.length === 0) {
		console.warn('[Redirect] No matching redirect for roles:', roles);
		return DEFAULT_REDIRECT;
	}

	matchingRedirects.sort((a, b) => b.priority - a.priority);

	return matchingRedirects[0].path;
}



/**
 * Build login URL with return URL and error
 */
export function buildLoginUrl(returnUrl: string, error?: string): string {
	const params = new URLSearchParams();

	if (returnUrl) {
		params.set('returnUrl', returnUrl);
	}

	if (error) {
		params.set('error', error);
	}

	return `${ROUTES.PUBLIC.LOGIN}?${params.toString()}`;
}

// Re-export for convenience
export { ROUTES, DEFAULT_REDIRECT, LOGOUT_REDIRECT };