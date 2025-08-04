import { BaseApiService } from '$lib/api/baseApi';
import type { PaginatedResult } from '$lib/types';
import type { FAQ } from '$lib/types/entities/faq';

export class FAQAdminApiService extends BaseApiService {
	private static instance: FAQAdminApiService;

	private constructor() {
		// Base URL for FAQ Admin Endpoints
		super('/api/v1/admin/faqs');
	}

	/**
	 * Get paginated FAQs with optional filtering
	 * Maps to Spring Boot controller: GET /api/v1/admin/faq
	 *
	 * @param params - Search and pagination parameters
	 * @returns Promise<PaginatedResult<FAQ>> - Spring Boot Page<FAQ> response
	 */

	async getAllFAQs(params: FAQSearchParams = {}): Promise<PaginatedResult<FAQ>> {

	}
}