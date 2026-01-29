console.log('Loading AuthService');
import { BaseApiService } from '$lib/API/APIBase';
import { API_CONFIG } from '$lib/API/APIConfiguration';
import type {
	AuthUser,
	LoginApiResponse,
	LoginRequest,
	RegisterRequest
} from '$lib/types/entities/Auth';

/**
 * AuthService for cookie-based authentication
 * Cookies are HttpOnly and managed by Spring Boot
 * No manual token storage in frontend!
 */
class AuthService extends BaseApiService {
	private static instance: AuthService;

	constructor() {
		super(API_CONFIG.BASE_URL);
	}

	static getInstance(): AuthService {
		if (!AuthService.instance) {
			AuthService.instance = new AuthService();
		}
		return AuthService.instance;
	}

	/**
	 * Login user
	 * Spring Boot sets HttpOnly cookies automatically
	 */
	/*	async login(credentials: LoginRequest): Promise<AuthUser> {
		// Cookies (access_token, refresh_token) are automatically stored by browser
		// We only get the user data in the response
		return (
			await this.post<LoginApiResponse>(API_CONFIG.ENDPOINTS.AUTH.LOGIN, credentials, {
				skipAuth: true
			})
		).user;
	}*/

	async login(credentials: LoginRequest): Promise<AuthUser> {
		console.log('[AuthService] 🔐 Logging in:', credentials.email);

		const response = await this.post<LoginApiResponse>(
			API_CONFIG.ENDPOINTS.AUTH.LOGIN,
			credentials
		);

		console.log('[AuthService] ✅ Login successful');
		return response;
	}

	/**
	 * Register new user
	 */
	async register(userData: RegisterRequest): Promise<void> {
		await this.post<RegisterRequest>(API_CONFIG.ENDPOINTS.AUTH.REGISTER, userData, {
			skipAuth: true
		});
	}

	/**
	 * Logout - clears cookies on server
	 */

	async logout(): Promise<void> {
		console.log('[AuthService] Logging out');

		try {
			await this.post(API_CONFIG.ENDPOINTS.AUTH.LOGOUT, {});
			console.log('[AuthService] Logout successful');
		} catch (error) {
			console.error('[AuthService] Logout failed:', error);
			// Don't throw - logout should always succeed locally
		}
	}

	/**
	 * Refresh token - Spring Boot reads refresh_token cookie
	 * and sets new access_token cookie
	 */
	/*
	async refreshToken(): Promise<void> {
		await this.post(API_CONFIG.ENDPOINTS.AUTH.REFRESH, {}, { skipAuth: true });
	}
*/

	async refreshToken(): Promise<void> {
		console.log('[AuthService] 🔄 Refreshing token');
		const response = await this.post(API_CONFIG.ENDPOINTS.AUTH.REFRESH, {});
		console.log('[AuthService] ✅ Token refreshed');
		return response;
	}

	/**
	 * Get current user from server
	 * Cookie is sent automatically, Spring Boot validates
	 */
	async getCurrentUser(): Promise<AuthUser> {
		console.log('[AuthService] 🚀 Getting current user');

		try {
			// Add timestamp to params to force unique URL
			const user = await this.get<AuthUser>(
				API_CONFIG.ENDPOINTS.AUTH.ME,
				{ _t: Date.now() }, // Cache-buster query param
				{ cache: false } // Disable frontend cache
			);

			console.log('[AuthService] ===== USER RESPONSE =====');
			console.log('[AuthService] Full user:', user);
			console.log('[AuthService] Email:', user?.email);
			console.log('[AuthService] FirstName:', user?.firstName);
			console.log('[AuthService] LastName:', user?.lastName);
			console.log('[AuthService] Role:', user?.role);
			console.log('[AuthService] ===========================');

			// Validate response
			if (!user) {
				console.error('[AuthService] No user data received!');
				throw new Error('No user data received from API');
			}

			if (!user.email) {
				console.error('[AuthService] User missing email field!');
				console.error('[AuthService] Received:', JSON.stringify(user, null, 2));
				throw new Error('Invalid user data: missing email');
			}

			return user;
		} catch (error) {
			console.error('[AuthService] getCurrentUser failed:', error);
			throw error;
		}
	}

	/**
	 * Check if user has valid session
	 * Calls backend to verify cookie
	 */
	async checkAuth(): Promise<boolean> {
		try {
			await this.getCurrentUser();
			return true;
		} catch {
			return false;
		}
	}

	/**
	 * Request forgot-password reset
	 */
	async forgotPassword(email: string): Promise<void> {
		await this.post(API_CONFIG.ENDPOINTS.AUTH.FORGOT_PASSWORD, { email }, { skipAuth: true });
	}

	/**
	 * Reset forgot-password with token
	 */
	async resetPassword(token: string, newPassword: string): Promise<void> {
		await this.post(
			API_CONFIG.ENDPOINTS.AUTH.RESET_PASSWORD,
			{ token, newPassword },
			{ skipAuth: true }
		);
	}
}

// Export singleton instance
//export const authService = new AuthService();

export const authService = AuthService.getInstance();