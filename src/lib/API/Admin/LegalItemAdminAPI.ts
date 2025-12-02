import { BaseApiService } from '$lib/API/APIBase';
import { API_CONFIG } from '$lib/API/APIConfiguration';
import type { LegalItem } from '$lib/types/entities/LegalItem';

export class LegalItemAdminAPI extends BaseApiService {
	private readonly ENDPOINT = API_CONFIG.ENDPOINTS.ADMIN.LEGAL_ITEM;

	constructor() {
		super(API_CONFIG.BASE_URL);
	}

	// ============================================================================
	// BASIC CRUD
	// ============================================================================

	async createItem(sectionId: string, createData: Partial<LegalItem>): Promise<LegalItem> {
		return await this.post<LegalItem>(`${this.ENDPOINT}`, {
			...createData,
			sectionId
		});
	}

	async updateItem(itemId: string, updateData: Partial<LegalItem>): Promise<LegalItem> {
		return await this.put<LegalItem>(`${this.ENDPOINT}/${itemId}`, updateData);
	}

	async deleteItem(itemId: string): Promise<void> {
		await this.delete(`${this.ENDPOINT}/${itemId}`);
	}

	// ============================================================================
	// SUB-ITEMS MANAGEMENT
	// ============================================================================

	async createSubItem(parentItemId: string, createData: Partial<LegalItem>): Promise<LegalItem> {
		return await this.post<LegalItem>(`${this.ENDPOINT}/${parentItemId}/sub-items`, createData);
	}

	async unlinkSubItem(parentItemId: string, subItemId: string): Promise<void> {
		await this.delete(`${this.ENDPOINT}/${parentItemId}/sub-items/${subItemId}`);
	}

	// ============================================================================
	// REORDERING
	// ============================================================================

	async reorderItems(sectionId: string, itemIds: number[]): Promise<void> {
		await this.put(`${this.ENDPOINT}/reorder`, {
			sectionId,
			itemIds
		});
	}

	async reorderSubItems(parentItemId: string, subItemIds: number[]): Promise<void> {
		await this.put(`${this.ENDPOINT}/${parentItemId}/sub-items/reorder`, {
			subItemIds
		});
	}
}

export const legalItemAdminAPI = new LegalItemAdminAPI();