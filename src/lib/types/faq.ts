// src/lib/types/faq.ts

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
	faqCount?: number;
	publishedFaqCount?: number;
	createdAt: string;
	updatedAt: string;
	createdBy?: string;
	updatedBy?: string;
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
	// Computed properties
	helpfulnessRatio?: number;
	isPopular?: boolean;
	fullUrl?: string;
	categoryName?: string;
	categorySlug?: string;
}

export enum FAQStatus {
	DRAFT = 'DRAFT',
	REVIEW = 'REVIEW',
	PUBLISHED = 'PUBLISHED',
	ARCHIVED = 'ARCHIVED'
}

export enum FAQPriority {
	LOW = 'LOW',
	NORMAL = 'NORMAL',
	HIGH = 'HIGH',
	URGENT = 'URGENT'
}

export interface FAQSearchParams {
	q?: string;
	category?: string;
	limit?: number;
}

export interface FAQAdminFilters {
	page?: number;
	size?: number;
	status?: FAQStatus;
	categoryUuid?: string;
	priority?: FAQPriority;
	search?: string;
}

export interface FAQCategoryAdminFilters {
	page?: number;
	size?: number;
	isActive?: boolean;
	search?: string;
}

export interface FAQStats {
	totalFAQs: number;
	publishedFAQs: number;
	draftFAQs: number;
	featuredFAQs: number;
	totalViews: number;
	totalHelpfulVotes: number;
	mostViewedFAQs: FAQ[];
	mostHelpfulFAQs: FAQ[];
	faqsByCategory: CategoryFAQCount[];
}

export interface CategoryFAQCount {
	categoryName: string;
	categorySlug: string;
	totalFAQs: number;
	publishedFAQs: number;
}

export interface CategoryStats {
	totalActiveCategories: number;
	mostPopularCategories: FAQCategory[];
}

export interface FAQFormData {
	question: string;
	answer: string;
	categoryUuid: string;
	searchKeywords?: string;
	metaDescription?: string;
	priority: FAQPriority;
	isFeatured: boolean;
}

export interface FAQCategoryFormData {
	name: string;
	description?: string;
	iconClass?: string;
	colorCode?: string;
	isVisible: boolean;
	metaDescription?: string;
	metaKeywords?: string;
}

// API Response types
export interface PaginatedResponse<T> {
	content: T[];
	totalElements: number;
	totalPages: number;
	size: number;
	number: number;
	first: boolean;
	last: boolean;
	numberOfElements: number;
}

export interface APIResponse<T> {
	data?: T;
	message?: string;
	success: boolean;
	error?: string;
}

// Status display helpers
export const FAQStatusLabels: Record<FAQStatus, string> = {
	[FAQStatus.DRAFT]: 'Draft',
	[FAQStatus.REVIEW]: 'Under Review',
	[FAQStatus.PUBLISHED]: 'Published',
	[FAQStatus.ARCHIVED]: 'Archived'
};

export const FAQPriorityLabels: Record<FAQPriority, string> = {
	[FAQPriority.LOW]: 'Low Priority',
	[FAQPriority.NORMAL]: 'Normal Priority',
	[FAQPriority.HIGH]: 'High Priority',
	[FAQPriority.URGENT]: 'Urgent'
};

export const FAQStatusColors: Record<FAQStatus, string> = {
	[FAQStatus.DRAFT]: 'bg-gray-100 text-gray-800',
	[FAQStatus.REVIEW]: 'bg-yellow-100 text-yellow-800',
	[FAQStatus.PUBLISHED]: 'bg-green-100 text-green-800',
	[FAQStatus.ARCHIVED]: 'bg-red-100 text-red-800'
};

export const FAQPriorityColors: Record<FAQPriority, string> = {
	[FAQPriority.LOW]: 'bg-blue-100 text-blue-800',
	[FAQPriority.NORMAL]: 'bg-gray-100 text-gray-800',
	[FAQPriority.HIGH]: 'bg-orange-100 text-orange-800',
	[FAQPriority.URGENT]: 'bg-red-100 text-red-800'
};