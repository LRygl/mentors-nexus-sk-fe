// src/lib/api/faqAPI.ts
// FAQ-specific API functions mapping to your Spring Boot FAQController and FAQAdminController

import { buildApiUrl } from '$lib/config/api';
import type { FAQ, CreateFAQDTO, UpdateFAQDTO } from '$lib/types/faq';

// =============================================================================
// PUBLIC FAQ ENDPOINTS (FAQController.java)
// =============================================================================

/**
 * Get all published FAQs - matches your backend's published FAQ endpoint
 * Expected: GET /api/v1/faq/published
 */
export async function getPublishedFAQs(): Promise<FAQ[]> {
	try {
		const response = await fetch(buildApiUrl('/faq/published'));

		if (!response.ok) {
			throw new Error(`Failed to fetch published FAQs: ${response.status} ${response.statusText}`);
		}

		const data = await response.json();

		// Handle both direct array response and wrapped response
		return Array.isArray(data) ? data : data.httpResponseData?.faqs || data || [];
	} catch (error) {
		console.error('Error fetching published FAQs:', error);
		throw error;
	}
}

/**
 * Get FAQ by ID - mirrors FAQController endpoint
 * Expected: GET /api/v1/faq/{id}
 */
export async function getFAQById(id: number): Promise<FAQ> {
	try {
		const response = await fetch(buildApiUrl(`/faq/${id}`));

		if (!response.ok) {
			throw new Error(`Failed to fetch FAQ ${id}: ${response.status} ${response.statusText}`);
		}

		const data = await response.json();
		return data.httpResponseData?.faq || data;
	} catch (error) {
		console.error(`Error fetching FAQ ${id}:`, error);
		throw error;
	}
}

/**
 * Get FAQ by UUID - mirrors FAQController endpoint
 * Expected: GET /api/v1/faq/uuid/{uuid}
 */
export async function getFAQByUUID(uuid: string): Promise<FAQ> {
	try {
		const response = await fetch(buildApiUrl(`/faq/uuid/${uuid}`));

		if (!response.ok) {
			throw new Error(`Failed to fetch FAQ ${uuid}: ${response.status} ${response.statusText}`);
		}

		const data = await response.json();
		return data.httpResponseData?.faq || data;
	} catch (error) {
		console.error(`Error fetching FAQ ${uuid}:`, error);
		throw error;
	}
}

/**
 * Get FAQ by slug - mirrors FAQController endpoint
 * Expected: GET /api/v1/faq/slug/{slug}
 */
export async function getFAQBySlug(slug: string): Promise<FAQ> {
	try {
		const response = await fetch(buildApiUrl(`/faq/slug/${slug}`));

		if (!response.ok) {
			throw new Error(`Failed to fetch FAQ with slug ${slug}: ${response.status} ${response.statusText}`);
		}

		const data = await response.json();
		return data.httpResponseData?.faq || data;
	} catch (error) {
		console.error(`Error fetching FAQ with slug ${slug}:`, error);
		throw error;
	}
}

/**
 * Search FAQs - mirrors FAQController search endpoint
 * Expected: GET /api/v1/faq/search?q={query}
 */
export async function searchFAQs(query: string, publishedOnly: boolean = true): Promise<FAQ[]> {
	try {
		const params = new URLSearchParams({
			q: query,
			publishedOnly: publishedOnly.toString()
		});
		const response = await fetch(buildApiUrl(`/faq/search?${params}`));

		if (!response.ok) {
			throw new Error(`Failed to search FAQs: ${response.status} ${response.statusText}`);
		}

		const data = await response.json();
		return Array.isArray(data) ? data : data.httpResponseData?.faqs || data || [];
	} catch (error) {
		console.error('Error searching FAQs:', error);
		throw error;
	}
}

/**
 * Get FAQs by category ID - mirrors FAQController endpoint
 * Expected: GET /api/v1/faq/category/{categoryId}
 */
export async function getFAQsByCategory(categoryId: number, publishedOnly: boolean = true): Promise<FAQ[]> {
	try {
		const params = new URLSearchParams({
			publishedOnly: publishedOnly.toString()
		});
		const response = await fetch(buildApiUrl(`/faq/category/${categoryId}?${params}`));

		if (!response.ok) {
			throw new Error(`Failed to fetch FAQs for category ${categoryId}: ${response.status} ${response.statusText}`);
		}

		const data = await response.json();
		return Array.isArray(data) ? data : data.httpResponseData?.faqs || data || [];
	} catch (error) {
		console.error(`Error fetching FAQs for category ${categoryId}:`, error);
		throw error;
	}
}

/**
 * Get FAQs by category slug - mirrors FAQController endpoint
 * Expected: GET /api/v1/faq/category/slug/{slug}
 */
export async function getFAQsByCategorySlug(slug: string, publishedOnly: boolean = true): Promise<FAQ[]> {
	try {
		const params = new URLSearchParams({
			publishedOnly: publishedOnly.toString()
		});
		const response = await fetch(buildApiUrl(`/faq/category/slug/${slug}?${params}`));

		if (!response.ok) {
			throw new Error(`Failed to fetch FAQs for category slug ${slug}: ${response.status} ${response.statusText}`);
		}

		const data = await response.json();
		return Array.isArray(data) ? data : data.httpResponseData?.faqs || data || [];
	} catch (error) {
		console.error(`Error fetching FAQs for category slug ${slug}:`, error);
		throw error;
	}
}

/**
 * Get featured FAQs - mirrors FAQController endpoint
 * Expected: GET /api/v1/faq/featured
 */
export async function getFeaturedFAQs(): Promise<FAQ[]> {
	try {
		const response = await fetch(buildApiUrl('/faq/featured'));

		if (!response.ok) {
			throw new Error(`Failed to fetch featured FAQs: ${response.status} ${response.statusText}`);
		}

		const data = await response.json();
		return Array.isArray(data) ? data : data.httpResponseData?.faqs || data || [];
	} catch (error) {
		console.error('Error fetching featured FAQs:', error);
		throw error;
	}
}

/**
 * Get popular FAQs - mirrors FAQController endpoint
 * Expected: GET /api/v1/faq/popular
 */
export async function getPopularFAQs(limit: number = 10): Promise<FAQ[]> {
	try {
		const params = new URLSearchParams({ limit: limit.toString() });
		const response = await fetch(buildApiUrl(`/faq/popular?${params}`));

		if (!response.ok) {
			throw new Error(`Failed to fetch popular FAQs: ${response.status} ${response.statusText}`);
		}

		const data = await response.json();
		return Array.isArray(data) ? data : data.httpResponseData?.faqs || data || [];
	} catch (error) {
		console.error('Error fetching popular FAQs:', error);
		throw error;
	}
}

/**
 * Increment FAQ view count - mirrors FAQController endpoint
 * Expected: POST /api/v1/faq/{id}/view
 */
export async function incrementFAQViewCount(id: number): Promise<void> {
	try {
		const response = await fetch(buildApiUrl(`/faq/${id}/view`), {
			method: 'POST'
		});

		if (!response.ok) {
			throw new Error(`Failed to increment view count for FAQ ${id}: ${response.status} ${response.statusText}`);
		}
	} catch (error) {
		console.error(`Error incrementing view count for FAQ ${id}:`, error);
		// Don't throw error for analytics - fail silently
	}
}

/**
 * Vote on FAQ helpfulness - mirrors FAQController endpoint
 * Expected: POST /api/v1/faq/{id}/vote
 */
export async function voteFAQHelpfulness(id: number, isHelpful: boolean): Promise<void> {
	try {
		const response = await fetch(buildApiUrl(`/faq/${id}/vote`), {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ helpful: isHelpful })
		});

		if (!response.ok) {
			throw new Error(`Failed to vote on FAQ ${id}: ${response.status} ${response.statusText}`);
		}
	} catch (error) {
		console.error(`Error voting on FAQ ${id}:`, error);
		throw error;
	}
}

// =============================================================================
// ADMIN FAQ ENDPOINTS (FAQAdminController.java)
// =============================================================================

/**
 * Admin: Get all FAQs (including drafts) - mirrors FAQAdminController
 * Expected: GET /api/v1/faq-admin
 */
export async function getAllFAQs(): Promise<FAQ[]> {
	try {
		const response = await fetch(buildApiUrl('/faq-admin'));

		if (!response.ok) {
			throw new Error(`Failed to fetch all FAQs: ${response.status} ${response.statusText}`);
		}

		const data = await response.json();
		return Array.isArray(data) ? data : data.httpResponseData?.faqs || data || [];
	} catch (error) {
		console.error('Error fetching all FAQs:', error);
		throw error;
	}
}

/**
 * Admin: Create FAQ - mirrors FAQAdminController
 * Expected: POST /api/v1/faq-admin
 */
export async function createFAQ(faq: CreateFAQDTO): Promise<FAQ> {
	try {
		const response = await fetch(buildApiUrl('/faq-admin'), {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(faq)
		});

		if (!response.ok) {
			throw new Error(`Failed to create FAQ: ${response.status} ${response.statusText}`);
		}

		const data = await response.json();
		return data.httpResponseData?.faq || data;
	} catch (error) {
		console.error('Error creating FAQ:', error);
		throw error;
	}
}

/**
 * Admin: Update FAQ - mirrors FAQAdminController
 * Expected: PUT /api/v1/faq-admin/{id}
 */
export async function updateFAQ(id: number, faq: UpdateFAQDTO): Promise<FAQ> {
	try {
		const response = await fetch(buildApiUrl(`/faq-admin/${id}`), {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(faq)
		});

		if (!response.ok) {
			throw new Error(`Failed to update FAQ ${id}: ${response.status} ${response.statusText}`);
		}

		const data = await response.json();
		return data.httpResponseData?.faq || data;
	} catch (error) {
		console.error(`Error updating FAQ ${id}:`, error);
		throw error;
	}
}

/**
 * Admin: Delete FAQ - mirrors FAQAdminController
 * Expected: DELETE /api/v1/faq-admin/{id}
 */
export async function deleteFAQ(id: number): Promise<void> {
	try {
		const response = await fetch(buildApiUrl(`/faq-admin/${id}`), {
			method: 'DELETE'
		});

		if (!response.ok) {
			throw new Error(`Failed to delete FAQ ${id}: ${response.status} ${response.statusText}`);
		}
	} catch (error) {
		console.error(`Error deleting FAQ ${id}:`, error);
		throw error;
	}
}