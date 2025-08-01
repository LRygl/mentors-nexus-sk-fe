// src/lib/api/admin/faqCategoryAdminAPI.ts

import { buildApiUrl } from '$lib/config/api';
import type { FAQCategory } from '$lib/types/faq';

/**
 * Admin-specific FAQ Category API endpoints
 * Extends the public API with admin operations (CRUD)
 */

export interface CreateFAQCategoryRequest {
	name: string;
	description?: string;
	slug: string;
	iconClass?: string;
	colorCode?: string;
	displayOrder: number;
	isActive: boolean;
	isVisible: boolean;
	metaDescription?: string;
	metaKeywords?: string;
}

export interface UpdateFAQCategoryRequest extends CreateFAQCategoryRequest {
	// Inherits all fields from create request
}

export class FAQCategoryAdminAPIService {

	/**
	 * Get all FAQ categories (including inactive ones) for admin management
	 */
	static async getAllCategoriesForAdmin(): Promise<FAQCategory[]> {
		const response = await fetch(buildApiUrl('/admin/faq-category'), {
			method: 'GET',
			headers: { 'Content-Type': 'application/json' }
		});

		if (!response.ok) {
			throw new Error(`Failed to fetch FAQ categories: ${response.status} ${response.statusText}`);
		}

		return response.json();
	}

	/**
	 * Get a single FAQ category by ID for admin editing
	 */
	static async getFAQCategoryById(id: number): Promise<FAQCategory> {
		const response = await fetch(buildApiUrl(`/admin/faq-category/${id}`), {
			method: 'GET',
			headers: { 'Content-Type': 'application/json' }
		});

		if (!response.ok) {
			if (response.status === 404) {
				throw new Error('FAQ Category not found');
			}
			throw new Error(`Failed to fetch FAQ category: ${response.status} ${response.statusText}`);
		}

		return response.json();
	}

	/**
	 * Create a new FAQ category
	 */
	static async createFAQCategory(categoryData: CreateFAQCategoryRequest): Promise<FAQCategory> {
		const response = await fetch(buildApiUrl('/admin/faq-category'), {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(categoryData)
		});

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({}));
			const errorMessage = errorData.message || `Failed to create FAQ category: ${response.status}`;
			throw new Error(errorMessage);
		}

		return response.json();
	}

	/**
	 * Update an existing FAQ category
	 */
	static async updateFAQCategory(id: number, categoryData: UpdateFAQCategoryRequest): Promise<FAQCategory> {
		const response = await fetch(buildApiUrl(`/admin/faq-category/${id}`), {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(categoryData)
		});

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({}));
			const errorMessage = errorData.message || `Failed to update FAQ category: ${response.status}`;
			throw new Error(errorMessage);
		}

		return response.json();
	}

	/**
	 * Delete an FAQ category
	 */
	static async deleteFAQCategory(id: number): Promise<void> {
		const response = await fetch(buildApiUrl(`/admin/faq-category/${id}`), {
			method: 'DELETE',
			headers: { 'Content-Type': 'application/json' }
		});

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({}));
			const errorMessage = errorData.message || `Failed to delete FAQ category: ${response.status}`;
			throw new Error(errorMessage);
		}
	}

	/**
	 * Toggle active status of an FAQ category
	 */
	static async toggleCategoryStatus(id: number, isActive: boolean): Promise<FAQCategory> {
		const response = await fetch(buildApiUrl(`/admin/faq-category/${id}/toggle-status`), {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ isActive })
		});

		if (!response.ok) {
			throw new Error(`Failed to toggle category status: ${response.status}`);
		}

		return response.json();
	}

	/**
	 * Update display order of categories (bulk operation)
	 */
	static async updateDisplayOrders(orderUpdates: { id: number; displayOrder: number }[]): Promise<void> {
		const response = await fetch(buildApiUrl('/admin/faq-category/update-orders'), {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ orderUpdates })
		});

		if (!response.ok) {
			throw new Error(`Failed to update display orders: ${response.status}`);
		}
	}

	/**
	 * Get category analytics (FAQ counts, popular metrics, etc.)
	 */
	static async getCategoryAnalytics(): Promise<{
		totalCategories: number;
		activeCategories: number;
		categoriesWithFAQs: number;
		averageFAQsPerCategory: number;
		topCategories: FAQCategory[];
	}> {
		const response = await fetch(buildApiUrl('/admin/faq-category/analytics'));

		if (!response.ok) {
			throw new Error(`Failed to fetch category analytics: ${response.status}`);
		}

		return response.json();
	}

	/**
	 * Validate slug uniqueness
	 */
	static async validateSlug(slug: string, excludeId?: number): Promise<{ isValid: boolean; suggestion?: string }> {
		const params = new URLSearchParams({ slug });
		if (excludeId) {
			params.append('excludeId', excludeId.toString());
		}

		const response = await fetch(buildApiUrl(`/admin/faq-category/validate-slug?${params}`));

		if (!response.ok) {
			throw new Error(`Failed to validate slug: ${response.status}`);
		}

		return response.json();
	}

	/**
	 * Generate slug from name
	 */
	static async generateSlug(name: string): Promise<{ slug: string }> {
		const response = await fetch(buildApiUrl('/admin/faq-category/generate-slug'), {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ name })
		});

		if (!response.ok) {
			throw new Error(`Failed to generate slug: ${response.status}`);
		}

		return response.json();
	}
}