import { BaseStoreSvelte } from '$lib/stores/BaseStore.svelte';
import type { User } from '$lib/types/entities/User';
import { userAdminApiService, type UserAdminApiService } from '$lib/API/Admin/UserAdminAPI';
import type { LegalTopic } from '$lib/types/entities/LegalTopic';
import { authApiService } from '$lib/API/Admin/AuthAdminAPI';


export class UserStoreSvelte extends BaseStoreSvelte<
	User,
	Partial<User>,
	Partial<User>,
	UserAdminApiService
> {
	constructor() {
		super(userAdminApiService);
	}

	async fetchAll(): Promise<User[]> {
		this._loading = true;

		try {
			this._data = await this.apiService.getAllUsers();
			return this._data;
		} catch (error) {
			console.error('[STORE] Error fetching all Users:', error);
			throw error;
		} finally {
			this._loading = false;
		}
	}

	async fetchItem(userId: string): Promise<User> {
		this._loadingItem = true;
		this._itemError = null;

		try {
			const topic = await this.apiService.getUserById(userId);
			this._selectedItem = topic;
			return topic;
		} catch (error) {
			this._itemError = error instanceof Error ? error.message : 'Failed to load legal topic';
			console.error('[STORE] Error fetching legal topic:', error);
			throw error;
		} finally {
			this._loadingItem = false;
		}
	}

	// ============================================================================
	// BASIC CRUD - These are the low-level API calls
	// ============================================================================

	async createItem(userData: Partial<User>): Promise<User> {
		const response = await authApiService.registerUser(userData);
		return response.user;
	}

	async updateItem(id: string, updateData: Partial<User>): Promise<User> {
		return await this.apiService.updateUser(id, updateData);
	}
}

export const userStore = new UserStoreSvelte();