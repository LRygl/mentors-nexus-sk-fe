import { BaseApiService } from '$lib/API/APIBase';
import { API_CONFIG } from '$lib/API/APIConfiguration';
import type {
	CreateFAQCategoryRequest,
	FAQCategory,
	FAQCategoryPaginationParams,
	UpdateFAQCategoryRequest
} from '$lib/types/entities/faqCategory';
import type { PaginatedResult } from '$lib/types';

export class FAQCategoryAdminAPI extends BaseApiService {
	private readonly ENDPOINT = API_CONFIG.ENDPOINTS.ADMIN.FAQ_CATEGORY;

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

		try {
			return await this.get<PaginatedResult<FAQCategory>>(
				this.ENDPOINT,
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
			return this.get<FAQCategory>(`${this.ENDPOINT}/${id}`);
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

		return await this.post<FAQCategory>(this.ENDPOINT, requestData);
	}

	async deleteFAQCategory(id: string): Promise<void> {
		await this.delete(`${this.ENDPOINT}/${id}`)
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

export const faqCategoryAdminApiService = new FAQCategoryAdminAPI;