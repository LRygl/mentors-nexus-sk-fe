
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

export class FAQCategoryAdminAPI {

	private static getAuthHeaders(): HeadersInit {
		const adminUuid = localStorage.getItem('adminUuid'); // or from your auth store
		return {
			'Content-Type': 'application/json',
			'X-User-UUID': adminUuid || ''
		};
	}

	static async getAllCategories(filters: FAQCategoryAdminFilters = {}): Promise<PaginatedResponse<FAQCategory>> {
		const searchParams = new URLSearchParams();

		if (filters.page !== undefined) searchParams.append('page', filters.page.toString());
		if (filters.size !== undefined) searchParams.append('size', filters.size.toString());
		if (filters.isActive !== undefined) searchParams.append('isActive', filters.isActive.toString());
		if (filters.search) searchParams.append('search', filters.search);

		const response = await fetch(buildApiUrl(`/admin/faq-category?${searchParams.toString()}`), {
			headers: this.getAuthHeaders()
		});

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		return response.json();
	}

	static async createCategory(categoryData: FAQCategoryFormData): Promise<FAQCategory> {
		const response = await fetch(buildApiUrl('/admin/faq-category'), {
			method: 'POST',
			headers: this.getAuthHeaders(),
			body: JSON.stringify(categoryData)
		});

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		return response.json();
	}

	static async updateCategory(uuid: string, categoryData: FAQCategoryFormData): Promise<FAQCategory> {
		const response = await fetch(buildApiUrl(`/admin/faq-category/${uuid}`), {
			method: 'PUT',
			headers: this.getAuthHeaders(),
			body: JSON.stringify(categoryData)
		});

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		return response.json();
	}

	static async deleteCategory(uuid: string): Promise<void> {
		const response = await fetch(buildApiUrl(`/admin/faq-category/${uuid}`), {
			method: 'DELETE',
			headers: this.getAuthHeaders()
		});

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
	}

	static async activateCategory(uuid: string): Promise<FAQCategory> {
		const response = await fetch(buildApiUrl(`/admin/faq-category/${uuid}/activate`), {
			method: 'PATCH',
			headers: this.getAuthHeaders()
		});

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		return response.json();
	}

	static async deactivateCategory(uuid: string): Promise<FAQCategory> {
		const response = await fetch(buildApiUrl(`/admin/faq-category/${uuid}/deactivate`), {
			method: 'PATCH',
			headers: this.getAuthHeaders()
		});

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		return response.json();
	}

	static async reorderCategories(orderedUuids: string[]): Promise<void> {
		const response = await fetch(buildApiUrl('/admin/faq-category/reorder'), {
			method: 'PUT',
			headers: this.getAuthHeaders(),
			body: JSON.stringify(orderedUuids)
		});

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
	}

	static async validateCategoryName(name: string, excludeUuid?: string): Promise<boolean> {
		const searchParams = new URLSearchParams();
		searchParams.append('name', name);
		if (excludeUuid) searchParams.append('excludeUuid', excludeUuid);

		const response = await fetch(buildApiUrl(`/admin/faq-category/validate/name?${searchParams.toString()}`), {
			headers: this.getAuthHeaders()
		});

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		return response.json();
	}

	static async validateCategorySlug(slug: string, excludeUuid?: string): Promise<boolean> {
		const searchParams = new URLSearchParams();
		searchParams.append('slug', slug);
		if (excludeUuid) searchParams.append('excludeUuid', excludeUuid);

		const response = await fetch(buildApiUrl(`/admin/faq-category/validate/slug?${searchParams.toString()}`), {
			headers: this.getAuthHeaders()
		});

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		return response.json();
	}

	static async getCategoryStats(): Promise<CategoryStats> {
		const response = await fetch(buildApiUrl('/admin/faq-category/analytics/stats'), {
			headers: this.getAuthHeaders()
		});

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		return response.json();
	}
}