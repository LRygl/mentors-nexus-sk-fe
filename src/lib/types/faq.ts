// src/lib/types/faq.ts
// FAQ-specific types matching your Spring Boot FAQ model

import type { FAQCategory } from './faqCategory';

// Enums for FAQ
export enum FAQStatus {
	DRAFT = 'DRAFT',
	PUBLISHED = 'PUBLISHED',
	ARCHIVED = 'ARCHIVED'
}

export enum FAQPriority {
	LOW = 'LOW',
	NORMAL = 'NORMAL',
	HIGH = 'HIGH',
	CRITICAL = 'CRITICAL'
}

// Direct 1:1 mapping with your Spring Boot FAQ model
export interface FAQ {
	id: number;
	uuid: string;
	question: string;
	answer: string;
	category: FAQCategory; // Note: your backend uses 'category', not 'faqCategory'
	status: FAQStatus;
	displayOrder: number;
	isPublished: boolean;
	isFeatured: boolean;
	searchKeywords: string | null;
	metaDescription: string | null;
	slug: string | null;
	viewCount: number;
	helpfulVotes: number;
	notHelpfulVotes: number;
	priority: FAQPriority;
	createdAt: string; // LocalDateTime from backend as string
	updatedAt: string; // LocalDateTime from backend as string
	createdBy: string | null; // UUID as string
	updatedBy: string | null; // UUID as string

	// Computed fields from your backend methods
	helpfulnessRatio?: number;
	isPopular?: boolean;
	fullUrl?: string;
	categoryName?: string;
	categorySlug?: string;
}

// DTO types for FAQ operations
export interface CreateFAQDTO {
	question: string;
	answer: string;
	category: {
		id: number;
	};
	status?: FAQStatus;
	displayOrder?: number;
	isPublished?: boolean;
	isFeatured?: boolean;
	searchKeywords?: string;
	metaDescription?: string;
	priority?: FAQPriority;
}

export interface UpdateFAQDTO {
	question?: string;
	answer?: string;
	category?: {
		id: number;
	};
	status?: FAQStatus;
	displayOrder?: number;
	isPublished?: boolean;
	isFeatured?: boolean;
	searchKeywords?: string;
	metaDescription?: string;
	priority?: FAQPriority;
}

// FAQ-specific response types
export interface FAQResponse {
	httpTimestamp: string;
	httpStatusCode: number;
	httpStatus: string;
	httpStatusReason: string;
	httpStatusMessage: string;
	httpDeveloperMessage?: string;
	httpResponseData?: {
		faq?: FAQ;
		faqs?: FAQ[];
	};
}