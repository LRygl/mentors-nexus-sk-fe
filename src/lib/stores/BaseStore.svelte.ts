import type { BaseEntity, PaginatedResult, PaginationParams } from '$lib/types/common';
import type { BaseApiService } from '$lib/API/APIBase';
import { untrack } from 'svelte';


/**
 * Base Store for Svelte 5 that integrates with BaseApiService
 * Provides reactive state management for CRUD operations
 *
 * Type Parameters:
 * @template TEntity - The entity type (must extend BaseEntity)
 * @template TCreateRequest - Request type for creating entities (defaults to Partial<TEntity>)
 * @template TUpdateRequest - Request type for updating entities (defaults to Partial<TEntity>)
 * @template TApiService - The API service type (must extend BaseApiService)
 *
 * Usage:
 * ```typescript
 * class UserStore extends BaseStoreSvelte<User, CreateUserRequest, UpdateUserRequest, UserApiService> {
 *   constructor() {
 *     super(userApiService, '/users');
 *   }
 * }
 * ```
 */

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

	// API Service configuration
	protected apiService: TApiService;

	constructor(apiService: TApiService) {
		this.apiService = apiService;
	}

	// ============================================================
	// GETTERS - Collection State
	// ============================================================

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

	get hasData(): boolean {
		return this._data.length > 0;
	}

	// ============================================================
	// GETTERS - Single Item State
	// ============================================================

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

	// ============================================================
	// GETTERS - CRUD Operation State
	// ============================================================

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

	// ============================================================
	// GETTERS - Pagination State
	// ============================================================

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

	// ============================================================
	// CORE CRUD METHODS (using BaseApiService)
	// ============================================================

	/**
	 * Load paginated data
	 * Uses GET request from BaseApiService
	 */
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

	/**
	 * Load a single item by ID
	 * Uses GET request from BaseApiService
	 */
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

	/**
	 * Create a new item
	 * Uses POST request from BaseApiService
	 */
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
			const index = this._data.findIndex((item) => item.id === id);
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

	async delete(id: string | number): Promise<boolean> {
		console.log('Base Store DELETE Called', id);
		if (this._deleting) return false;

		this._deleting = true;
		this._deleteError = null;

		try {
			await this.deleteItem(id);

			// Remove from data array
			this._data = this._data.filter((item) => {
				const itemUuid = (item as any).uuid;
				const itemId = item.id;

				// ✅ Match against BOTH id and uuid
				// Remove the item if either matches
				const matchesId = String(itemId) === String(id);
				const matchesUuid = itemUuid && String(itemUuid) === String(id);

				// Keep the item only if NEITHER matches
				return !matchesId && !matchesUuid;
			});

			// Update total count
			this._totalElements = Math.max(0, this._totalElements - 1);

			// Clear selection if it was the deleted item
			const selectedId = this._selectedItem?.id;
			const selectedUuid = (this._selectedItem as any)?.uuid;
			if (String(selectedId) === String(id) || String(selectedUuid) === String(id)) {
				this._selectedItem = null;
			}

			return true;
		} catch (error) {
			this._deleteError = error instanceof Error ? error.message : 'Failed to delete item';
			throw error;
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
		if (item) {
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

	/**
	 * Update a specific item in the store by ID or UUID
	 * Maintains reactivity by creating new array reference
	 */
	protected updateItemInStore(id: string | number, updatedItem: TEntity): void {
		const idStr = id.toString();

		// Update in data array
		const index = this._data.findIndex((item) => item.id.toString() === idStr);

		if (index !== -1) {
			this._data[index] = updatedItem;
		}

		// ALSO update selectedItem if it matches
		if (this._selectedItem && this._selectedItem.id.toString() === idStr) {
			this._selectedItem = updatedItem;
		}
	}

	/**
	 * Refresh a single item from the backend
	 * Useful after operations that modify the item on the server
	 */
	async refreshItem(itemId: string): Promise<TEntity> {
		try {
			const updatedItem = await this.fetchItem(itemId);
			this.updateItemInStore(itemId, updatedItem);
			return updatedItem;
		} catch (error) {
			console.error('BaseStore: Error refreshing item:', error);
			throw error;
		}
	}

	/**
	 * Optimistic update with automatic rollback on failure
	 * @param itemId - ID of item to update
	 * @param optimisticUpdate - Function that returns the optimistically updated item
	 * @param apiCall - Async function that performs the actual API call
	 * @returns The result from the API call
	 */
	async optimisticUpdate<TResult>(
		itemId: string,
		optimisticUpdate: (currentItem: TEntity) => TEntity,
		apiCall: () => Promise<TResult>
	): Promise<TResult> {
		// Find the current item (now checks both array and selectedItem)
		const currentItem = this.getItemById(itemId) || this.getItemByUuid(itemId);

		if (!currentItem) {
			throw new Error(`Item with id ${itemId} not found`);
		}

		// Store original state for rollback
		const originalItem = JSON.parse(JSON.stringify(currentItem));

		try {
			// Apply optimistic update
			const updatedItem = optimisticUpdate(currentItem);
			this.updateItemInStore(itemId, updatedItem);

			// Perform API call
			const result = await apiCall();

			console.log('[BaseStore] Optimistic update succeeded');
			return result;
		} catch (error) {
			// Rollback on error
			console.error('[BaseStore] Optimistic update failed, rolling back:', error);
			this.updateItemInStore(itemId, originalItem);
			throw error;
		}
	}

	/**
	 * Batch update multiple items optimistically
	 * Useful for operations affecting multiple items at once
	 */
	async batchOptimisticUpdate<TResult>(
		updates: Array<{
			itemId: string;
			optimisticUpdate: (currentItem: TEntity) => TEntity;
		}>,
		apiCall: () => Promise<TResult>
	): Promise<TResult> {
		// Store original states
		const rollbackStates = new Map<string, TEntity>();

		// Apply all optimistic updates
		for (const { itemId, optimisticUpdate } of updates) {
			const currentItem = this.getItemById(itemId) || this.getItemByUuid(itemId);
			if (currentItem) {
				rollbackStates.set(itemId, JSON.parse(JSON.stringify(currentItem)));
				const updatedItem = optimisticUpdate(currentItem);
				this.updateItemInStore(itemId, updatedItem);
			}
		}

		try {
			const result = await apiCall();
			return result;
		} catch (error) {
			// Rollback all changes
			console.error('Batch optimistic update failed, rolling back:', error);
			for (const [itemId, originalItem] of rollbackStates) {
				this.updateItemInStore(itemId, originalItem);
			}
			throw error;
		}
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

	// ============================================================
	// UTILITY METHODS
	// ============================================================

	protected getItemById(id: string | number): TEntity | undefined {
		const idStr = id.toString();

		// First check the data array
		const itemInArray = this._data.find((item) => item.id.toString() === idStr);
		if (itemInArray) {
			return itemInArray;
		}

		// Also check selectedItem
		if (this._selectedItem && this._selectedItem.id.toString() === idStr) {
			return this._selectedItem;
		}

		return undefined;
	}

	protected getItemByUuid(uuid: string): TEntity | undefined {
		// First check the data array
		const itemInArray = this._data.find((item) => item.uuid === uuid);
		if (itemInArray) {
			return itemInArray;
		}

		// Also check selectedItem
		if (this._selectedItem && this._selectedItem.uuid === uuid) {
			return this._selectedItem;
		}

		return undefined;
	}

	async refresh(): Promise<void> {
		await this.loadPage(this._currentPage, this._pageSize);
	}

	// ============================================================
	// RESET METHODS
	// ============================================================

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
		});
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
	abstract createItem(createRequest: TCreateRequest): Promise<TEntity>;
	protected abstract updateItem(id: string, updateRequest: TUpdateRequest): Promise<TEntity>;
	protected abstract deleteItem(id: string | number): Promise<void>;
}