import { BaseApiService } from '$lib/API/APIBase';
import { API_CONFIG } from '$lib/API/APIConfiguration';
import type { User } from 'lucide-svelte';

export class AuthApiService extends BaseApiService {
	private readonly ENDPOINT = API_CONFIG.ENDPOINTS.AUTH.REGISTER;

	constructor() {
		super(API_CONFIG.BASE_URL);
	}

	async registerUser(user: User): Promise<User> {
		return await this.post<User>(`${this.ENDPOINT}`, user);
	}
}

export const authApiService = new AuthApiService();