// src/lib/api/faqAPI.ts

import { buildApiUrl } from '$lib/config/api';
import type { FAQ, FAQSearchParams, FAQVoteRequest } from '$lib/types/faq';

export class FAQAPIService {

	/**
	 * Get all published FAQs ordered by priority and display order
	 */
	static async getAllPublishedFAQs(): Promise<FAQ[]> {
		const response = await fetch(buildApiUrl('/faq'));

		if (!response.ok) {
			throw new Error(`Failed to fetch FAQs: ${response.status} ${response.statusText}`);
		}

		return response.json();
	}

	/**
	 * Get FAQs by category slug
	 */
	static async getFAQsByCategorySlug(categorySlug: string): Promise<FAQ[]> {
		const response = await fetch(buildApiUrl(`/faq/category/${categorySlug}`));

		if (!response.ok) {
			throw new Error(`Failed to fetch FAQs for category ${categorySlug}: ${response.status}`);
		}

		return response.json();
	}

	/**
	 * Get FAQs by category UUID
	 */
	static async getFAQsByCategoryUuid(categoryUuid: string): Promise<FAQ[]> {
		const response = await fetch(buildApiUrl(`/faq/category/uuid/${categoryUuid}`));

		if (!response.ok) {
			throw new Error(`Failed to fetch FAQs for category UUID ${categoryUuid}: ${response.status}`);
		}

		return response.json();
	}

	/**
	 * Get featured FAQs for homepage display
	 */
	static async getFeaturedFAQs(): Promise<FAQ[]> {
		const response = await fetch(buildApiUrl('/faq/featured'));

		if (!response.ok) {
			throw new Error(`Failed to fetch featured FAQs: ${response.status}`);
		}

		return response.json();
	}

	/**
	 * Search FAQs with optional parameters
	 */
	static async searchFAQs(params: FAQSearchParams = {}): Promise<FAQ[]> {
		const searchParams = new URLSearchParams();

		if (params.q) searchParams.append('q', params.q);
		if (params.category) searchParams.append('category', params.category);

		const url = buildApiUrl('/faq/search') + (searchParams.toString() ? `?${searchParams.toString()}` : '');
		const response = await fetch(url);

		if (!response.ok) {
			throw new Error(`Failed to search FAQs: ${response.status}`);
		}

		return response.json();
	}

	/**
	 * Get FAQ by UUID and increment view count
	 */
	static async getFAQByUuid(uuid: string): Promise<FAQ> {
		const response = await fetch(buildApiUrl(`/faq/${uuid}`));

		if (!response.ok) {
			if (response.status === 404) {
				throw new Error('FAQ not found');
			}
			throw new Error(`Failed to fetch FAQ: ${response.status}`);
		}

		return response.json();
	}

	/**
	 * Get FAQ by slug (SEO-friendly URLs)
	 */
	static async getFAQBySlug(categorySlug: string, faqSlug: string): Promise<FAQ> {
		const response = await fetch(buildApiUrl(`/faq/slug/${categorySlug}/${faqSlug}`));

		if (!response.ok) {
			if (response.status === 404) {
				throw new Error('FAQ not found');
			}
			throw new Error(`Failed to fetch FAQ: ${response.status}`);
		}

		return response.json();
	}

	/**
	 * Vote on FAQ helpfulness
	 */
	static async voteFAQHelpfulness(uuid: string, helpful: boolean): Promise<void> {
		const response = await fetch(buildApiUrl(`/faq/${uuid}/vote?helpful=${helpful}`), {
			method: 'POST'
		});

		if (!response.ok) {
			if (response.status === 404) {
				throw new Error('FAQ not found');
			}
			throw new Error(`Failed to vote on FAQ: ${response.status}`);
		}
	}

	/**
	 * Get popular FAQs (most viewed)
	 */
	static async getPopularFAQs(limit: number = 10, category?: string): Promise<FAQ[]> {
		const searchParams = new URLSearchParams({ limit: limit.toString() });
		if (category) searchParams.append('category', category);

		const response = await fetch(buildApiUrl(`/faq/analytics/popular?${searchParams.toString()}`));

		if (!response.ok) {
			throw new Error(`Failed to fetch popular FAQs: ${response.status}`);
		}

		return response.json();
	}

	/**
	 * Get most helpful FAQs
	 */
	static async getMostHelpfulFAQs(limit: number = 10): Promise<FAQ[]> {
		const response = await fetch(buildApiUrl(`/faq/analytics/helpful?limit=${limit}`));

		if (!response.ok) {
			throw new Error(`Failed to fetch helpful FAQs: ${response.status}`);
		}

		return response.json();
	}
}