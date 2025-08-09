import { BaseApiService } from '$lib/api/baseApi';
import { API_CONFIG } from '$lib/config/api';
import type { FAQCategory, FAQCategoryPaginationParams } from '$lib/types/entities/faqCategory';
import type { FAQ, PaginatedResult } from '$lib/types';


export class FAQCategoryAdminApiService extends BaseApiService {
	private static instance: FAQCategoryAdminApiService;
	private static readonly ENDPOINT = API_CONFIG.ENDPOINTS.ADMIN.ADMIN_FAQ_CATEGORY;

	constructor() {
		super(API_CONFIG.BASE_URL);
	}

	async getFAQCategoryPage(params: FAQCategoryPaginationParams = {}): Promise<PaginatedResult<FAQCategory>> {

		const queryParams: Record<string, any> = {
			page: params.page ?? 0,
			size: params.size ?? 20
		};

		// Add optional filters only if they have values
		if (params.search?.trim()) queryParams.search = params.search.trim();
		if (params.sort) queryParams.sort = params.sort;
		if (params.direction) queryParams.direction = params.direction;

		console.log('FAQ CATEGORY API: Fetching FAQ Categories with params:', queryParams);

		try {
			const result = await this.get<PaginatedResult<FAQCategory>>(
				FAQCategoryAdminApiService.ENDPOINT,
				queryParams,
				{
					cache: true,
					timeout: 10000
				}
			);

			result.content = result.content.map((faqCategory) => this.transformFAQDates(faqCategory));

			return result;
		} catch (error) {
			console.error('FAQ CATEGORY API: Error fetching FAQs:', error);
			throw error;
		}
	}

	/**
	 * Transforms date strings from Spring Boot to Date objects
	 */
	private transformFAQDates(faq: any): FAQ {
		return {
			...faq,
			createdAt: new Date(faq.createdAt || faq.createdDate),
			updatedAt: new Date(faq.updatedAt || faq.lastModifiedDate),
			publishedDate: faq.publishedDate ? new Date(faq.publishedDate) : undefined
		};
	}

}

export const faqCategoryAdminApiService = new FAQCategoryAdminApiService;