import { BaseStoreSvelte } from '$lib/stores/BaseStore.svelte';
import type {
	CreateFAQCategoryRequest,
	FAQCategory,
	FAQCategoryPaginationParams,
	UpdateFAQCategoryRequest
} from '$lib/types/entities/faqCategory';
import {
	faqCategoryAdminApiService,
	type FAQCategoryAdminApiService
} from '$lib/api/admin/faqCategoryAdminApiService';
import type { PaginatedResult, PaginationParams } from '$lib/types';



export class FaqCategoryStoreSvelte extends BaseStoreSvelte<
	FAQCategory,
	CreateFAQCategoryRequest,
	UpdateFAQCategoryRequest,
	FAQCategoryAdminApiService> {

	private _filters = $state<FAQCategoryPaginationParams>({
		page: 0,
		size: 20,
		search: ''
	})

	constructor() {
		super(faqCategoryAdminApiService);
	}

	protected async fetchPage(params: PaginationParams): Promise<PaginatedResult<FAQCategory>> {
		const faqCategoryParams: FAQCategoryPaginationParams = {
			...this._filters,
			...params
		};

		const result = await this.apiService.getFAQCategoryPage(faqCategoryParams);
		return result;

	}

	async loadFAQCategories(): Promise<void> {
		await this.loadPage(this._filters.page, this._filters.size);
	}


	async createItem(createRequest: CreateFAQCategoryRequest): Promise<FAQCategory> {
		return await this.apiService.createFAQCategory(createRequest);
	}


}

export const faqCategoryStore = new FaqCategoryStoreSvelte();