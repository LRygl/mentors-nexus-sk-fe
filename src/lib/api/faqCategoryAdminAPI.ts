// src/lib/api/admin/faqCategoryAdminAPI.ts

import { buildApiUrl } from '$lib/config/api';
import type { FAQCategory } from '$lib/types/faq';
import type { PageResponse, PaginationParams } from '$lib/types/pagination';
import { buildPaginationParams } from '$lib/types/pagination';

/**
 * Query parameters specific to FAQ Category endpoints
 * Extends base pagination params with category-specific filters
 */
export interface CategoryQueryParams extends PaginationParams {
	isActive?: boolean;
	search?: string;
	isVisible?: boolean;
}

/**
 * Request DTOs for FAQ Category operations
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

/**
 * Response DTOs for specific operations
 */
export interface SlugValidationResponse {
	isValid: boolean;
	suggestion?: string;
}

export interface SlugGenerationResponse {
	slug: string;
}

export interface CategoryAnalyticsResponse {
	totalCategories: number;
	activeCategories: number;
	categoriesWithFAQs: number;
	averageFAQsPerCategory: number;
	topCategories: FAQCategory[];
}

/**
 * Admin-specific FAQ Category API Service
 * Handles Spring Boot paginated responses using shared pagination types
 */
export class FAQCategoryAdminAPIService {

	/**
	 * Build query parameters for category endpoints
	 */
	private static buildCategoryQueryParams(params: CategoryQueryParams): URLSearchParams {
		const searchParams = buildPaginationParams(params);

		if (params.isActive !== undefined) {
			searchParams.append('isActive', params.isActive.toString());
		}

		if (params.search && params.search.trim()) {
			searchParams.append('search', params.search.trim());
		}

		if (params.isVisible !== undefined) {
			searchParams.append('isVisible', params.isVisible.toString());
		}

		return searchParams;
	}

	/**
	 * Get all FAQ categories (simplified - returns content array only)
	 * Good for dropdowns, simple lists, etc.
	 */
	static async getAllCategoriesForAdmin(params: CategoryQueryParams = {}): Promise<FAQCategory[]> {
		// Set large page size to get all categories by default
		const queryParams: CategoryQueryParams = {
			page: 0,
			size: 1000, // Large enough to get all categories
			...params
		};

		const searchParams = this.buildCategoryQueryParams(queryParams);
		const url = `${buildApiUrl('/admin/faq-category')}?${searchParams.toString()}`;

		console.log('🌐 Making API call to:', url);

		const response = await fetch(url, {
			method: 'GET',
			headers: { 'Content-Type': 'application/json' }
		});

		if (!response.ok) {
			const errorText = await response.text().catch(() => 'Unknown error');
			console.error('❌ API Error:', response.status, errorText);
			throw new Error(`Failed to fetch FAQ categories: ${response.status} ${response.statusText}`);
		}

		const pageResponse: PageResponse<FAQCategory> = await response.json();
		console.log('✅ Received paginated response:', {
			totalElements: pageResponse.totalElements,
			totalPages: pageResponse.totalPages,
			currentPage: pageResponse.number,
			contentLength: pageResponse.content.length
		});

		// Return just the content array
		return pageResponse.content;
	}

	/**
	 * Get paginated FAQ categories (when you need full pagination info)
	 * Good for data tables with pagination controls
	 */
	static async getPaginatedCategories(params: CategoryQueryParams = {}): Promise<PageResponse<FAQCategory>> {
		const queryParams: CategoryQueryParams = {
			page: 0,
			size: 20,
			...params
		};

		const searchParams = this.buildCategoryQueryParams(queryParams);
		const url = `${buildApiUrl('/admin/faq-category')}?${searchParams.toString()}`;

		console.log('🌐 Making paginated API call to:', url);

		const response = await fetch(url, {
			method: 'GET',
			headers: { 'Content-Type': 'application/json' }
		});

		if (!response.ok) {
			const errorText = await response.text().catch(() => 'Unknown error');
			console.error('❌ API Error:', response.status, errorText);
			throw new Error(`Failed to fetch FAQ categories: ${response.status} ${response.statusText}`);
		}

		const pageResponse: PageResponse<FAQCategory> = await response.json();
		console.log('✅ Received full paginated response:', {
			totalElements: pageResponse.totalElements,
			totalPages: pageResponse.totalPages,
			currentPage: pageResponse.number,
			pageSize: pageResponse.size,
			hasNext: !pageResponse.last,
			hasPrevious: !pageResponse.first
		});

		return pageResponse;
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
	static async getCategoryAnalytics(): Promise<CategoryAnalyticsResponse> {
		const response = await fetch(buildApiUrl('/admin/faq-category/analytics'));

		if (!response.ok) {
			throw new Error(`Failed to fetch category analytics: ${response.status}`);
		}

		return response.json();
	}

	/**
	 * Validate slug uniqueness
	 */
	static async validateSlug(slug: string, excludeId?: number): Promise<SlugValidationResponse> {
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
	static async generateSlug(name: string): Promise<SlugGenerationResponse> {
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