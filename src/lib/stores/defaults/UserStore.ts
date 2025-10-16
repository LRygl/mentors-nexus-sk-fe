import { BaseStoreSvelte } from '$lib/stores/BaseStore.svelte';
import type { User } from '$lib/types/entities/User';
import { userAdminApiService, type UserAdminApiService } from '$lib/API/Admin/UserAdminAPI';


export class UserStoreSvelte extends BaseStoreSvelte<
	User,
	Partial<User>,
	Partial<User>,
	UserAdminApiService> {

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


}

export const userStore = new UserStoreSvelte();