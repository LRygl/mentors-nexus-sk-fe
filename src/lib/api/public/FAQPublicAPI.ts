
import { buildApiUrl } from '$lib/config/api';
import type {
	FAQ,
	FAQCategory,
	FAQSearchParams,
	FAQAdminFilters,
	FAQCategoryAdminFilters,
	FAQFormData,
	FAQCategoryFormData,
	FAQStats,
	CategoryStats,
	PaginatedResponse
} from '$lib/types/faq';

// Public FAQ API (accessible to all users)
export class FAQPublicAPI {

	static async getAllFAQs(): Promise<FAQ[]> {
		const response = await fetch(buildApiUrl('/faq'));
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		return response.json();
	}

	static async getFAQsByCategory(categorySlug: string): Promise<FAQ[]> {
		const response = await fetch(buildApiUrl(`/faq/category/${categorySlug}`));
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		return response.json();
	}

	static async getFAQsByCategoryUuid(categoryUuid: string): Promise<FAQ[]> {
		const response = await fetch(buildApiUrl(`/faq/category/uuid/${categoryUuid}`));
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		return response.json();
	}

	static async getFeaturedFAQs(): Promise<FAQ[]> {
		const response = await fetch(buildApiUrl('/faq/featured'));
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		return response.json();
	}

	static async searchFAQs(params: FAQSearchParams): Promise<FAQ[]> {
		const searchParams = new URLSearchParams();

		if (params.q) searchParams.append('q', params.q);
		if (params.category) searchParams.append('category', params.category);

		const response = await fetch(buildApiUrl(`/faq/search?${searchParams.toString()}`));
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		return response.json();
	}

	static async getFAQByUuid(uuid: string): Promise<FAQ> {
		const response = await fetch(buildApiUrl(`/faq/${uuid}`));
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		return response.json();
	}

	static async getFAQBySlug(categorySlug: string, faqSlug: string): Promise<FAQ> {
		const response = await fetch(buildApiUrl(`/faq/slug/${categorySlug}/${faqSlug}`));
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		return response.json();
	}

	static async voteFAQHelpfulness(uuid: string, helpful: boolean): Promise<void> {
		const response = await fetch(buildApiUrl(`/faq/${uuid}/vote?helpful=${helpful}`), {
			method: 'POST'
		});
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
	}

	static async getPopularFAQs(limit: number = 10, category?: string): Promise<FAQ[]> {
		const searchParams = new URLSearchParams();
		searchParams.append('limit', limit.toString());
		if (category) searchParams.append('category', category);

		const response = await fetch(buildApiUrl(`/faq/analytics/popular?${searchParams.toString()}`));
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		return response.json();
	}

	static async getMostHelpfulFAQs(limit: number = 10): Promise<FAQ[]> {
		const response = await fetch(buildApiUrl(`/faq/analytics/helpful?limit=${limit}`));
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		return response.json();
	}
}