// Frequently asked Questions entity mapped from BE

import type { BaseEntity } from '$lib/types/common';
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
	createdAt: Date;
	updatedAt: Date;
	createdBy?: string;
	updatedBy?: string;

	// Computed fields from Spring Boot
	helpfulnessRatio: number;
	isPopular: boolean;
	fullUrl: string;
	categoryName?: string;
	categorySlug?: string;
}

// Request DTOs for FAQ
export interface CreateFAQRequest {
	question: string;
	answer: string;
	categoryId: string;
	status?: FAQStatus;
	displayOrder?: number;
	isPublished?: boolean;
	isFeatured?: boolean;
	searchKeywords?: string;
	metaDescription?: string;
	priority?: FAQPriority;
}

export interface UpdateFAQRequest {
	question?: string;
	answer?: string;
	categoryId?: string;
	status?: FAQStatus;
	displayOrder?: number;
	isPublished?: boolean;
	isFeatured?: boolean;
	searchKeywords?: string;
	metaDescription?: string;
	priority?: FAQPriority;
}

// Bulk operation DTOs
export interface BulkUpdateFAQStatusRequest {
	ids: string[];
	status: FAQStatus;
}

export interface BulkDeleteFAQRequest {
	ids: string[];
}

export interface ReorderFAQsRequest {
	faqOrders: Array<{
		id: string;
		displayOrder: number;
	}>;
}