import { BaseStoreSvelte } from '$lib/stores/BaseStore.svelte';
import { faqAdminApiService, type FAQAdminApiService } from '$lib/api/admin/faqAdminApi';
import type { FAQ, FAQPaginationParams } from '$lib/types/entities/faq';
import type { PaginatedResult, PaginationParams } from '$lib/types';

export class FaqStoreSvelte extends BaseStoreSvelte<FAQ, FAQAdminApiService> {

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

	constructor() {
		super(faqAdminApiService);
	}

	protected async fetchPage(params: PaginationParams): Promise<PaginatedResult<FAQ>> {
		const faqParams: FAQPaginationParams = {
			...this._filters,
			...params
		};

		console.log('FAQ Store: Fetching with params:', faqParams);

		const result = await this.apiService.getFAQsPage(faqParams);

		// DEBUG: Log the actual response structure
		console.log('FAQ Store: API Response:', {
			contentLength: result.content.length,
			number: result.number,
			page: result.page,
			totalPages: result.totalPages,
			totalElements: result.totalElements,
			size: result.size,
			first: result.first,
			last: result.last
		});

		return result;
	}

	// FAQ-specific methods
	async loadFAQs(): Promise<void> {
		await this.loadPage(this._filters.page, this._filters.size);
	}

	// Refresh current data
	async refresh(): Promise<void> {
		await this.loadPage(this._filters.page, this._filters.size);
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

			console.log('FAQ Store: Successfully published FAQ:', updatedFAQ);

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



}

export const faqStore = new FaqStoreSvelte();