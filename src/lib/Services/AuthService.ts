console.log('Loading AuthService');
import { BaseApiService } from '$lib/API/APIBase';
import { API_CONFIG } from '$lib/API/APIConfiguration';
import type { AuthUser, LoginApiResponse, LoginRequest, RegisterRequest } from '$lib/types/entities/Auth';


/**
 * AuthService for cookie-based authentication
 * Cookies are HttpOnly and managed by Spring Boot
 * No manual token storage in frontend!
 */
class AuthService extends BaseApiService {
	constructor() {
		super(API_CONFIG.BASE_URL);
	}

	/**
	 * Login user
	 * Spring Boot sets HttpOnly cookies automatically
	 */
	async login(credentials: LoginRequest): Promise<AuthUser> {
		// Cookies (access_token, refresh_token) are automatically stored by browser
		// We only get the user data in the response
		return (
			await this.post<LoginApiResponse>(API_CONFIG.ENDPOINTS.AUTH.LOGIN, credentials, {
				skipAuth: true
			})
		).user;
	}

	/**
	 * Register new user
	 */
	async register(userData: RegisterRequest): Promise<void> {
		await this.post<RegisterRequest>(
			API_CONFIG.ENDPOINTS.AUTH.REGISTER,
			userData,
			{ skipAuth: true }
		);

	}

	/**
	 * Logout - clears cookies on server
	 */
	async logout(): Promise<void> {
		try {
			console.log("Logout request")
			await this.post(API_CONFIG.ENDPOINTS.AUTH.LOGOUT, {});
			// Spring Boot deletes the cookies
		} catch (error) {
			console.error('Logout error:', error);
		}
	}

	/**
	 * Refresh token - Spring Boot reads refresh_token cookie
	 * and sets new access_token cookie
	 */
	async refreshToken(): Promise<void> {
		await this.post(
			API_CONFIG.ENDPOINTS.AUTH.REFRESH,
			{},
			{ skipAuth: true }
		);
	}

	/**
	 * Get current user from server
	 * Cookie is sent automatically, Spring Boot validates
	 */
	async getCurrentUser(): Promise<AuthUser> {
		return await this.get<AuthUser>(API_CONFIG.ENDPOINTS.AUTH.ME);
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
		await this.post(
			API_CONFIG.ENDPOINTS.AUTH.FORGOT_PASSWORD,
			{ email },
			{ skipAuth: true }
		);
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