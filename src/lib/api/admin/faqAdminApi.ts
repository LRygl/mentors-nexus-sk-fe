import { BaseApiService } from '$lib/api/baseApi';
import type { PaginatedResult } from '$lib/types';
import type { FAQ, FAQPaginationParams } from '$lib/types/entities/faq';
import { API_CONFIG } from '$lib/config/api';

export class FAQAdminApiService extends BaseApiService {
	private static instance: FAQAdminApiService;
	private static readonly ENDPOINT = API_CONFIG.ENDPOINTS.ADMIN.ADMIN_FAQ;

	constructor() {
		super(API_CONFIG.BASE_URL);
	}

	async getAll(): Promise<FAQ[]> {
		try	{
			return await this.get<FAQ[]>(FAQAdminApiService.ENDPOINT);
		} catch(e) {
			throw (e as Error);
		}
	}

	/**
	 * Get paginated FAQs with optional filtering
	 * Maps to Spring Boot controller: GET /api/v1/admin/faq
	 *
	 * @param params - Search and pagination parameters
	 * @returns Promise<PaginatedResult<FAQ>> - Spring Boot Page<FAQ> response
	 */

	async getFAQsPage(params: FAQPaginationParams = {}): Promise<PaginatedResult<FAQ>> {
		// Build query parameters object
		const queryParams: Record<string, any> = {
			page: params.page ?? 0,
			size: params.size ?? 20
		};

		// Add optional filters only if they have values
		if (params.status) queryParams.status = params.status;
		if (params.categoryUuid) queryParams.categoryUuid = params.categoryUuid;
		if (params.priority) queryParams.priority = params.priority;
		if (params.search?.trim()) queryParams.search = params.search.trim();
		if (params.sort) queryParams.sort = params.sort;
		if (params.direction) queryParams.direction = params.direction;

		try {
			// Use the BaseApiService get method with caching enabled
			// Spring Boot returns Page<FAQ> which matches your PaginatedResult<T> interface
			const result = await this.get<PaginatedResult<FAQ>>(
				FAQAdminApiService.ENDPOINT,
				queryParams,
				{
					cache: true,
					timeout: 10000
				}
			);

			// Transform date strings to Date objects for FAQ content
			result.content = result.content.map((faq) => this.transformFAQDates(faq));
			return result;
		} catch (error) {
			console.error('FAQ API: Error fetching FAQs:', error);
			throw error;
		}
	}

	/**
	 * Gets a single FAQ by UUID
	 */
	async getFAQById(uuid: string): Promise<FAQ> {
		try {
			const faq = await this.get<FAQ>(`${FAQAdminApiService.ENDPOINT}/${uuid}`, undefined, {
				cache: true,
				timeout: 5000
			});

			// Transform date strings to Date objects
			return this.transformFAQDates(faq);
		} catch (error) {
			console.error('FAQ API: Error fetching FAQ:', error);
			throw error;
		}
	}

	/**
	 * PUBLISH FAQ
	 * Maps to Spring Boot controller: PATCH /api/v1/admin/faq/{uuid}/publish
	 * @param uuid - The UUID of the FAQ to publish
	 * @returns Promise<FAQ> - The updated FAQ with published status
	 */

	async publishFAQ(uuid: string): Promise<FAQ> {
		try {
			this.clearFAQCache();
			const faq = await this.patch<FAQ>(`${FAQAdminApiService.ENDPOINT}/${uuid}/publish`);
			// Transform date strings to Date objects
			return this.transformFAQDates(faq);
		} catch (error) {
			console.error('FAQ API: Error fetching FAQ:', error);
			throw error;
		}

	}

	async unpublishFAQ(uuid: string): Promise<FAQ> {
		try {
			this.clearFAQCache();
			const faq = await this.patch<FAQ>(`${FAQAdminApiService.ENDPOINT}/${uuid}/unpublish`);
			return this.transformFAQDates(faq);
		} catch (error) {
			console.error('FAQ API: Error unpublishFAQ:', error);
			throw error;
		}
	}

	async linkFAQToCategory(faqUuid:string, categoryUuid:string): Promise<FAQ> {
		try {
			return await this.patch<FAQ>(
				`${FAQAdminApiService.ENDPOINT}/${faqUuid}/link/${categoryUuid}`,
				undefined, {}
			);
		} catch (error) {
			console.error('FAQ API: Error linkFAQToCategory:', error);
			throw error;
		}
	}

	async unlinkFAQFromCategory(uuid: string): Promise<void> {
		try {
			await this.patch<FAQ>(`${FAQAdminApiService.ENDPOINT}/${uuid}/unlink`);
		} catch (error) {
			console.error('FAQ API: Error unlinkFAQFromCategory:', error);
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

	/**
	 * Clear FAQ-related cache entries
	 */
	clearFAQCache(): void {
		this.invalidate(FAQAdminApiService.ENDPOINT);
	}

	static async unlinkFAQFromFAQCategory(faqUuid: string) {

	}
}

export const faqAdminApiService = new FAQAdminApiService;