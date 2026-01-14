// src/lib/stores/defaults/faqCategoryStore.svelte.ts
import { BaseStoreSvelte } from '$lib/stores/BaseStore.svelte';
import type {
	CreateFAQCategoryRequest,
	FAQCategory,
	FAQCategoryPaginationParams,
	UpdateFAQCategoryRequest
} from '$lib/types/entities/faqCategory';
import { faqCategoryAdminApiService, type FAQCategoryAdminAPI } from '$lib/API/Admin/FAQCategoryAdminAPI';
import type { FAQ, PaginatedResult, PaginationParams } from '$lib/types';
import { faqAdminApiService, type FAQAdminApiService } from '$lib/API/Admin/FAQAdminAPI';

export class FAQCategoryStore extends BaseStoreSvelte<
	FAQCategory,
	CreateFAQCategoryRequest,
	UpdateFAQCategoryRequest,
	FAQCategoryAdminAPI>{

	private rollbackStates = new Map<string, FAQCategory>();
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

	//TODO Check local storage first before querying API
	async fetchItem(id: string): Promise<FAQCategory> {
		this._loading = true;
		this._error = null;

		try {
			const category = await this.apiService.getFAQCategoryById(id);
			console.log('✅ Fetched category:', category.name, 'FAQs:', category.faqs?.length || 0);
			this.updateItemInStore(id, category);
			return category;
		} catch (error) {
			this._error = error instanceof Error ? error.message : 'Failed to fetch category';
			console.error('FAQ Category Store: Error fetching item:', error);
			throw error;
		} finally {
			this._loading = false;
		}
	}

	async createItem(createRequest: CreateFAQCategoryRequest): Promise<FAQCategory> {
		return await this.apiService.createFAQCategory(createRequest);
	}

	async deleteItem(id: string): Promise<void> {
		return await  this.apiService.deleteFAQCategory(id);
	}


	/**
	 * Optimistically link FAQ to category with rollback capability
	 * @param faqUuid - The FAQ UUID to link
	 * @param categoryUuid - The category UUID to link to
	 */

	// TODO Remove the optimistic update as it is now handled by the BaseStore
	async linkFAQToFAQCategory(faqUuid: string, categoryUuid: string): Promise<FAQ> {
		const category = this._data.find(c => c.uuid === categoryUuid);

		if (!category) {
			throw new Error("Category not found");
		}

		if (category.faqs && category.faqs.some(f => f.uuid === faqUuid)) {
			throw new Error('FAQ is already linked to this category');
		}

		return await this.optimisticUpdate(
			category.id,
			(cat) => ({
				...cat,
				faqs: [...(cat.faqs || [])],
				faqCount: (cat.faqCount || 0) + 1
			}),
			async () => {
				const linkedFAQ = await faqAdminApiService.linkFAQToCategory(faqUuid, categoryUuid);

				// Update with actual data from API
				const updatedCategory: FAQCategory = {
					...category,
					faqs: [...(category.faqs || []), linkedFAQ],
					faqCount: (category.faqCount || 0) + 1,
					publishedFaqCount: linkedFAQ.isPublished
						? (category.publishedFaqCount || 0) + 1
						: category.publishedFaqCount
				};
				this.updateItemInStore(category.id, updatedCategory);

				return linkedFAQ;
			}
		);
	}

	/**
	 * Unlink FAQ from category with optimistic update
	 */
	async unlinkFAQFromFAQCategory(categoryId: string, faqUuid: string): Promise<FAQ> {
		const category = this._data.find(c => c.id === categoryId);

		if (!category || !category.faqs) {
			throw new Error('Category or FAQs not found');
		}

		const faqToRemove = category.faqs.find(f => f.uuid === faqUuid);
		if (!faqToRemove) {
			throw new Error('FAQ not found in category');
		}

		return await this.optimisticUpdate(
			categoryId,
			(cat) => ({
				...cat,
				faqs: cat.faqs!.filter(f => f.uuid !== faqUuid),
				faqCount: Math.max(0, (cat.faqCount || 0) - 1),
				publishedFaqCount: faqToRemove.isPublished
					? Math.max(0, (cat.publishedFaqCount || 0) - 1)
					: cat.publishedFaqCount
			}),
			async () => {
				return await faqAdminApiService.unlinkFAQFromCategory(faqUuid);
			}
		);
	}

	/**
	 * Update a specific item in the store data, or add it if it doesn't exist
	 * This method maintains consistency with the BaseStoreSvelte patterns
	 * @param itemId - The ID of the item to update
	 * @param updatedItem - The updated item data
	 */
	updateItemInStore(itemId: string, updatedItem: FAQCategory): void {
		const index = this._data.findIndex(item => item.id === itemId);

		if (index !== -1) {
			// Update existing item
			this._data[index] = updatedItem;
		} else {
			// Add new item if not found
			this._data.push(updatedItem);
		}

		// Trigger reactivity by creating a new array reference (same pattern as BaseStoreSvelte)
		this._data = [...this._data];

		// If this item is currently selected, update it too
		if (this._selectedItem?.id === itemId) {
			this._selectedItem = updatedItem;
		}

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