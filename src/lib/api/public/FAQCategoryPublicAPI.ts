
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

export class FAQCategoryPublicAPI {

	static async getAllVisibleCategories(): Promise<FAQCategory[]> {
		const response = await fetch(buildApiUrl('/faq-category'));
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		return response.json();
	}

	static async getCategoriesWithFAQs(): Promise<FAQCategory[]> {
		const response = await fetch(buildApiUrl('/faq-category/with-faqs'));
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		return response.json();
	}

	static async getCategoriesWithCounts(): Promise<FAQCategory[]> {
		const response = await fetch(buildApiUrl('/faq-category/with-counts'));
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		return response.json();
	}

	static async getCategoryBySlug(slug: string): Promise<FAQCategory> {
		const response = await fetch(buildApiUrl(`/faq-category/slug/${slug}`));
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		return response.json();
	}

	static async getCategoryByUuid(uuid: string): Promise<FAQCategory> {
		const response = await fetch(buildApiUrl(`/faq-category/${uuid}`));
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		return response.json();
	}

	static async getPopularCategories(limit: number = 5): Promise<FAQCategory[]> {
		const response = await fetch(buildApiUrl(`/faq-category/analytics/popular?limit=${limit}`));
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		return response.json();
	}
}