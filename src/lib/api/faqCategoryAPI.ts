// src/lib/api/faqCategoryAPI.ts
// FAQ Category-specific API functions mapping to your Spring Boot FAQCategoryController and FAQCategoryAdminController

import { buildApiUrl } from '$lib/config/api';
import type { FAQCategory, CreateFAQCategoryDTO, UpdateFAQCategoryDTO } from '$lib/types/faqCategory';

// =============================================================================
// PUBLIC FAQ CATEGORY ENDPOINTS (FAQCategoryController.java)
// =============================================================================

/**
 * Get all visible FAQ categories - mirrors FAQCategoryController endpoint
 * Expected: GET /api/v1/faq-category/visible
 */
export async function getVisibleFAQCategories(): Promise<FAQCategory[]> {
	try {
		const response = await fetch(buildApiUrl('/faq-category/visible'));

		if (!response.ok) {
			throw new Error(`Failed to fetch visible FAQ categories: ${response.status} ${response.statusText}`);
		}

		const data = await response.json();
		return Array.isArray(data) ? data : data.httpResponseData?.categories || data || [];
	} catch (error) {
		console.error('Error fetching visible FAQ categories:', error);
		throw error;
	}
}

/**
 * Get all FAQ categories - mirrors FAQCategoryController endpoint
 * Expected: GET /api/v1/faq-category
 */
export async function getAllFAQCategories(): Promise<FAQCategory[]> {
	try {
		const response = await fetch(buildApiUrl('/faq-category'));

		if (!response.ok) {
			throw new Error(`Failed to fetch FAQ categories: ${response.status} ${response.statusText}`);
		}

		const data = await response.json();
		return Array.isArray(data) ? data : data.httpResponseData?.categories || data || [];
	} catch (error) {
		console.error('Error fetching FAQ categories:', error);
		throw error;
	}
}

/**
 * Get FAQ category by ID - mirrors FAQCategoryController endpoint
 * Expected: GET /api/v1/faq-category/{id}
 */
export async function getFAQCategoryById(id: number): Promise<FAQCategory> {
	try {
		const response = await fetch(buildApiUrl(`/faq-category/${id}`));

		if (!response.ok) {
			throw new Error(`Failed to fetch FAQ category ${id}: ${response.status} ${response.statusText}`);
		}

		const data = await response.json();
		return data.httpResponseData?.category || data;
	} catch (error) {
		console.error(`Error fetching FAQ category ${id}:`, error);
		throw error;
	}
}

/**
 * Get FAQ category by UUID - mirrors FAQCategoryController endpoint
 * Expected: GET /api/v1/faq-category/uuid/{uuid}
 */
export async function getFAQCategoryByUUID(uuid: string): Promise<FAQCategory> {
	try {
		const response = await fetch(buildApiUrl(`/faq-category/uuid/${uuid}`));

		if (!response.ok) {
			throw new Error(`Failed to fetch FAQ category ${uuid}: ${response.status} ${response.statusText}`);
		}

		const data = await response.json();
		return data.httpResponseData?.category || data;
	} catch (error) {
		console.error(`Error fetching FAQ category ${uuid}:`, error);
		throw error;
	}
}

/**
 * Get FAQ category by slug - mirrors FAQCategoryController endpoint
 * Expected: GET /api/v1/faq-category/slug/{slug}
 */
export async function getFAQCategoryBySlug(slug: string): Promise<FAQCategory> {
	try {
		const response = await fetch(buildApiUrl(`/faq-category/slug/${slug}`));

		if (!response.ok) {
			throw new Error(`Failed to fetch FAQ category with slug ${slug}: ${response.status} ${response.statusText}`);
		}

		const data = await response.json();
		return data.httpResponseData?.category || data;
	} catch (error) {
		console.error(`Error fetching FAQ category with slug ${slug}:`, error);
		throw error;
	}
}

// =============================================================================
// ADMIN FAQ CATEGORY ENDPOINTS (FAQCategoryAdminController.java)
// =============================================================================

/**
 * Admin: Create FAQ Category - mirrors FAQCategoryAdminController
 * Expected: POST /api/v1/faq-category-admin
 */
export async function createFAQCategory(category: CreateFAQCategoryDTO): Promise<FAQCategory> {
	try {
		const response = await fetch(buildApiUrl('/faq-category-admin'), {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(category)
		});

		if (!response.ok) {
			throw new Error(`Failed to create FAQ category: ${response.status} ${response.statusText}`);
		}

		const data = await response.json();
		return data.httpResponseData?.category || data;
	} catch (error) {
		console.error('Error creating FAQ category:', error);
		throw error;
	}
}

/**
 * Admin: Update FAQ Category - mirrors FAQCategoryAdminController
 * Expected: PUT /api/v1/faq-category-admin/{id}
 */
export async function updateFAQCategory(id: number, category: UpdateFAQCategoryDTO): Promise<FAQCategory> {
	try {
		const response = await fetch(buildApiUrl(`/faq-category-admin/${id}`), {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(category)
		});

		if (!response.ok) {
			throw new Error(`Failed to update FAQ category ${id}: ${response.status} ${response.statusText}`);
		}

		const data = await response.json();
		return data.httpResponseData?.category || data;
	} catch (error) {
		console.error(`Error updating FAQ category ${id}:`, error);
		throw error;
	}
}

/**
 * Admin: Delete FAQ Category - mirrors FAQCategoryAdminController
 * Expected: DELETE /api/v1/faq-category-admin/{id}
 */
export async function deleteFAQCategory(id: number): Promise<void> {
	try {
		const response = await fetch(buildApiUrl(`/faq-category-admin/${id}`), {
			method: 'DELETE'
		});

		if (!response.ok) {
			throw new Error(`Failed to delete FAQ category ${id}: ${response.status} ${response.statusText}`);
		}
	} catch (error) {
		console.error(`Error deleting FAQ category ${id}:`, error);
		throw error;
	}
}

/**
 * Admin: Get all FAQ categories (including inactive ones) - mirrors FAQCategoryAdminController
 * Expected: GET /api/v1/faq-category-admin
 */
export async function getAllFAQCategoriesAdmin(): Promise<FAQCategory[]> {
	try {
		const response = await fetch(buildApiUrl('/faq-category-admin'));

		if (!response.ok) {
			throw new Error(`Failed to fetch all FAQ categories: ${response.status} ${response.statusText}`);
		}

		const data = await response.json();
		return Array.isArray(data) ? data : data.httpResponseData?.categories || data || [];
	} catch (error) {
		console.error('Error fetching all FAQ categories:', error);
		throw error;
	}
}

/**
 * Admin: Reorder FAQ categories - mirrors FAQCategoryAdminController
 * Expected: PUT /api/v1/faq-category-admin/reorder
 */
export async function reorderFAQCategories(categoryIds: number[]): Promise<void> {
	try {
		const response = await fetch(buildApiUrl('/faq-category-admin/reorder'), {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(categoryIds)
		});

		if (!response.ok) {
			throw new Error(`Failed to reorder FAQ categories: ${response.status} ${response.statusText}`);
		}
	} catch (error) {
		console.error('Error reordering FAQ categories:', error);
		throw error;
	}
}