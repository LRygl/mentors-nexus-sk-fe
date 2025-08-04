import type { BaseEntity, PaginatedResult, PaginationParams } from '$lib/types/common';
import type { BaseApiService } from '$lib/api/baseApi';
import { untrack } from 'svelte';

export abstract class BaseStoreSvelte<
	TEntity extends BaseEntity = BaseEntity,
	TApiService extends BaseApiService = BaseApiService
> {
	// Collection state
	protected _data = $state<TEntity[]>([]);
	protected _loading = $state(false);
	protected _error = $state<string | null>(null);

	// Single Item state
	protected _selectedItem = $state<TEntity | null>(null);
	protected _loadingItem = $state(false);
	protected _itemError = $state<string | null>(null);

	// Pagination State
	protected _currentPage = $state(0);
	protected _pageSize = $state(20);
	protected _totalElements = $state(0);
	protected _totalPages = $state(0);

	// API Service
	protected apiService: TApiService;

	constructor(apiService: TApiService) {
		this.apiService = apiService;
	}

	// Collection getters
	get data(): TEntity[] {
		return this._data;
	}

	get loading(): boolean {
		return this._loading;
	}

	get error(): string | null {
		return this._error;
	}

	get isEmpty(): boolean {
		return this._data.length === 0 && !this._loading;
	}

	// Single item getters
	get selectedItem(): TEntity | null {
		return this._selectedItem;
	}

	get loadingItem(): boolean {
		return this._loadingItem;
	}

	get itemError(): string | null {
		return this._itemError;
	}

	get hasSelectedItem(): boolean {
		return this._selectedItem === null;
	}

	// Pagination getters
	get currentPage(): number {
		return this._currentPage;
	}

	get pageSize(): number {
		return this._pageSize;
	}

	get totalElements(): number {
		return this._totalElements;
	}

	get totalPages(): number {
		return this._totalPages;
	}

	get hasNextPage(): boolean {
		return this._currentPage < this._totalElements - 1;
	}

	get hasPreviousPage(): boolean {
		return this._currentPage > 0;
	}

	// Collection methods - load paginated data
	async loadPage(page: number = 0, size: number = 20): Promise<void> {
		if (this._loading) return;

		this._loading = true;
		this._error = null;

		try {
			const params: PaginationParams = { page, size };
			const result = await this.fetchPage(params);

			this._data = result.content;
			this._currentPage = result.page;
			this._pageSize = result.size;
			this._totalElements = result.totalElements;
			this._totalPages = result.totalPages;
		} catch (error) {
			this._error = error instanceof Error ? error.message : 'Failed to load data';
			console.error('Error loading page:', error);
		} finally {
			this._loading = false;
		}
	}

	// Single item methods - lload individual item
	async loadItem(id: string): Promise<TEntity | null> {
		if (this._loading) return null;

		this._loadingItem = true;
		this._itemError = null;

		try {
			const item = await this.fetchItem(id);
			this._selectedItem = item;
			return item;
		} catch (error) {
			this._itemError = error instanceof Error ? error.message : 'Failed to load item';
			console.error('Error loading item:', error);
			return null;
		} finally {
			this._loadingItem = false;
		}
	}

	// Select item from current collection
	selectItem(item: TEntity | null): void {
		this._selectedItem = item;
		this._itemError = null; // Clear any previous item errors
	}

	selectItemById(id: string): TEntity | null {
		const item = this.getItemById(id);
		if(item) {
			this.selectItem(item);
			return item;
		}
		return null;
	}

	// Clear selected item
	clearSelection(): void {
		this._selectedItem = null;
		this._itemError = null;
	}

	// Pagination nav methods
	async nextPage(): Promise<void> {
		if (this.hasNextPage) {
			await this.loadPage(this._currentPage + 1, this._pageSize);
		}
	}

	async previousPage(): Promise<void> {
		if (this.hasPreviousPage) {
			await this.loadPage(this._currentPage - 1, this._pageSize);
		}
	}

	async gotoPage(page: number): Promise<void> {
		if (page >= 0 && page < this._totalPages) {
			await this.loadPage(page, this._pageSize);
		}
	}

	async changePageSize(size: number): Promise<void> {
		await this.loadPage(0, size);
	}

	//Utility methods
	getItemById(id: string): TEntity | undefined {
		return this._data.find((item: TEntity) => item.id === id);
	}

	async refresh(): Promise<void> {
		await this.loadPage(this._currentPage, this._pageSize);
	}

	// Reset collection state
	clearCollection(): void {
		untrack(() => {
			this._data = [];
			this._loading = false;
			this._error = null;
			this._currentPage = 0;
			this._pageSize = 20;
			this._totalElements = 0;
			this._totalPages = 0;
		});
	}

 // Reset item state
	clearItemState(): void {
		untrack(() => {
			this._selectedItem = null;
			this._loadingItem = false;
			this._itemError = null;
		});
	}

	// Reset everything
	clear(): void {
		this.clearCollection();
		this.clearItemState();
	}

	// Abstract methods - to be implemented in any given store
	protected abstract fetchPage(params: PaginationParams): Promise<PaginatedResult<TEntity>>;
	protected abstract fetchItem(id: string): Promise<TEntity>;
}