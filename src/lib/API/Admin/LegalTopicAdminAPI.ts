import { BaseApiService } from '$lib/API/APIBase';
import { API_CONFIG } from '$lib/API/APIConfiguration';
import type { LegalTopic } from '$lib/types/entities/LegalTopic';

export class LegalTopicAdminAPI extends BaseApiService {
	private readonly ENDPOINT = API_CONFIG.ENDPOINTS.ADMIN.LEGAL_TOPIC;

	constructor() {
		super(API_CONFIG.BASE_URL);
	}

	// ============================================================================
	// BASIC DATA FETCHING
	// ============================================================================

	async getAllLegalTopics(): Promise<LegalTopic[]> {
		try {
			return await this.get<LegalTopic[]>(`${this.ENDPOINT}/all`);
		} catch (error) {
			throw error;
		}
	}

	async getLegalTopicById(topicId: string): Promise<LegalTopic> {
		try {
			return await this.get<LegalTopic>(`${this.ENDPOINT}/${topicId}`);
		} catch (error) {
			throw error;
		}
	}

	// ============================================================================
	// BASIC CRUD
	// ============================================================================

	async createLegalTopic(createData: Partial<LegalTopic>): Promise<LegalTopic> {
		console.log(createData);
		return await this.post<LegalTopic>(`${this.ENDPOINT}`, createData);
	}

	async updateLegalTopic(id: string, updateData: Partial<LegalTopic>) {
		return await this.put<LegalTopic>(`${this.ENDPOINT}/${id}`, updateData);
	}

	async deleteLegalTopic(id: string) {
		return await this.delete<LegalTopic>(`${this.ENDPOINT}/${id}`);
	}


}

export const legalTopicAdminAPI = new LegalTopicAdminAPI();