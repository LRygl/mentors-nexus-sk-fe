/**
 * Generic Table Store Interface
 * This provides a standardized interface for any entity store that will be used with UniversalDataTable
 */
export interface TableStore<T> {
	// Core data
	data: T[];
	loading: boolean;
	error: string | null;

	// CRUD operation states
	creating?: boolean;
	createError?: string | null;
	updating?: boolean;
	updateError?: string | null;
	deleting?: boolean;
	deleteError?: string | null;

	// Core methods that all table stores should implement
	refresh: () => Promise<void>;
	loadData: () => Promise<void>;

	// Optional CRUD methods
	createItem?: (data: Partial<T>) => Promise<T>;
	updateItem?: (id: string | number, data: Partial<T>) => Promise<T>;
	deleteItem?: (id: string | number) => Promise<void>;
	duplicateItem?: (id: string | number) => Promise<T>;
}

/**
 * Base Table Store Implementation
 * Provides common functionality for table stores
 */
export class BaseTableStore<T> implements TableStore<T> {
	data = $state<T[]>([]);
	loading = $state<boolean>(false);
	error = $state<string | null>(null);
	creating = $state<boolean>(false);
	createError = $state<string | null>(null);
	updating = $state<boolean>(false);
	updateError = $state<string | null>(null);
	deleting = $state<boolean>(false);
	deleteError = $state<string | null>(null);

	constructor(
		protected apiEndpoint: string,
		protected entityName: string = 'item'
	) {}

	async loadData(): Promise<void> {
		this.loading = true;
		this.error = null;

		try {
			const response = await fetch(this.apiEndpoint);
			if (!response.ok) {
				throw new Error(`Failed to load ${this.entityName}s`);
			}
			this.data = await response.json();
		} catch (error) {
			this.error = error instanceof Error ? error.message : `Failed to load ${this.entityName}s`;
			console.error(`Error loading ${this.entityName}s:`, error);
		} finally {
			this.loading = false;
		}
	}

	async refresh(): Promise<void> {
		await this.loadData();
	}

	async createItem(data: Partial<T>): Promise<T> {
		this.creating = true;
		this.createError = null;

		try {
			const response = await fetch(this.apiEndpoint, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(data)
			});

			if (!response.ok) {
				throw new Error(`Failed to create ${this.entityName}`);
			}

			const newItem = await response.json();
			this.data = [...this.data, newItem];
			return newItem;
		} catch (error) {
			this.createError = error instanceof Error ? error.message : `Failed to create ${this.entityName}`;
			throw error;
		} finally {
			this.creating = false;
		}
	}

	async updateItem(id: string | number, data: Partial<T>): Promise<T> {
		this.updating = true;
		this.updateError = null;

		try {
			const response = await fetch(`${this.apiEndpoint}/${id}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(data)
			});

			if (!response.ok) {
				throw new Error(`Failed to update ${this.entityName}`);
			}

			const updatedItem = await response.json();
			const index = this.data.findIndex((item: any) => item.id === id);
			if (index !== -1) {
				this.data[index] = updatedItem;
			}
			return updatedItem;
		} catch (error) {
			this.updateError = error instanceof Error ? error.message : `Failed to update ${this.entityName}`;
			throw error;
		} finally {
			this.updating = false;
		}
	}

	async deleteItem(id: string | number): Promise<void> {
		this.deleting = true;
		this.deleteError = null;

		try {
			const response = await fetch(`${this.apiEndpoint}/${id}`, {
				method: 'DELETE'
			});

			if (!response.ok) {
				throw new Error(`Failed to delete ${this.entityName}`);
			}

			this.data = this.data.filter((item: any) => item.id !== id);
		} catch (error) {
			this.deleteError = error instanceof Error ? error.message : `Failed to delete ${this.entityName}`;
			throw error;
		} finally {
			this.deleting = false;
		}
	}

	async duplicateItem(id: string | number): Promise<T> {
		const originalItem = this.data.find((item: any) => item.id === id);
		if (!originalItem) {
			throw new Error(`${this.entityName} not found`);
		}

		// Remove id and other unique Fields, add "Copy" to name if it exists
		const duplicateData = {
			...originalItem,
			id: undefined,
			uuid: undefined,
			createdAt: undefined,
			updatedAt: undefined
		} as Partial<T>;

		// Add "Copy" to name field if it exists
		if ('name' in duplicateData && typeof duplicateData.name === 'string') {
			(duplicateData as any).name = `${duplicateData.name} (Copy)`;
		}

		return this.createItem(duplicateData);
	}
}