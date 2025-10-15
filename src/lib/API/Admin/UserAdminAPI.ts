import { BaseApiService } from '$lib/API/APIBase';
import { API_CONFIG } from '$lib/API/APIConfiguration';
import type { User } from '$lib/types/entities/User';

export class UserAdminApiService extends BaseApiService {
	private readonly ENDPOINT = API_CONFIG.ENDPOINTS.ADMIN.USERS;

	constructor() {
		super(API_CONFIG.BASE_URL);
	}

	async getAllUsers(): Promise<User[]> {
		try {
			return await this.get<User[]>(this.ENDPOINT);
		} catch (error) {
			throw error;
		}
	}

}

export const userAdminApiService = new UserAdminApiService;