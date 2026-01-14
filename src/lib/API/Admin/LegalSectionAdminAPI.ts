import { BaseApiService } from '$lib/API/APIBase';
import { API_CONFIG } from '$lib/API/APIConfiguration';
import type { LegalSection } from '$lib/types/entities/LegalSection';

export class LegalSectionAdminAPI extends BaseApiService {
	private readonly ENDPOINT = API_CONFIG.ENDPOINTS.ADMIN.LEGAL_SECTION;

	constructor() {
		super(API_CONFIG.BASE_URL);
	}

	// ============================================================================
	// BASIC CRUD
	// ============================================================================

	async createSection(topicId: string, createData: Partial<LegalSection>): Promise<LegalSection> {
		return await this.post<LegalSection>(`${this.ENDPOINT}/topic/${topicId}`, {
			...createData
		});
	}

	async updateSection(sectionId: string, updateData: Partial<LegalSection>): Promise<LegalSection> {
		return await this.put<LegalSection>(`${this.ENDPOINT}/${sectionId}`, updateData);
	}

	async deleteSection(sectionId: string): Promise<void> {
		await this.delete(`${this.ENDPOINT}/${sectionId}`);
	}

	// ============================================================================
	// REORDERING
	// ============================================================================

	async reorderSections(topicId: string, sectionIds: number[]): Promise<void> {
		await this.post(`${this.ENDPOINT}/topic/${topicId}/reorder`,sectionIds	);
	}
}

export const legalSectionAdminAPI = new LegalSectionAdminAPI();