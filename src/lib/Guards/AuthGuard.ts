// ============================================================================
// FILE: src/lib/guards/authGuard.ts
// Production-ready route guard with security best practices
// ============================================================================

import { goto } from '$app/navigation';
import { isCourseOwner, type User } from '$lib/types/entities/User';
import { isAdmin } from '$lib/types/entities/User';
import { authStore } from '../stores/Auth.svelte';

/**
 * Route protection levels
 */
export enum ProtectionLevel {
	PUBLIC = 'PUBLIC',           // Anyone can access
	AUTHENTICATED = 'AUTHENTICATED', // Must be logged in
	ADMIN = 'ADMIN',             // Must be admin
	COURSE_OWNER = 'COURSE_OWNER'    // Must be course owner or admin
}

/**
 * Guard configuration
 */
interface GuardConfig {
	level: ProtectionLevel;
	redirectOnFail?: string;
	onUnauthorized?: (user: User | null, reason: string) => void;
	customCheck?: (user: User) => boolean;
}

/**
 * Guard result
 */
interface GuardResult {
	allowed: boolean;
	user: User | null;
	reason?: string;
}

/**
 * Main authorization guard
 * Returns result instead of throwing to allow for custom error handling
 */
export async function checkAccess(config: GuardConfig): Promise<GuardResult> {
	// Ensure auth is initialized
	if (!authStore.isInitialized || authStore.needsRefresh) {
		await authStore.initialize();
	}

	const user = authStore.user;
	const isAuthenticated = authStore.isAuthenticated;

	// Public routes - always allow
	if (config.level === ProtectionLevel.PUBLIC) {
		return { allowed: true, user };
	}

	// Authentication required
	if (!isAuthenticated || !user) {
		console.log('[GUARD] INSUFFICIENT_PRIVILEGES - ', user);
		return {
			allowed: false,
			user: null,
			reason: 'NOT_AUTHENTICATED'
		};
	}

	// Role-based checks
	switch (config.level) {
		case ProtectionLevel.ADMIN:
			if (!isAdmin(user)) {
				console.log('[GUARD] INSUFFICIENT_PRIVILEGES - ', user);
				return {
					allowed: false,
					user,
					reason: 'INSUFFICIENT_PRIVILEGES'
				};
			}
			break;

		case ProtectionLevel.COURSE_OWNER:
			if (!isAdmin(user) && !isCourseOwner(user)) {
				console.log('[GUARD] INSUFFICIENT_PRIVILEGES - ', user);
				return {
					allowed: false,
					user,
					reason: 'INSUFFICIENT_PRIVILEGES'
				};
			}
			break;

		case ProtectionLevel.AUTHENTICATED:
			// Already checked above
			console.log('[GUARD] AUTHENTICATED - ', user);
			break;
	}

	// Custom check function
	if (config.customCheck && !config.customCheck(user)) {
		return {
			allowed: false,
			user,
			reason: 'CUSTOM_CHECK_FAILED'
		};
	}

	// Access granted
	return { allowed: true, user };
}


/**
 * Execute guard and handle redirect
 * Use this in components for automatic redirect handling
 */
export async function guardRoute(config: GuardConfig, currentPath: string): Promise<boolean> {
	const result = await checkAccess(config);

	if (!result.allowed) {
		// Log security event (in production, send to monitoring service)
		console.warn('[Security] Access denied:', {
			path: currentPath,
			reason: result.reason,
			user: result.user?.email || 'anonymous',
			timestamp: new Date().toISOString()
		});

		// Custom unauthorized handler
		if (config.onUnauthorized) {
			config.onUnauthorized(result.user,'UNAUTHORIZED');
		}

		// Determine redirect
		let redirectPath = config.redirectOnFail;

		if (!redirectPath) {
			if (result.reason === 'NOT_AUTHENTICATED') {
				redirectPath = `/auth/login?returnUrl=${encodeURIComponent(currentPath)}`;
			} else {
				redirectPath = '/?error=unauthorized';
			}
		}

		// Execute redirect
		goto(redirectPath);
		return false;
	}

	return true;
}


/**
 * Pre-configured guards for common scenarios
 */
export const GUARDS = {
	/** Requires admin role */
	admin: {
		level: ProtectionLevel.ADMIN,
		redirectOnFail: '/auth/login?error=admin_required'
	},

	/** Requires any authenticated user */
	authenticated: {
		level: ProtectionLevel.AUTHENTICATED
	},

	/** Requires course owner or admin */
	courseOwner: {
		level: ProtectionLevel.COURSE_OWNER,
		redirectOnFail: '/course?error=owner_required'
	},

	/** Public route (no protection) */
	public: {
		level: ProtectionLevel.PUBLIC
	}
} as const;

