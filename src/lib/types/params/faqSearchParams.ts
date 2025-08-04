import { FAQPriority, FAQStatus, type PaginationParams } from '$lib/types';

export interface FAQSearchParams extends PaginationParams {
	// Filter parameters
	categoryId?: string;
	status?: FAQStatus;
	priority?: FAQPriority;
	isPublished?: boolean;
	isFeatured?: boolean;

	// Search parameters
	search?: string;
	questionSearch?: string;
	answerSearch?: string;

	// Date range filters
	createdAfter?: Date;
}