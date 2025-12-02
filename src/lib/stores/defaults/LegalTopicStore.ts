import { BaseStoreSvelte } from '$lib/stores/BaseStore.svelte';
import type { LegalTopic } from '$lib/types/entities/LegalTopic';
import { legalTopicAdminAPI, type LegalTopicAdminAPI } from '$lib/API/Admin/LegalTopicAdminAPI';
import { legalSectionAdminAPI } from '$lib/API/Admin/LegalSectionAdminAPI';
import { legalItemAdminAPI } from '$lib/API/Admin/LegalItemAdminAPI';
import type { LegalSection } from '$lib/types/entities/LegalSection';
import type { LegalItem } from '$lib/types/entities/LegalItem';

export class LegalTopicStore extends BaseStoreSvelte<
	LegalTopic,
	Partial<LegalTopic>,
	Partial<LegalTopic>,
	LegalTopicAdminAPI
> {
	
	constructor() {
		super(legalTopicAdminAPI);
	}

	// ============================================================================
	// BASIC DATA FETCHING
	// ============================================================================

	async fetchAll(): Promise<LegalTopic[]>  {
		this._loading = true;

		try {
			this._data = await this.apiService.getAllLegalTopics();
			return this._data;
		} catch (error) {
			console.log(error);
			throw error;
		} finally {
			this._loading = false;
		}
	}

	async fetchItem(topicId: string): Promise<LegalTopic> {
		this._loadingItem = true;
		this._itemError = null;

		try {
			const topic = await this.apiService.getLegalTopicById(topicId);
			this._selectedItem = topic;
			return topic;
		} catch (error) {
			this._itemError = error instanceof Error ? error.message : 'Failed to load legal topic';
			console.error('[STORE] Error fetching legal topic:', error);
			throw error;
		} finally {
			this._loadingItem = false;
		}
	}

	// ============================================================================
	// BASIC CRUD - These are the low-level API calls
	// ============================================================================

	async createItem(createData: Partial<LegalTopic>): Promise<LegalTopic> {
		return await this.apiService.createLegalTopic(createData);
	}

	async updateItem(id: string, updateData: Partial<LegalTopic>): Promise<LegalTopic> {
		return await this.apiService.updateLegalTopic(id, updateData);
	}

	async deleteItem(id: string): Promise<void> {
		await this.apiService.deleteLegalTopic(id);
	}

	// ============================================================================
	// SECTION MANAGEMENT
	// ============================================================================

	async createSection(topicId: string, sectionData: Partial<LegalSection>): Promise<void> {
		this._loadingItem = true;
		try {
			await legalSectionAdminAPI.createSection(topicId, sectionData);
			await this.fetchItem(topicId);
		} catch (error) {
			console.error('[STORE] Error creating section:', error);
			throw error;
		} finally {
			this._loadingItem = false;
		}
	}

	async updateSection(sectionId: string, sectionData: Partial<LegalSection>): Promise<void> {
		try {
			await legalSectionAdminAPI.updateSection(sectionId, sectionData);
			if (this._selectedItem?.id) {
				await this.fetchItem(this._selectedItem.id.toString());
			}
		} catch (error) {
			console.error('[STORE] Error updating section:', error);
			throw error;
		}
	}

	async deleteSection(sectionId: string): Promise<void> {
		this._loadingItem = true;
		try {
			await legalSectionAdminAPI.deleteSection(sectionId);
			if (this._selectedItem?.id) {
				await this.fetchItem(this._selectedItem.id.toString());
			}
		} catch (error) {
			console.error('[STORE] Error deleting section:', error);
			throw error;
		} finally {
			this._loadingItem = false;
		}
	}

	async reorderSections(topicId: string, sections: LegalSection[]): Promise<void> {
		try {
			const sectionIds = sections
				.map(s => s.id)
				.filter((id): id is number => id !== undefined && id !== null);
			
			await legalSectionAdminAPI.reorderSections(topicId, sectionIds);
			await this.fetchItem(topicId);
		} catch (error) {
			console.error('[STORE] Error reordering sections:', error);
			throw error;
		}
	}

	// ============================================================================
	// ITEM MANAGEMENT
	// ============================================================================

	async createItem_InSection(sectionId: string, itemData: Partial<LegalItem>): Promise<void> {
		this._loadingItem = true;
		try {
			await legalItemAdminAPI.createItem(sectionId, itemData);
			if (this._selectedItem?.id) {
				await this.fetchItem(this._selectedItem.id.toString());
			}
		} catch (error) {
			console.error('[STORE] Error creating item:', error);
			throw error;
		} finally {
			this._loadingItem = false;
		}
	}

	async updateLegalItem(itemId: string, itemData: Partial<LegalItem>): Promise<void> {
		try {
			await legalItemAdminAPI.updateItem(itemId, itemData);
			if (this._selectedItem?.id) {
				await this.fetchItem(this._selectedItem.id.toString());
			}
		} catch (error) {
			console.error('[STORE] Error updating item:', error);
			throw error;
		}
	}

	async deleteItem_FromSection(itemId: string): Promise<void> {
		this._loadingItem = true;
		try {
			await legalItemAdminAPI.deleteItem(itemId);
			if (this._selectedItem?.id) {
				await this.fetchItem(this._selectedItem.id.toString());
			}
		} catch (error) {
			console.error('[STORE] Error deleting item:', error);
			throw error;
		} finally {
			this._loadingItem = false;
		}
	}

	async reorderItems(sectionId: string, itemIds: number[]): Promise<void> {
		try {
			await legalItemAdminAPI.reorderItems(sectionId, itemIds);
			if (this._selectedItem?.id) {
				await this.fetchItem(this._selectedItem.id.toString());
			}
		} catch (error) {
			console.error('[STORE] Error reordering items:', error);
			throw error;
		}
	}

	// ============================================================================
	// SUB-ITEM MANAGEMENT
	// ============================================================================

	async createSubItem(parentItemId: string, subItemData: Partial<LegalItem>): Promise<void> {
		this._loadingItem = true;
		try {
			await legalItemAdminAPI.createSubItem(parentItemId, subItemData);
			if (this._selectedItem?.id) {
				await this.fetchItem(this._selectedItem.id.toString());
			}
		} catch (error) {
			console.error('[STORE] Error creating sub-item:', error);
			throw error;
		} finally {
			this._loadingItem = false;
		}
	}

	async deleteSubItem(parentItemId: string, subItemId: string): Promise<void> {
		this._loadingItem = true;
		try {
			await legalItemAdminAPI.unlinkSubItem(parentItemId, subItemId);
			if (this._selectedItem?.id) {
				await this.fetchItem(this._selectedItem.id.toString());
			}
		} catch (error) {
			console.error('[STORE] Error deleting sub-item:', error);
			throw error;
		} finally {
			this._loadingItem = false;
		}
	}

	async reorderSubItems(parentItemId: string, subItemIds: number[]): Promise<void> {
		try {
			await legalItemAdminAPI.reorderSubItems(parentItemId, subItemIds);
			if (this._selectedItem?.id) {
				await this.fetchItem(this._selectedItem.id.toString());
			}
		} catch (error) {
			console.error('[STORE] Error reordering sub-items:', error);
			throw error;
		}
	}

}

export const legalTopicStore = new LegalTopicStore();