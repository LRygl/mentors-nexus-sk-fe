import { BaseApiService } from '$lib/API/APIBase';
import { API_CONFIG } from '$lib/API/APIConfiguration';
import type { LegalTopic } from '$lib/types/entities/LegalTopic';
import type { LegalItem } from '$lib/types/entities/LegalItem';

export class LegalTopicAdminAPI extends BaseApiService {
	private readonly ENDPOINT = API_CONFIG.ENDPOINTS.ADMIN.LEGAL_TOPIC;

	constructor() {
		super(API_CONFIG.BASE_URL);
	}

	// ============================================================================
	// BASIC DATA FETCHING
	// ============================================================================

	async getAllLegalTopics(): Promise<LegalTopic[]> {
			return await this.get<LegalTopic[]>(`${this.ENDPOINT}/all`);
	}

	async getLegalTopicById(topicId: string): Promise<LegalTopic> {
			return await this.get<LegalTopic>(`${this.ENDPOINT}/${topicId}`);
	}

	// ============================================================================
	// BASIC CRUD
	// ============================================================================

	async createLegalTopic(createData: Partial<LegalTopic>): Promise<LegalTopic> {
		return await this.post<LegalTopic>(`${this.ENDPOINT}`, createData);
	}

	async updateLegalTopic(id: string, updateData: Partial<LegalTopic>) {
		return await this.put<LegalTopic>(`${this.ENDPOINT}/${id}`, updateData);
	}

	async deleteLegalTopic(id: string) {
		return await this.delete<LegalTopic>(`${this.ENDPOINT}/${id}`);
	}


	async createLegalItem(sectionId: string, createData: Partial<LegalItem>) {
		return await this.post
		return undefined;
	}
}

export const legalTopicAdminAPI = new LegalTopicAdminAPI();