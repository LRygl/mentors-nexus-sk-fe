import type { BaseEntity, PaginationParams } from '$lib/types/common';
import type { Component } from 'svelte';
import type { FAQ } from '$lib/types';

export interface FAQCategory extends BaseEntity {
	id: string;
	uuid: string;
	name: string;
	description: string;
	slug: string;
	iconClass: string;
	colorCode: string;
	displayOrder: number;
	isActive: boolean;
	isVisible: boolean;
	createdAt: Date;
	updatedAt: Date;
	metaDescription: string;
	metaKeywords: string;
	// Computed Fields
	faqCount?: number;           // Number of FAQs in this category
	publishedFaqCount?: number;  // Number of published FAQs
	faqs?: FAQ[];
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



// Form validation types
export interface FAQCategoryFormData {
	name: string;
	description: string;
	colorCode: string;
	isActive: boolean;
	isVisible: boolean;
	displayOrder: number;
}






export interface FAQCategoryPaginationParams extends PaginationParams {
	search?: string;
}