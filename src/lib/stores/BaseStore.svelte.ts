import type { BaseEntity, PaginatedResult, PaginationParams } from '$lib/types/common';
import type { BaseApiService } from '$lib/api/baseApi';
import { untrack } from 'svelte';

export abstract class BaseStoreSvelte<
	TEntity extends BaseEntity = BaseEntity,
	TCreateRequest = Partial<TEntity>,
	TUpdateRequest = Partial<TEntity>,
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

	// CRUD Operation States
	protected _creating = $state(false);
	protected _createError = $state<string | null>(null);
	protected _updating = $state(false);
	protected _updateError = $state<string | null>(null);
	protected _deleting = $state(false);
	protected _deleteError = $state<string | null>(null);

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
		return this._selectedItem != null;
	}

	// CRUD operation getters
	get creating(): boolean {
		return this._creating;
	}

	get createError(): string | null {
		return this._createError;
	}

	get updating(): boolean {
		return this._updating;
	}

	get updateError(): string | null {
		return this._updateError;
	}

	get deleting(): boolean {
		return this._deleting;
	}

	get deleteError(): string | null {
		return this._deleteError;
	}

	// Check if any operation is in progress
	get isOperating(): boolean {
		return this._creating || this._updating || this._deleting || this._loading || this._loadingItem;
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
			this._currentPage = result.number;
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

	// CREATE Operation
	async create(createRequest: TCreateRequest): Promise<TEntity | null> {
		if (this._creating) return null;

		this._creating = true;
		this._createError = null;

		try {
			const newItem = await this.createItem(createRequest);
			this._data = [newItem, ...this._data];

			this._totalElements += 1;
			this._selectedItem = newItem;
			return newItem;

		} catch (error) {
			this._createError = error instanceof Error ? error.message : 'Failed to create item';
			console.error('Error loading create item:', error);
			return null;
		} finally {
			this._creating = false;
		}
	}

	// UPDATE OPERATION
	async update(id: string, updateRequest: TUpdateRequest): Promise<TEntity | null> {
		if (this._updating) return null;

		this._updating = true;
		this._updateError = null;

		try {
			const updatedItem = await this.updateItem(id, updateRequest);

			// Update the item in the data array
			const index = this._data.findIndex(item => item.id === id);
			if (index != -1) {
				this._data[index] = updatedItem;
				this._data = [...this._data]; // Trigger reactivity
			}

			// Update selected item if its the same
			if (this._selectedItem?.id === id) {
				this._selectedItem = updatedItem;
			}

			return updatedItem;
		} catch (error) {
			this._updateError = error instanceof Error ? error.message : 'Failed to update item';
			console.error('Error loading update item:', error);
			return null;
		} finally {
			this._updating = false;
		}
	}

	async delete(id: string): Promise<boolean> {
		if (this._deleting) return false;

		this._deleting = true;
		this._deleteError = null;

		try {
			await this.deleteItem(id);

			// Remove from data array
			this._data = this._data.filter(item => item.id != id);

			// Update total count
			this._totalElements = Math.max(0, this._totalElements - 1);

			// Clear selection if it was the deleted item
			if (this._selectedItem?.id === id) {
				this._selectedItem = null;
			}
			return true;
		} catch (error) {
			this._deleteError = error instanceof Error ? error.message : 'Failed to delete item';
			console.error('Error loading delete item:', error);
			return false;
		} finally {
			this._deleting = false;
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

	getItemByUuid(uuid: string): TEntity | undefined {
		return this._data.find((item: TEntity) => (item as any).uuid === uuid);
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

	// Reset CRUD Operation states
	clearOperationStates(): void {
		untrack(() => {
			this._creating = false;
			this._createError = null;
			this._updating = false;
			this._updateError = null;
			this._deleting = false;
			this._deleteError = null;
		})
	}

	// Reset everything
	clear(): void {
		this.clearCollection();
		this.clearItemState();
		this.clearOperationStates();
	}

	// Clear Errors
	clearErrors(): void {
		this._error = null;
		this._itemError = null;
		this._createError = null;
		this._updateError = null;
		this._deleteError = null;
	}

	// Abstract methods - to be implemented in any given store
	protected abstract fetchPage(params: PaginationParams): Promise<PaginatedResult<TEntity>>;
	protected abstract fetchItem(id: string): Promise<TEntity>;
	protected abstract createItem(createRequest: TCreateRequest): Promise<TEntity>;
	protected abstract updateItem(id: string, updateRequest: TUpdateRequest): Promise<TEntity>;
	protected abstract deleteItem(id: string): Promise<void>;
}