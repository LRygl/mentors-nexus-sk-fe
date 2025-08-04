import { BaseStoreSvelte } from '$lib/stores/BaseStore.svelte';
import { faqAdminApiService, type FAQAdminApiService } from '$lib/api/admin/faqAdminApi';
import type { FAQPaginationParams } from '$lib/types/entities/faq';
import type { PaginatedResult, PaginationParams, FAQPriority, FAQStatus } from '$lib/types';

export class FaqStoreSvelte extends BaseStoreSvelte<FAQ, FAQAdminApiService> {

	private _filters = $state<FAQPaginationParams>({
		page: 0,
		size: 20,
		status: undefined,
		categoryUuid: undefined,
		priority: undefined,
		search: ''
	});

	constructor() {
		super(faqAdminApiService);
	}

	protected async fetchPage(params: PaginationParams): Promise<PaginatedResult<FAQ>> {

		const faqParams: FAQPaginationParams = {
			...this._filters,
			...params
		};

		return await this.apiService.getFAQsPage(faqParams);

	}

	// FAQ-specific methods
	async loadFAQs(): Promise<void> {
		await this.loadPage(this._filters.page, this._filters.size);
	}

	async setSearch(search: string): Promise<void> {
		await this.setFilters({ search: search.trim(), page: 0 });
	}

	async setStatus(status: FAQStatus | undefined): Promise<void> {
		// In public mode, don't allow changing status from PUBLISHED
		if (!this._adminMode && status !== FAQStatus.PUBLISHED) {
			console.warn('Cannot change status in public mode');
			return;
		}
		await this.setFilters({ status, page: 0 });
	}

	async setPriority(priority: FAQPriority | undefined): Promise<void> {
		await this.setFilters({ priority, page: 0 });
	}

	async setCategoryUuid(categoryUuid: string | undefined): Promise<void> {
		await this.setFilters({ categoryUuid, page: 0 });
	}

	async clearSearch(): Promise<void> {
		await this.setFilters({ search: '', page: 0 });
	}

	async setFilters(newFilters: Partial<FAQPaginationParams>): Promise<void> {
		// Reset to first page when changing filters (except for page changes)
		if (!('page' in newFilters)) {
			newFilters.page = 0;
		}

		this._filters = { ...this._filters, ...newFilters };
		await this.loadFAQs();
	}

	async resetFilters(): Promise<void> {
		this._filters = {
			page: 0,
			size: 20,
			status: this._adminMode ? undefined : FAQStatus.PUBLISHED,
			categoryUuid: undefined,
			priority: undefined,
			search: ''
		};
		await this.loadFAQs();
	}

}

export const faqStore = new FaqStoreSvelte();