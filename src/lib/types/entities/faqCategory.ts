import type { BaseEntity, PaginationParams } from '$lib/types/common';
import type { Component } from 'svelte';
import type { FAQPriority, FAQStatus } from '$lib/types';

export interface FAQCategory extends BaseEntity {
	id: string;
	uuid: string;
	name: string;
	description?: string;
	slug: string;
	iconClass: Component;
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
}