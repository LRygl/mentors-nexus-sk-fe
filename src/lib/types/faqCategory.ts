// src/lib/types/faqCategory.ts
// FAQCategory-specific types matching your Spring Boot FAQCategory model

// Direct 1:1 mapping with your Spring Boot FAQCategory model
export interface FAQCategory {
	id: number;
	uuid: string;
	name: string;
	description: string | null;
	slug: string;
	iconClass: string | null;
	colorCode: string | null;
	displayOrder: number;
	isActive: boolean;
	isVisible: boolean;
	metaDescription: string | null;
	metaKeywords: string | null;

	// Transient fields
	faqCount?: number;
	publishedFaqCount?: number;

	// Audit fields
	createdAt: string; // LocalDateTime from backend as string
	updatedAt: string; // LocalDateTime from backend as string
	createdBy: string | null; // UUID as string
	updatedBy: string | null; // UUID as string

	// Computed fields from your backend methods
	displayName?: string;
	fullUrl?: string;
	hasPublishedFAQs?: boolean;
}

// DTO types for FAQ Category operations
export interface CreateFAQCategoryDTO {
	name: string;
	description?: string;
	iconClass?: string;
	colorCode?: string;
	displayOrder?: number;
	isActive?: boolean;
	isVisible?: boolean;
	metaDescription?: string;
	metaKeywords?: string;
}

export interface UpdateFAQCategoryDTO {
	name?: string;
	description?: string;
	iconClass?: string;
	colorCode?: string;
	displayOrder?: number;
	isActive?: boolean;
	isVisible?: boolean;
	metaDescription?: string;
	metaKeywords?: string;
}

// FAQ Category-specific response types
export interface FAQCategoryResponse {
	httpTimestamp: string;
	httpStatusCode: number;
	httpStatus: string;
	httpStatusReason: string;
	httpStatusMessage: string;
	httpDeveloperMessage?: string;
	httpResponseData?: {
		category?: FAQCategory;
		categories?: FAQCategory[];
	};
}