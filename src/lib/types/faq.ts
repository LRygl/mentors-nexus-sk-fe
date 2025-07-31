// src/lib/types/faq.ts

export enum FAQStatus {
	DRAFT = 'DRAFT',
	PUBLISHED = 'PUBLISHED',
	ARCHIVED = 'ARCHIVED'
}

export enum FAQPriority {
	LOW = 'LOW',
	NORMAL = 'NORMAL',
	HIGH = 'HIGH',
	URGENT = 'URGENT'
}

export interface FAQ {
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
	// Computed properties from backend
	helpfulnessRatio?: number;
	isPopular?: boolean;
	fullUrl?: string;
	categoryName?: string;
	categorySlug?: string;
}

export interface FAQCategory {
	id: number;
	uuid: string;
	name: string;
	description?: string;
	slug: string;
	iconClass?: string;
	colorCode?: string;
	displayOrder: number;
	isActive: boolean;
	isVisible: boolean;
	metaDescription?: string;
	metaKeywords?: string;
	// Computed fields
	faqCount?: number;
	publishedFaqCount?: number;
	createdAt: string;
	updatedAt: string;
	createdBy?: string;
	updatedBy?: string;
	// Helper computed properties
	fullUrl?: string;
}

// API Response types
export interface FAQSearchParams {
	q?: string;
	category?: string;
}

export interface FAQVoteRequest {
	helpful: boolean;
}

// Store state interfaces
export interface FAQStoreState {
	// Data
	faqs: FAQ[];
	categories: FAQCategory[];
	featuredFAQs: FAQ[];
	popularFAQs: FAQ[];

	// UI State
	loading: boolean;
	error: string | null;
	searchQuery: string;
	selectedCategorySlug: string;
	expandedItems: Set<string>;

	// Computed
	filteredFAQs: FAQ[];
	visibleCategories: FAQCategory[];
	showClearButton: boolean;
	popularSearches: string[];
}