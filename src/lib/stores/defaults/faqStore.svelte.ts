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

}

export const faqStore = new FaqStoreSvelte();