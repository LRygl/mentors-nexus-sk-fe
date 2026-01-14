// Frequently asked Questions entity mapped from BE

import type { BaseEntity, PaginationParams } from '$lib/types/common';
import type { FAQStatus } from '$lib/types/enums/faqStatus';
import type { FAQPriority } from '$lib/types/enums/faqPriority';
import type { FAQCategory } from '$lib/types/entities/faqCategory';

export interface FAQ extends BaseEntity {
	id: string;
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

	// Computed Fields from Spring Boot
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

export interface FAQCreateFormData {
	question: string;
	answer: string;
	categoryId?: number;
	isPublished: boolean;
	isFeatured: boolean;
}

export interface FAQLinkData {
	faqUuid: string;
	categoryUuid: string;
}


export interface FAQLinkFormData {
	faqId: string;
	faqUuid: string;
}

