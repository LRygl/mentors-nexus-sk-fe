export interface BaseEntity {
	id: string;
	createdAt: Date;
	updatedAt: Date;
}

export interface PaginationParams {
	page?: number;
	size?: number;
	sort?: string;
	direction?: 'asc' | 'desc';
}

export interface PaginatedResult<T> {
	content: T[];
	totalElements: number;
	totalPages: number;
	page: number;
	size: number;
	numberOfElements: number;
	first: boolean;
	last: boolean;
	empty: boolean;
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