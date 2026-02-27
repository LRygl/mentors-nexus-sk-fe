/**
 * UserPublicAPI.ts
 *
 * Public (authenticated-user) API for profile operations.
 *
 * ── Spring Boot backend endpoints to implement ────────────────────────────────
 *
 *  1. GET  /api/v1/user/me
 *       Returns the full User object for the currently authenticated user.
 *       The User DTO must include the billing fields:
 *         billingFirstName, billingLastName, billingStreet,
 *         billingCity, billingPostalCode, billingCountry
 *
 *  2. PUT  /api/v1/user/profile
 *       Accepts a partial UserProfileUpdateRequest DTO (see User.ts).
 *       Updates personal info, billing address, and/or consent flags.
 *       Returns the full updated User object so the auth store can be refreshed.
 *       Required Spring Boot changes:
 *         - Add nullable @Column fields to the User entity for billing address
 *         - Create a UserProfileUpdateRequest record/DTO
 *         - Map and persist the fields
 *
 *  3. POST /api/v1/user/change-password
 *       Accepts { currentPassword, newPassword }.
 *       Validates the current password before updating.
 *       Returns 200 OK on success, 400 / 422 on failure.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { BaseApiService } from '$lib/API/APIBase';
import { API_CONFIG } from '$lib/API/APIConfiguration';
import type { PasswordChangeRequest, User, UserProfileUpdateRequest } from '$lib/types/entities/User';

export class UserPublicAPI extends BaseApiService {
	private readonly ENDPOINT = API_CONFIG.ENDPOINTS.USER;

	constructor() {
		super(API_CONFIG.BASE_URL);
	}

	/**
	 * Fetch the current user's full profile (including billing fields).
	 * Backend: GET /api/v1/user/me
	 */
	async getMyProfile(): Promise<User> {
		return this.get<User>(`${this.ENDPOINT}/me`);
	}

	/**
	 * Update personal info, billing address, or consent flags.
	 * Send only the fields you want to update – backend should apply a partial update.
	 * Backend: PUT /api/v1/user/profile
	 */
	async updateProfile(data: UserProfileUpdateRequest): Promise<User> {
		return this.put<User>(`${this.ENDPOINT}/profile`, data);
	}

	/**
	 * Change the authenticated user's password.
	 * Backend: POST /api/v1/user/change-password
	 */
	async changePassword(request: PasswordChangeRequest): Promise<void> {
		return this.post<void>(`${this.ENDPOINT}/change-password`, request);
	}
}

export const userPublicAPI = new UserPublicAPI();
