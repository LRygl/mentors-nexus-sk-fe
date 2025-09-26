import { BaseStoreSvelte } from '$lib/stores/BaseStore.svelte';
import { faqAdminApiService, type FAQAdminApiService } from '$lib/api/admin/faqAdminApi';
import type {	FAQ,FAQPaginationParams } from '$lib/types/entities/faq';
import type { PaginatedResult, PaginationParams } from '$lib/types';

export class FaqStoreSvelte extends BaseStoreSvelte<
	FAQ,
	Partial<FAQ>,
	Partial<FAQ>,
	FAQAdminApiService> {

	private _filters = $state<FAQPaginationParams>({
		page: 0,
		size: 20,
		status: undefined,
		categoryUuid: undefined,
		priority: undefined,
		search: ''
	});

	// Loading states for specific actions
	private _actionLoading = $state<Record<string, boolean>>({});
	// Error state for specific operations
	private _actionErrors = $state<Record<string, string>>({});

	// State for all FAQs (non-paginated)
	private _allFaqs = $state<FAQ[]>([]);
	private _allFaqsLoaded = $state<boolean>(false);

	constructor() {
		super(faqAdminApiService);
	}

	/**
	 * Fetch all FAQs without pagination
	 * This is what is used to populate lists
	 */
	async fetchAll(): Promise<FAQ[]> {
		this._loading = true;

		try {
			this._data = await this.apiService.getAll()
			return this._data;
		} catch (error) {
			console.error('FAQ Store: Error fetching all FAQs:', error);
			throw error;
		} finally {
			this._loading = false;
		}
	}

	/**
	 * Get all FAQs (from cache if available, otherwise fetch)
	 */
	async getAllFAQs(forceRefresh = false): Promise<FAQ[]> {
		if (!this._allFaqsLoaded || forceRefresh) {
			return await this.fetchAll();
		}
		return this._allFaqs;
	}

	protected async fetchPage(params: PaginationParams): Promise<PaginatedResult<FAQ>> {
		const faqParams: FAQPaginationParams = {
			...this._filters,
			...params
		};
		const result = await this.apiService.getFAQsPage(faqParams);
		return result;
	}

	// Refresh current data
	async refresh(): Promise<void> {
		await this.loadPage(this._filters.page, this._filters.size);
	}


	async fetchItem(id: string): Promise<FAQ> {
		return await this.apiService.getFAQById(id);
	}

	async createItem(createRequest: Partial<FAQ>): Promise<FAQ> {
		return await this.apiService.createFAQ(createRequest);
	}

	protected async updateItem(id: string, updateRequest: Partial<FAQ>): Promise<FAQ> {
		return await this.apiService.updateFAQ(id, updateRequest);
	}

	protected async deleteItem(id: string): Promise<void> {
		return await this.apiService.deleteFAQ(id);
	}

	// Publish FAQ
	async publishFAQ(uuid: string): Promise<FAQ> {
		// Set Loading state
		this._actionLoading[uuid] = true;
		delete this._actionErrors[uuid];

		try {
			console.log('FAQ Store: Publishing FAQ with UUID:', uuid);
			const updatedFAQ = await this.apiService.publishFAQ(uuid);

			// Update local data if the item exists in the current page
			const index = this._data.findIndex(item => item.uuid === uuid);
			if (index !== -1) {
				this._data = [
					...this._data.slice(0, index),
					updatedFAQ,
					...this._data.slice(index + 1)
				];
			}

			// If this is the selected item, update it as well
			if (this._selectedItem?.uuid === uuid) {
				this._selectedItem = updatedFAQ;
			}
			return updatedFAQ;
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : 'Failed to publish FAQ';
			console.error('FAQ Store: Error publishing FAQ:', error);
			throw error;
		} finally {
			// Clear loading state
			delete this._actionLoading[uuid];
		}
	}

	// Un-Publish FAQ
	async unpublishFAQ(uuid: string): Promise<FAQ> {
		// Set Loading state
		this._actionLoading[uuid] = true;
		delete this._actionErrors[uuid];

		try {
			console.log('FAQ Store: Publishing FAQ with UUID:', uuid);
			const updatedFAQ = await this.apiService.unpublishFAQ(uuid);

			// Update local data if the item exists in the current page
			const index = this._data.findIndex(item => item.uuid === uuid);
			if (index !== -1) {
				this._data = [
					...this._data.slice(0, index),
					updatedFAQ,
					...this._data.slice(index + 1)
				];
			}

			// If this is the selected item, update it as well
			if (this._selectedItem?.uuid === uuid) {
				this._selectedItem = updatedFAQ;
			}

			console.log('FAQ Store: Successfully unpublished FAQ:', updatedFAQ);

			return updatedFAQ;
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : 'Failed to publish FAQ';
			console.error('FAQ Store: Error publishing FAQ:', error);
			throw error;
		} finally {
			// Clear loading state
			delete this._actionLoading[uuid];
		}
	}

	// UTILITY METHODS USED BY THE STORE

	/**
	 * Get available FAQs for linking to a category
	 * Excludes FAQs already linked to the specified category
	 */
	async getAvailableFAQsForCategory(categoryId: string, linkedFAQUuids: string[] = []): Promise<FAQ[]> {
		const allFaqs = await this.getAllFAQs();
		const linkedSet = new Set(linkedFAQUuids);
		return allFaqs.filter(faq => !linkedSet.has(faq.uuid))
	}

}

export const faqStore = new FaqStoreSvelte();