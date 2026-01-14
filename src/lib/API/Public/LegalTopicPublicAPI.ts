console.log('Loading LegalTopicPublicApiService');
import { BaseApiService } from '$lib/API/APIBase';
import { API_CONFIG } from '$lib/API/APIConfiguration';
import type { LegalTopic } from '$lib/types/entities/LegalTopic';

export class LegalTopicPublicAPI extends BaseApiService {
	private readonly ENDPOINT = API_CONFIG.ENDPOINTS.LEGAL.TOPIC;

	constructor() {
		super(API_CONFIG.BASE_URL);
	}

	async getAllPublicTopics(): Promise<LegalTopic[]> {
		try {
			return await this.get<LegalTopic[]>(`${this.ENDPOINT}`);
		} catch (error) {
			throw error;
		}
	}

	async getPublictopicById(id: string): Promise<LegalTopic> {
		try {
			return await this.get<LegalTopic>(`${this.ENDPOINT}/${id}`)
		} catch (error) {
			throw error;
		}
	}

}

export const legalTopicPublicApiService = new LegalTopicPublicAPI();