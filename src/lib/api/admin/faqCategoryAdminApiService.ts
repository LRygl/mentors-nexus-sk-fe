import { BaseApiService } from '$lib/api/baseApi';
import { API_CONFIG } from '$lib/config/api';
import type {
	CreateFAQCategoryRequest,
	FAQCategory,
	FAQCategoryPaginationParams
} from '$lib/types/entities/faqCategory';
import type { FAQ, PaginatedResult } from '$lib/types';

export class FAQCategoryAdminApiService extends BaseApiService {
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
			return await this.get<PaginatedResult<FAQCategory>>(
				FAQCategoryAdminApiService.ENDPOINT,
				queryParams,
				{
					cache: true,
					timeout: 10000
				}
			);
		} catch (error) {
			console.error('FAQ CATEGORY API: Error fetching FAQs:', error);
			throw error;
		}
	}

	async getFAQCategoryById(id: string): Promise<FAQCategory> {
		try {
			console.log("API CALL", id)
			return this.get<FAQCategory>(`${FAQCategoryAdminApiService.ENDPOINT}/${id}`);
		} catch (error) {
			throw error;
		}
	}

	/**
	 * Create new FAQ category
	 */
	async createFAQCategory(createRequest: CreateFAQCategoryRequest): Promise<FAQCategory> {
		// Generate slug if not provided
		const requestData = {
			...createRequest,
			slug: createRequest.slug || this.generateSlug(createRequest.name)
		};

		return await this.post<FAQCategory>(FAQCategoryAdminApiService.ENDPOINT, requestData);
	}



	/**
	 * Private helper to generate URL-friendly slug
	 */
	private generateSlug(name: string): string {
		return name
			.toLowerCase()
			.replace(/[^a-z0-9\s-]/g, '') // Remove special characters
			.replace(/\s+/g, '-')         // Replace spaces with hyphens
			.replace(/-+/g, '-')          // Replace multiple hyphens with single
			.trim();
	}
}

export const faqCategoryAdminApiService = new FAQCategoryAdminApiService;