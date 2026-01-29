console.log('Loading AuthService');
import { ApiError, BaseApiService } from '$lib/API/APIBase';
import { API_CONFIG } from '$lib/API/APIConfiguration';
import type { AuthUser, LoginApiResponse, LoginRequest, RegisterRequest } from '$lib/types/entities/Auth';


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

	async login(credentials: LoginRequest): Promise<LoginApiResponse> {
		console.log('[AuthService] 🔐 Logging in:', credentials.email);

		try {
			const response = await this.post<LoginApiResponse>(
				API_CONFIG.ENDPOINTS.AUTH.LOGIN,
				credentials
			);

			console.log('[AuthService] ===== LOGIN API RESPONSE =====');
			console.log('[AuthService] Full response:', response);
			console.log('[AuthService] User:', response.user);
			console.log('[AuthService] ExpiresIn:', response.expiresIn);
			console.log('[AuthService] ===================================');

			if (!response.user || !response.user.email) {
				throw new Error('Invalid login response');
			}

			console.log('[AuthService] ✅ Login successful:', response.user.email);
			return response;
		} catch (error) {
			console.error('[AuthService] ❌ Login failed:', error);
			throw error;
		}
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
			if (error instanceof ApiError && error.status === 403) {
				// 403 Unauthenticated is expected if user logs out from protected section
				console.log('[AuthService] Logout completed with 403 (expected):');
				return;
			}
			// Don't throw - logout should always succeed locally
			console.error('[AuthService] Logout failed:', error);
		}
	}

	/**
	 * Refresh token - Spring Boot reads refresh_token cookie
	 * and sets new access_token cookie
	 */
	/*	async refreshToken(): Promise<void> {
		await this.post(API_CONFIG.ENDPOINTS.AUTH.REFRESH, {}, { skipAuth: true });
	}*/

	async refreshToken(): Promise<void> {
		console.log('[AuthService] 🔄 Refreshing token');
		await this.post(API_CONFIG.ENDPOINTS.AUTH.REFRESH, {});
		console.log('[AuthService] ✅ Token refreshed');
	}

	/**
	 * Get current user from server
	 * Cookie is sent automatically, Spring Boot validates
	 */
	async getCurrentUser(): Promise<AuthUser> {
		console.log('[AuthService] 🚀 Getting current user');

		try {
			const user = await this.get<AuthUser>(
				API_CONFIG.ENDPOINTS.AUTH.ME,
				{ _t: Date.now() },
				{ cache: false }
			);

			if (!user || !user.email) {
				throw new Error('Invalid user data');
			}

			return user;
		} catch (error) {
			// 401 is expected when not logged in - don't log as error
			if (error instanceof ApiError && (error.status === 401 || error.status === 403)) {
				console.log('[AuthService] 💁 No active session');
				throw error;
			}

			console.error('[AuthService] ❌ Unexpected error:', error);
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
export const authService = new AuthService();