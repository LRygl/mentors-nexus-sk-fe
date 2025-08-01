// src/lib/types/pagination.ts

/**
 * Spring Boot Sort configuration
 */
export interface Sort {
	sorted: boolean;
	unsorted: boolean;
	empty: boolean;
}

/**
 * Spring Boot Pageable configuration
 */
export interface Pageable {
	pageNumber: number;
	pageSize: number;
	sort: Sort;
	offset: number;
	paged: boolean;
	unpaged: boolean;
}

/**
 * Spring Boot Page response structure
 * Generic type T represents the content type (e.g., FAQCategory, User, etc.)
 */
export interface PageResponse<T> {
	content: T[];
	pageable: Pageable;
	totalElements: number;
	totalPages: number;
	last: boolean;
	first: boolean;
	size: number;
	number: number;
	sort: Sort;
	numberOfElements: number;
	empty: boolean;
}

/**
 * Simplified pagination info for UI components
 */
export interface PaginationInfo {
	currentPage: number;
	totalPages: number;
	totalElements: number;
	pageSize: number;
	hasNext: boolean;
	hasPrevious: boolean;
	isEmpty: boolean;
}

/**
 * Common query parameters for paginated endpoints
 */
export interface PaginationParams {
	page?: number;
	size?: number;
	sort?: string; // e.g., "name,asc" or "createdAt,desc"
}

/**
 * Utility function to extract pagination info from Spring Boot PageResponse
 */
export const extractPaginationInfo = <T>(pageResponse: PageResponse<T>): PaginationInfo => {
	return {
		currentPage: pageResponse.number,
		totalPages: pageResponse.totalPages,
		totalElements: pageResponse.totalElements,
		pageSize: pageResponse.size,
		hasNext: !pageResponse.last,
		hasPrevious: !pageResponse.first,
		isEmpty: pageResponse.empty
	};
}

/**
 * Helper function to build pagination query parameters
 */
export const buildPaginationParams = (params: PaginationParams): URLSearchParams => {
	const searchParams = new URLSearchParams();

	if (params.page !== undefined) {
		searchParams.append('page', params.page.toString());
	}

	if (params.size !== undefined) {
		searchParams.append('size', params.size.toString());
	}

	if (params.sort && params.sort.trim()) {
		searchParams.append('sort', params.sort.trim());
	}

	return searchParams;
}