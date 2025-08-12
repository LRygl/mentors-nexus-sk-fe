import type { BaseEntity, PaginationParams } from '$lib/types/common';
import type { Component } from 'svelte';
import type { FAQPriority, FAQStatus } from '$lib/types';

export interface FAQCategory extends BaseEntity {
	id: string;
	uuid: string;
	name: string;
	description?: string;
	slug: string;
	iconClass: string;
	colorCode: string;
	displayOrder: number;
	isActive: boolean;
	isVisible: boolean;
	createdAt: Date;
	updatedAt: Date;

	// Computed fields
	faqCount?: number;           // Number of FAQs in this category
	publishedFaqCount?: number;  // Number of published FAQs
}

export interface FAQCategoryPaginationParams extends PaginationParams {
	search?: string;
	isActive?: boolean;
	isVisible?: boolean;
	sortBy?: 'name' | 'displayOrder' | 'createdAt' | 'faqCount';
	sortDirection?: 'asc' | 'desc';
}

// Request types for API operations
export interface CreateFAQCategoryRequest {
	name: string;
	description: string;
	colorCode: string;
	isActive: boolean;
	isVisible: boolean;
	displayOrder: number;
	slug?: string;              // Optional, can be auto-generated from name
	iconClass?: Component;      // Optional, can have default
}

export interface UpdateFAQCategoryRequest {
	name?: string;
	description?: string;
	colorCode?: string;
	isActive?: boolean;
	isVisible?: boolean;
	displayOrder?: number;
	slug?: string;
	iconClass?: Component;
}

// Response types for API operations
export interface FAQCategoryResponse {
	category: FAQCategory;
	message?: string;
}

export interface FAQCategoryListResponse {
	categories: FAQCategory[];
	totalCount: number;
	message?: string;
}

// Form validation types
export interface FAQCategoryFormData {
	name: string;
	description: string;
	colorCode: string;
	isActive: boolean;
	isVisible: boolean;
	displayOrder: number;
}

export interface FAQCategoryFormErrors {
	name: string;
	description: string;
	colorCode: string;
	displayOrder: string;
}

// Filter and search types
export interface FAQCategoryFilters {
	search?: string;
	isActive?: boolean;
	isVisible?: boolean;
	colorCodes?: string[];      // Filter by specific colors
	displayOrderRange?: {       // Filter by display order range
		min: number;
		max: number;
	};
	dateRange?: {              // Filter by creation date range
		start: Date;
		end: Date;
	};
}

// Sort options
export type FAQCategorySortField = 'name' | 'displayOrder' | 'createdAt' | 'faqCount' | 'updatedAt';
export type SortDirection = 'asc' | 'desc';

export interface FAQCategorySortOptions {
	field: FAQCategorySortField;
	direction: SortDirection;
}

// Bulk operations
export interface BulkFAQCategoryOperation {
	categoryIds: string[];
	operation: 'activate' | 'deactivate' | 'show' | 'hide' | 'delete';
}

export interface BulkUpdateFAQCategoryRequest {
	categoryIds: string[];
	updates: Partial<UpdateFAQCategoryRequest>;
}

// Statistics and analytics
export interface FAQCategoryStats {
	totalCategories: number;
	activeCategories: number;
	visibleCategories: number;
	categoriesWithFAQs: number;
	avgFAQsPerCategory: number;
	mostPopularCategory: FAQCategory;
	leastPopularCategory: FAQCategory;
}

// Export commonly used type unions
export type FAQCategoryStatus = 'active' | 'inactive';
export type FAQCategoryVisibility = 'visible' | 'hidden';


export interface FAQCategoryPaginationParams extends PaginationParams {
	search?: string;
}