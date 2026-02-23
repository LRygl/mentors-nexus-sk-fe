/**
 * Global authentication state using Svelte 5 runes
 * This replaces the need for Svelte stores in Svelte 5
 */

import { authService } from '$lib/Services/AuthService';
import { ApiError } from '$lib/API/APIBase';
import type { User } from '$lib/types/entities/User';
import { goto, invalidateAll } from '$app/navigation';
import { browser } from '$app/environment';
import { ROUTES } from '$lib/Config/routes.config';
import { tick } from 'svelte';
import { enrollmentService } from '$lib/Services/EnrollmentService.svelte';
import type { AuthUser } from '$lib/types/entities/Auth';
import { Role } from '$lib/types/enums/Role';

class AuthStore {
	user = $state<AuthUser | null>(null);
	isLoading = $state(false);
	isInitialized = $state(false);
	lastCheck = $state<number>(0);

	// Session management
	private refreshTimer: number | null = null;
	private activityTimer: number | null = null;

	// Initialization lock — prevents concurrent initialize() calls from each
	// racing to hit the backend. All concurrent callers share the same promise.
	private initializationPromise: Promise<void> | null = null;

	// localStorage keys for persisting non-sensitive user metadata across refreshes.
	// The actual security token lives in the HttpOnly cookie; we only cache the
	// user object (name, email, role) so the UI can restore without an /auth/me call.
	private readonly STORAGE_USER_KEY = 'auth:user';
	private readonly STORAGE_EXPIRY_KEY = 'auth:expiry';

	// Cache validity (5 minutes)
	private readonly CACHE_DURATION = 5 * 60 * 1000;
	// Token refresh interval (4 minutes - before expiry)
	private readonly REFRESH_INTERVAL = 4 * 60 * 1000;
	// Inactivity timeout (30 minutes)
	private readonly INACTIVITY_TIMEOUT = 30 * 60 * 1000;

	private lastActivity = Date.now();

	get needsRefresh(): boolean {
		if (!this.lastCheck) return true;
		return Date.now() - this.lastCheck > this.CACHE_DURATION;
	}

	/**
	 * Derived state - computed from user
	 */
	get isAuthenticated(): boolean {
		return this.user !== null;
	}

	get isAdmin(): boolean {
		return this.user?.role == Role.ROLE_ADMIN;
	}

	/**
	 * Initialize auth state on app load.
	 * Checks if user has a valid cookie session.
	 *
	 * Multiple concurrent callers (e.g. root layout + account guard running in
	 * parallel) all receive the same in-flight Promise so only one HTTP request
	 * is ever made.
	 */
	async initialize(): Promise<void> {
		if (this.isInitialized && !this.needsRefresh) {
			return;
		}

		// If already in progress, piggyback on the existing call
		if (this.initializationPromise) {
			return this.initializationPromise;
		}

		this.initializationPromise = this._doInitialize();
		return this.initializationPromise;
	}

	private async _doInitialize(): Promise<void> {
		this.isLoading = true;

		try {
			// Primary: validate with the server — this is the authoritative source
			const user = await authService.getCurrentUser();
			this.user = user;
			this.lastCheck = Date.now();
			this.saveUserToStorage(user); // keep cache fresh

			console.log('[Auth] User authenticated:', user.email);

			await enrollmentService.initialize(user.enrolledCourseIds);
			this.startSessionManagement();
		} catch (error) {
			const isAuthError =
				error instanceof ApiError && error.status === 401;

			if (isAuthError) {
				// Cookie is genuinely expired / invalid — treat as logged out
				console.log('[Auth] Session expired (401)');
				this.user = null;
				this.clearUserStorage();
				enrollmentService.clear();
				this.stopSessionManagement();
			} else {
				// /auth/me not yet implemented, network error, 500, etc.
				// Fall back to the user we persisted after the last successful login.
				const storedUser = this.loadUserFromStorage();
				if (storedUser) {
					console.log('[Auth] /auth/me unavailable — restoring from localStorage:', storedUser.email);
					this.user = storedUser;
					this.lastCheck = Date.now();
					await enrollmentService.initialize(storedUser.enrolledCourseIds);
					this.startSessionManagement();
				} else {
					console.log('[Auth] No stored session, treating as unauthenticated');
					this.user = null;
					enrollmentService.clear();
					this.stopSessionManagement();
				}
			}
		} finally {
			this.isLoading = false;
			this.isInitialized = true;
			this.initializationPromise = null;
		}
	}

	// ── localStorage helpers ──────────────────────────────────────────────────

	/** Persist user metadata (NOT the token) so the UI survives a page refresh. */
	private saveUserToStorage(user: AuthUser, expiresInSeconds?: number): void {
		if (!browser) return;
		try {
			localStorage.setItem(this.STORAGE_USER_KEY, JSON.stringify(user));
			if (expiresInSeconds) {
				localStorage.setItem(
					this.STORAGE_EXPIRY_KEY,
					String(Date.now() + expiresInSeconds * 1000)
				);
			}
		} catch {
			// localStorage unavailable (private browsing quota, etc.) — silently ignore
		}
	}

	/** Read the cached user. Returns null if absent or expired. */
	private loadUserFromStorage(): AuthUser | null {
		if (!browser) return null;
		try {
			const expiryStr = localStorage.getItem(this.STORAGE_EXPIRY_KEY);
			if (expiryStr && Date.now() > parseInt(expiryStr, 10)) {
				this.clearUserStorage();
				return null;
			}
			const raw = localStorage.getItem(this.STORAGE_USER_KEY);
			return raw ? (JSON.parse(raw) as AuthUser) : null;
		} catch {
			return null;
		}
	}

	/** Remove all stored auth data (called on logout or confirmed session expiry). */
	private clearUserStorage(): void {
		if (!browser) return;
		try {
			localStorage.removeItem(this.STORAGE_USER_KEY);
			localStorage.removeItem(this.STORAGE_EXPIRY_KEY);
		} catch {}
	}

	/**
	 * Login user
	 */
	async login(email: string, password: string): Promise<void> {
		console.log('[Auth] 🔐 Attempting login:', email);

		this.isLoading = true;

		try {
			// ✅ Get full response with user and expiresIn
			const response = await authService.login({
				email,
				password,
				rememberMe: false
			});

			console.log('[Auth] ===== LOGIN RESPONSE =====');
			console.log('[Auth] Full response:', response);
			console.log('[Auth] User:', response.user);
			console.log('[Auth] ExpiresIn:', response.expiresIn);
			console.log('[Auth] ============================');

			// ✅ Validate we got user data
			if (!response.user || !response.user.email) {
				throw new Error('Invalid login response: missing user data');
			}

			// ✅ Set the user from the response
			this.user = response.user;
			this.lastCheck = Date.now();

			// Persist user metadata so a page refresh can restore without /auth/me
			this.saveUserToStorage(response.user, response.expiresIn);

			// ✅ Initialize enrolled courses via enrollment service
			if (response.user.enrolledCourseIds) {
				await enrollmentService.initialize(response.user.enrolledCourseIds);
			}

			console.log('[Auth] ✅ Login successful! User:', this.user.email);
			console.log('[Auth] Token expires in:', response.expiresIn, 'seconds');

			// ✅ Start session management after successful login
			this.startSessionManagement();

		} catch (error) {
			console.error('[Auth] ❌ Login failed:', error);
			this.user = null;

			// Clear enrollments on failure
			enrollmentService.clear();

			throw error;
		} finally {
			this.isLoading = false;
		}
	}

	/**
	 * Register new user
	 */
	async register(userData: any) {
		this.isLoading = true;
		try {
			const response = await authService.register(userData);
			this.lastCheck = Date.now();
			return response;
		} finally {
			this.isLoading = false;
		}
	}
	/**
	 * Logout user
	 */
	async logout() {
		this.isLoading = true;

		try {
			console.log('[Auth] Starting logout...');

			// 1. Call backend logout first
			await authService.logout();
			console.log('[Auth] Backend logout successful');
		} catch (error) {
			console.error('[Auth] Backend logout error:', error);
			// Continue with local cleanup even if backend fails
		}

		try {
			// 2. Stop session management
			this.stopSessionManagement();

			// 3. Clear local state immediately
			this.user = null;
			this.lastCheck = 0;
			this.isInitialized = false;
			this.clearUserStorage();

			console.log('[Auth] Local state cleared');
			console.log('[Auth] isAuthenticated:', this.isAuthenticated);

			// 4. Force SvelteKit to invalidate all data
			await invalidateAll();
			await tick();

			// 5. Small delay to ensure reactivity propagates
			await new Promise((resolve) => setTimeout(resolve, 100));

			console.log('[Auth] Logout complete, redirecting...');

			// 6. Navigate to home with replace to prevent back button issues
			// Use window.location for a hard navigation that clears everything
			//window.location.href = ROUTES.PUBLIC.LOGIN;

			await goto(ROUTES.PUBLIC.LOGIN, {
				replaceState: true,
				invalidateAll: true,
				state: undefined
			});
		} catch (error) {
			console.error('[Auth] Logout cleanup error:', error);

			// Force hard reload as fallback
			if (browser) {
				window.location.href = '/';
			}
		} finally {
			this.isLoading = false;
		}
	}
	/**
	 * Refresh user data from server
	 */
	async refreshUser() {
		try {
			const user = await authService.getCurrentUser();
			this.user = user;
			this.lastCheck = Date.now();
		} catch (error) {
			console.error('[Auth] Refresh user failed:', error);

			// Session likely expired
			await this.handleSessionExpired();
			throw error;
		}
	}

	// Clear auth state (for security incidents)
	clearAuth() {
		this.stopSessionManagement();
		this.user = null;
		this.isInitialized = false;
		this.lastCheck = 0;
		this.clearUserStorage();
	}

	// ============================================
	// SESSION MANAGEMENT (PRIVATE METHODS)
	// ============================================

	/**
	 * Start automatic token refresh and activity monitoring
	 */
	private startSessionManagement() {
		if (!browser) return;

		console.log('[Auth] Starting session management');

		// Clear any existing timers
		this.stopSessionManagement();

		// 1. Start periodic token refresh
		this.refreshTimer = window.setInterval(() => {
			if (this.isAuthenticated) {
				this.performTokenRefresh();
			}
		}, this.REFRESH_INTERVAL);

		// 2. Setup activity monitoring
		this.setupActivityMonitoring();

		// 3. Initialize activity timestamp
		this.lastActivity = Date.now();

		// 4. Check for inactivity
		this.checkInactivity();
	}

	/**
	 * Stop session management timers
	 */
	private stopSessionManagement() {
		if (this.refreshTimer) {
			clearInterval(this.refreshTimer);
			this.refreshTimer = null;
		}

		if (this.activityTimer) {
			clearInterval(this.activityTimer);
			this.activityTimer = null;
		}

		this.removeActivityListeners();
	}

	/**
	 * Perform token refresh
	 */
	private async performTokenRefresh() {
		try {
			console.log('[Auth] Refreshing token...');

			// Call your refresh endpoint
			// Your Spring Boot should have a /auth/refresh endpoint
			await authService.refreshToken?.();

			this.lastCheck = Date.now();
			console.log('[Auth] Token refreshed successfully');
		} catch (error) {
			console.error('[Auth] Token refresh failed:', error);

			// If refresh fails, session is expired
			await this.handleSessionExpired();
		}
	}

	/**
	 * Handle session expiration
	 */
	private async handleSessionExpired() {
		console.warn('[Auth] Session expired');

		this.stopSessionManagement();
		this.user = null;
		this.lastCheck = 0;

		if (browser) {
			const currentPath = window.location.pathname;

			// Don't redirect if already on login page
			if (!currentPath.includes('/login')) {
				await goto(`/login?returnUrl=${encodeURIComponent(currentPath)}&error=session_expired`);
			}
		}
	}

	/**
	 * Setup activity monitoring
	 */
	private setupActivityMonitoring() {
		if (!browser) return;

		const activityEvents = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];

		const handleActivity = () => {
			this.lastActivity = Date.now();
		};

		// Add event listeners
		activityEvents.forEach((event) => {
			window.addEventListener(event, handleActivity, { passive: true });
		});

		// Store for cleanup
		(this as any)._activityHandler = handleActivity;
		(this as any)._activityEvents = activityEvents;

		// Check inactivity periodically (every minute)
		this.activityTimer = window.setInterval(() => {
			this.checkInactivity();
		}, 60 * 1000);
	}

	/**
	 * Remove activity listeners
	 */
	private removeActivityListeners() {
		if (!browser) return;

		const handler = (this as any)._activityHandler;
		const events = (this as any)._activityEvents;

		if (handler && events) {
			events.forEach((event: string) => {
				window.removeEventListener(event, handler);
			});
		}
	}

	/**
	 * Check for user inactivity
	 */
	private checkInactivity() {
		const inactiveTime = Date.now() - this.lastActivity;

		if (inactiveTime > this.INACTIVITY_TIMEOUT) {
			console.warn('[Auth] User inactive for too long, logging out');
			this.logout();
		}
	}
}

// Export singleton instance
export const authStore = new AuthStore();

// Make it available in browser console for debugging
if (typeof window !== 'undefined') {
	(window as any).authStore = authStore;
}