// Frequently asked Questions entity mapped from BE

import type { BaseEntity, PaginationParams } from '$lib/types/common';
import type { FAQStatus } from '$lib/types/enums/faqStatus';
import type { FAQPriority } from '$lib/types/enums/faqPriority';
import type { FAQCategory } from '$lib/types/entities/faqCategory';

export interface FAQ extends BaseEntity {
	id: number;
	uuid: string;
	question: string;
	answer: string;
	category: FAQCategory;
	status: FAQStatus;
	displayOrder: number;
	isPublished: boolean;
	isFeatured: boolean;
	searchKeywords?: string;
	metaDescription?: string;
	slug: string;
	viewCount: number;
	helpfulVotes: number;
	notHelpfulVotes: number;
	priority: FAQPriority;
	createdAt: string;
	updatedAt: string;
	createdBy?: string;
	updatedBy?: string;

	// Computed fields from Spring Boot
	helpfulnessRatio: number;
	isPopular: boolean;
	fullUrl: string;
	categoryName?: string;
	categorySlug?: string;
}

export interface FAQPaginationParams extends PaginationParams {
	status?: FAQStatus;
	categoryUuid?:string;
	priority?: FAQPriority;
	search?: string;
}