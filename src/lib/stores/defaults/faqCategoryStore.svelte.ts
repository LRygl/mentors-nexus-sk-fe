// src/lib/stores/defaults/faqCategoryStore.svelte.ts
import { BaseStoreSvelte } from '$lib/stores/BaseStore.svelte';
import type {
	CreateFAQCategoryRequest,
	FAQCategory,
	FAQCategoryPaginationParams,
	UpdateFAQCategoryRequest
} from '$lib/types/entities/faqCategory';
import { faqCategoryAdminApiService, type FAQCategoryAdminApiService } from '$lib/api/admin/faqCategoryAdminApiService';
import type { PaginatedResult, PaginationParams } from '$lib/types';

export class FAQCategoryStore extends BaseStoreSvelte<
	FAQCategory,
	CreateFAQCategoryRequest,
	UpdateFAQCategoryRequest,
	FAQCategoryAdminApiService> {

	private _filters = $state<FAQCategoryPaginationParams>({
		page: 0,
		size: 20,
		search: ''
	});

	constructor() {
		super(faqCategoryAdminApiService);
	}

	// Implement required abstract methods
	protected async fetchPage(params: PaginationParams): Promise<PaginatedResult<FAQCategory>> {
		const faqCategoryParams: FAQCategoryPaginationParams = {
			...this._filters,
			...params
		};

		return await this.apiService.getFAQCategoryPage(faqCategoryParams);
	}

	//TODO Check local storage first before querying api
	async fetchItem(id: string): Promise<FAQCategory> {
		console.log("Getting FAQ category");
		return await this.apiService.getFAQCategoryById(id);
	}

	async createItem(createRequest: CreateFAQCategoryRequest): Promise<FAQCategory> {
		return await this.apiService.createFAQCategory(createRequest);
	}

	protected async updateItem(id: string, updateRequest: UpdateFAQCategoryRequest): Promise<FAQCategory> {
		return await this.apiService.updateFAQCategory(id, updateRequest);
	}

	protected async deleteItem(id: string): Promise<void> {
		return await this.apiService.deleteFAQCategory(id);
	}

	// Convenience methods
	async loadFAQCategories(): Promise<void> {
		await this.loadPage(this._filters.page, this._filters.size);
	}

	// Search functionality
	async search(searchTerm: string): Promise<void> {
		this._filters.search = searchTerm;
		this._filters.page = 0; // Reset to first page
		await this.loadPage(0, this._filters.size);
	}

	// Filter management
	get filters(): FAQCategoryPaginationParams {
		return this._filters;
	}

	updateFilters(newFilters: Partial<FAQCategoryPaginationParams>): void {
		this._filters = { ...this._filters, ...newFilters };
	}

	async applyFilters(): Promise<void> {
		await this.loadPage(this._filters.page, this._filters.size);
	}

	// Override refresh to use current filters
	async refresh(): Promise<void> {
		await this.loadPage(this._currentPage, this._pageSize);
	}

	// Table-specific helpers that work with your Universal Table
	get isLoadingData(): boolean {
		return this.loading;
	}

	get hasError(): boolean {
		return this.error !== null;
	}

	get isEmpty(): boolean {
		return this.data.length === 0 && !this.loading;
	}

	// Method to get all data without pagination (for simple tables)
	async loadAllData(): Promise<void> {
		await this.loadPage(0, 1000); // Load a large page size to get all data
	}
}

export const faqCategoryStore = new FAQCategoryStore();