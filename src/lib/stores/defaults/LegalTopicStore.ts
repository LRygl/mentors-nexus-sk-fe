import { BaseStoreSvelte } from '$lib/stores/BaseStore.svelte';
import type { LegalTopic } from '$lib/types/entities/LegalTopic';
import { legalTopicAdminAPI, type LegalTopicAdminAPI } from '$lib/API/Admin/LegalTopicAdminAPI';

export class LegalTopicStore extends BaseStoreSvelte<
	LegalTopic,
	Partial<LegalTopic>,
	Partial<LegalTopic>,
	LegalTopicAdminAPI
> {
	
	constructor() {
		super(legalTopicAdminAPI);
	}

	// ============================================================================
	// BASIC DATA FETCHING
	// ============================================================================

	async fetchAll(): Promise<LegalTopic[]>  {
		this._loading = true;

		try {
			this._data = await this.apiService.getAllLegalTopics();
			return this._data;
		} catch (error) {
			console.log(error);
			throw error;
		} finally {
			this._loading = false;
		}
	}

	async fetchItem(topicId: string): Promise<LegalTopic> {
		this._loading = true;
		this._itemError = null;

		try {
			const topic = await this.apiService.getLegalTopicById(topicId);
			this._selectedItem = topic;
			return topic;
		} catch (error) {
			this._itemError = error instanceof Error ? error.message : 'Failed to load lesson';
			console.error('[STORE] Error fetching lesson:', error);
			throw error;
		} finally {
			this._loading = false;
		}
	}

	// ============================================================================
	// BASIC CRUD - These are the low-level API calls
	// ============================================================================

	async createItem(createData: Partial<LegalTopic>): Promise<LegalTopic> {
		return await this.apiService.createLegalTopic(createData);
	}

	async updateItem(id: string, updateData: Partial<LegalTopic>): Promise<LegalTopic> {
		return await this.apiService.updateLegalTopic(id, updateData);
	}

	async deleteItem(id: string): Promise<void> {
		await this.apiService.deleteLegalTopic(id);
	}

}

export const legalTopicStore = new LegalTopicStore();