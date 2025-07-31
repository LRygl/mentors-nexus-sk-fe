// src/lib/api/faqCategoryAPI.ts

import { buildApiUrl } from '$lib/config/api';
import type { FAQCategory } from '$lib/types/faq';

export class FAQCategoryAPIService {

	/**
	 * Get all visible FAQ categories ordered by display order
	 */
	static async getAllVisibleCategories(): Promise<FAQCategory[]> {
		const response = await fetch(buildApiUrl('/faq-category'));

		if (!response.ok) {
			throw new Error(`Failed to fetch FAQ categories: ${response.status} ${response.statusText}`);
		}

		return response.json();
	}

	/**
	 * Get categories that have published FAQs
	 */
	static async getCategoriesWithPublishedFAQs(): Promise<FAQCategory[]> {
		const response = await fetch(buildApiUrl('/faq-category/with-faqs'));

		if (!response.ok) {
			throw new Error(`Failed to fetch categories with FAQs: ${response.status}`);
		}

		return response.json();
	}

	/**
	 * Get categories with their FAQ counts for analytics
	 */
	static async getCategoriesWithFAQCounts(): Promise<FAQCategory[]> {
		const response = await fetch(buildApiUrl('/faq-category/with-counts'));

		if (!response.ok) {
			throw new Error(`Failed to fetch categories with counts: ${response.status}`);
		}

		return response.json();
	}

	/**
	 * Get category by URL slug
	 */
	static async getCategoryBySlug(slug: string): Promise<FAQCategory> {
		const response = await fetch(buildApiUrl(`/faq-category/slug/${slug}`));

		if (!response.ok) {
			if (response.status === 404) {
				throw new Error('Category not found');
			}
			throw new Error(`Failed to fetch category: ${response.status}`);
		}

		return response.json();
	}

	/**
	 * Get category by UUID
	 */
	static async getCategoryByUuid(uuid: string): Promise<FAQCategory> {
		const response = await fetch(buildApiUrl(`/faq-category/${uuid}`));

		if (!response.ok) {
			if (response.status === 404) {
				throw new Error('Category not found');
			}
			throw new Error(`Failed to fetch category: ${response.status}`);
		}

		return response.json();
	}

	/**
	 * Get most popular categories by FAQ count
	 */
	static async getPopularCategories(limit: number = 5): Promise<FAQCategory[]> {
		const response = await fetch(buildApiUrl(`/faq-category/analytics/popular?limit=${limit}`));

		if (!response.ok) {
			throw new Error(`Failed to fetch popular categories: ${response.status}`);
		}

		return response.json();
	}
}