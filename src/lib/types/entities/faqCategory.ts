import type { BaseEntity } from '$lib/types/common';

export interface FAQCategory extends BaseEntity {
	id: string;
	uuid: string;
	name: string;
	slug: string;
	description?: string;
	displayOrder: number;
	isVisible: boolean;
	createdAt: Date;
	updatedAt: Date;

	// Computed fields
	faqCount?: number;           // Number of FAQs in this category
	publishedFaqCount?: number;  // Number of published FAQs
}

// Request DTOs for FAQ Category
export interface CreateFAQCategoryRequest {
	name: string;
	description?: string;
	displayOrder?: number;
	isVisible?: boolean;
}

export interface UpdateFAQCategoryRequest {
	name?: string;
	description?: string;
	displayOrder?: number;
	isVisible?: boolean;
}