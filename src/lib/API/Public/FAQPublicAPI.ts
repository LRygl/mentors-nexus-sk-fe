import { BaseApiService } from '$lib/API/APIBase';
import { API_CONFIG } from '$lib/API/APIConfiguration';
import type { FAQ } from '$lib/types';
import type { FAQCategory } from '$lib/types/entities/faqCategory';

export class FAQPublicAPI extends BaseApiService {
	private readonly ENDPOINT: string = API_CONFIG.ENDPOINTS.FAQ;

	constructor() {
		super(API_CONFIG.BASE_URL);
	}

	async getPublicFAQs(): Promise<FAQCategory[]> {
		return await this.get<FAQCategory[]>(`${this.ENDPOINT}`);
	}

	async recordFAQView(faqUUID: string): Promise<void> {
		await this.post<FAQ>(`${this.ENDPOINT}/${faqUUID}/view`);
	}

	async voteFAQ(faqUUID: string, helpful: boolean): Promise<FAQ> {
		return await this.post<FAQ>(`${this.ENDPOINT}/${faqUUID}/vote`, { helpful });
	}
}

export const faqPublicAPI = new FAQPublicAPI();