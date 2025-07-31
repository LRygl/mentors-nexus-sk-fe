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

export class FAQAdminAPI {

	private static getAuthHeaders(): HeadersInit {
		// Get admin UUID from session/store - implement based on your auth system
		const adminUuid = localStorage.getItem('adminUuid'); // or from your auth store
		return {
			'Content-Type': 'application/json',
			'X-User-UUID': adminUuid || ''
		};
	}

	static async getAllFAQs(filters: FAQAdminFilters = {}): Promise<PaginatedResponse<FAQ>> {
		const searchParams = new URLSearchParams();

		if (filters.page !== undefined) searchParams.append('page', filters.page.toString());
		if (filters.size !== undefined) searchParams.append('size', filters.size.toString());
		if (filters.status) searchParams.append('status', filters.status);
		if (filters.categoryUuid) searchParams.append('categoryUuid', filters.categoryUuid);
		if (filters.priority) searchParams.append('priority', filters.priority);
		if (filters.search) searchParams.append('search', filters.search);

		const response = await fetch(buildApiUrl(`/admin/faq?${searchParams.toString()}`), {
			headers: this.getAuthHeaders()
		});

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		return response.json();
	}

	static async getFAQsByCategory(categoryUuid: string, page: number = 0, size: number = 20): Promise<PaginatedResponse<FAQ>> {
		const response = await fetch(buildApiUrl(`/admin/faq/category/${categoryUuid}?page=${page}&size=${size}`), {
			headers: this.getAuthHeaders()
		});

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		return response.json();
	}

	static async createFAQ(faqData: FAQFormData): Promise<FAQ> {
		const response = await fetch(buildApiUrl('/admin/faq'), {
			method: 'POST',
			headers: this.getAuthHeaders(),
			body: JSON.stringify(faqData)
		});

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		return response.json();
	}

	static async updateFAQ(uuid: string, faqData: FAQFormData): Promise<FAQ> {
		const response = await fetch(buildApiUrl(`/admin/faq/${uuid}`), {
			method: 'PUT',
			headers: this.getAuthHeaders(),
			body: JSON.stringify(faqData)
		});

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		return response.json();
	}

	static async deleteFAQ(uuid: string): Promise<void> {
		const response = await fetch(buildApiUrl(`/admin/faq/${uuid}`), {
			method: 'DELETE',
			headers: this.getAuthHeaders()
		});

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
	}

	static async publishFAQ(uuid: string): Promise<FAQ> {
		const response = await fetch(buildApiUrl(`/admin/faq/${uuid}/publish`), {
			method: 'PATCH',
			headers: this.getAuthHeaders()
		});

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		return response.json();
	}

	static async unpublishFAQ(uuid: string): Promise<FAQ> {
		const response = await fetch(buildApiUrl(`/admin/faq/${uuid}/unpublish`), {
			method: 'PATCH',
			headers: this.getAuthHeaders()
		});

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		return response.json();
	}

	static async featureFAQ(uuid: string): Promise<FAQ> {
		const response = await fetch(buildApiUrl(`/admin/faq/${uuid}/feature`), {
			method: 'PATCH',
			headers: this.getAuthHeaders()
		});

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		return response.json();
	}

	static async unfeatureFAQ(uuid: string): Promise<FAQ> {
		const response = await fetch(buildApiUrl(`/admin/faq/${uuid}/unfeature`), {
			method: 'PATCH',
			headers: this.getAuthHeaders()
		});

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		return response.json();
	}

	static async reorderFAQs(orderedUuids: string[]): Promise<void> {
		const response = await fetch(buildApiUrl('/admin/faq/reorder'), {
			method: 'PUT',
			headers: this.getAuthHeaders(),
			body: JSON.stringify(orderedUuids)
		});

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
	}

	static async moveFAQsBetweenCategories(oldCategoryUuid: string, newCategoryUuid: string): Promise<void> {
		const response = await fetch(buildApiUrl(`/admin/faq/category/${oldCategoryUuid}/move/${newCategoryUuid}`), {
			method: 'PUT',
			headers: this.getAuthHeaders()
		});

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
	}

	static async getFAQStats(): Promise<FAQStats> {
		const response = await fetch(buildApiUrl('/admin/faq/analytics/stats'), {
			headers: this.getAuthHeaders()
		});

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		return response.json();
	}

	static async validateFAQSlug(slug: string, categoryUuid: string, excludeUuid?: string): Promise<boolean> {
		const searchParams = new URLSearchParams();
		searchParams.append('slug', slug);
		searchParams.append('categoryUuid', categoryUuid);
		if (excludeUuid) searchParams.append('excludeUuid', excludeUuid);

		const response = await fetch(buildApiUrl(`/admin/faq/validate/slug?${searchParams.toString()}`), {
			headers: this.getAuthHeaders()
		});

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		return response.json();
	}
}