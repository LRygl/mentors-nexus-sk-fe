export interface Sort {
	empty: boolean;
	sorted: boolean;
	unsorted: boolean;
}

export interface Pageable {
	pageNumber: number;
	pageSize: number;
	sort: Sort;
	offset: number;
	paged: boolean;
	unpaged: boolean;
}

export interface Page<T> {
	content: T[];
	pageables: Pageable;
	last: boolean;
	totalElements: number;
	totalPages: number;
	first: boolean;
	size: number;
	number: number;
	numberOfElements: number;
	sort: Sort;
	empty: boolean;
}