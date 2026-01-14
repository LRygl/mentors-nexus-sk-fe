import type { User } from 'lucide-svelte';

export interface BaseEntity {
	id: string;
	uuid: string;
	createdAt: Date;
	updatedAt: Date;
	createdBy: string;
	updatedBy: string;
}

export interface PaginationParams {
	page?: number;
	size?: number;
	sort?: string;
	direction?: 'asc' | 'desc';
}

export interface PaginatedResult<T> {
	content: T[];
	pageable: {
		pageNumber: number;
		pageSize: number;
		sort: {
			sorted: boolean;
			empty: boolean;
			unsorted: boolean;
		};
		offset: number;
		paged: boolean;
		unpaged: boolean;
	};
	last: boolean;
	totalPages: number;
	totalElements: number;
	size: number;
	number: number; // <- This is the current page (0-based) from Spring Boot
	sort: {
		sorted: boolean;
		empty: boolean;
		unsorted: boolean;
	};
	first: boolean;
	numberOfElements: number;
	empty: boolean;

	// Add these aliases for convenience (optional)
	page?: number; // Alias for number
}

export interface ApiError {
	message: string;
	code?: string;
	field?: string;
	timestamp?: string;
}

export interface RequestConfig {
	timeout?: number;
	retries?: number;
	cache?: boolean;
	skipAuth?: boolean;
}