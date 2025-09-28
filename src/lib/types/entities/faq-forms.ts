
import { type FAQ, FAQPriority, FAQStatus } from '$lib/types';

// ========================================
// FORM DATA INTERFACES
// ========================================

// Base interface for all FAQ form operations

export interface FAQFormDataBase {
	question: string;
	answer: string;
}

// Quick form data - minimal fields needed to create the object
export interface FAQQuickFormData extends FAQFormDataBase {
	isPublished?: boolean;
}

// Create form data - includes all felds that can be set during FAQ creation
export interface FAQCreateFormData extends FAQFormDataBase {
	// Category association
	faqCategoryId?: string; // Optional initially, required when isPublished==ture

	// Publishing settings
	isPublished?: boolean;
	isFeatured?: boolean;

	// Optional Organization
	searchKeywords?: string;
	metaDescription?: string;

	// Content enhancment
	tags?: string[];

	// Advanced settings (conditional)
	priority?: FAQPriority;
	slug?: string; // Auto-generated if not provided

	// Publishing control
	publishDate?: string; // ISO date string for scheduled publishing
	visibility?: 'public' | 'members' | 'premium';
}

// Detailed form data - comprehensive form with all features
export interface FAQDetailedFormData extends FAQCreateFormData {
	// Extended content
	shortAnswer?: string; // Brief version for lists
	longAnswer?: string; // Extended explanation

	// Advanced SEO
	metaTitle?: string;
	metaKeywords?: string;
	canonicalUrl?: string;

	// Content scheduling
	autoPublishDate?: string;
	autoUnpublishDate?: string;
	reviewDate?: string;

	// Analytics and tracking
	trackingEnabled?: boolean;
	customAnalyticsId?: string;

	// Advanced categorization
	topics?: string[]; // Related topics
	relatedFAQs?: string[]; // IDs of related FAQs
	secondaryCategories?: string[]; // Multiple category support

	// Content management
	contentWarning?: string;
	requiresUpdate?: boolean;
	lastReviewedBy?: string;

	// Multi-language support (future)
	language?: string;
	translationKeys?: Record<string, string>;

	// File attachments
	attachments?: File[];
}

// Update form data - for editing existing FAQs
export interface FAQUpdateFormData extends Partial<FAQCreateFormData> {
	id: string; // Required for updates

	// Additional fields that might be updated
	status?: FAQStatus;
	viewCount?: number;
	helpfulVotes?: number;
	notHelpfulVotes?: number;

	// Audit fields
	updatedBy?: string;
}

// ========================================
// FORM CONFIGURATION TYPES
// ========================================

export type FAQFormType = 'quick' | 'standard' | 'detailed';

export interface FAQFormConfig {
	type: FAQFormType;
	title: string;
	description: string;
	dataInterface: 'FAQQuickFormData' | 'FAQCreateFormData' | 'FAQDetailedFormData';
	requiredFields: string[];
	conditionalFields: Record<string, string[]>;
	defaultLayout: 'single' | 'two-column' | 'three-column';
	estimatedTime: string; // How long it takes to fill out
}

// ========================================
// FORM STATE AND VALIDATION
// ========================================

export interface FAQFormState<T = FAQCreateFormData> {
	// Current form data
	data: T;

	// UI state
	showAdvancedOptions: boolean;
	showScheduling: boolean;
	showSEOSettings: boolean;

	// Dependencies
	availableCategories: Array<{ id: string; name: string; description?: string }>;
	availableTags: string[];
	relatedFAQs: Array<{ id: string; question: string }>;

	// Validation state
	isValid: boolean;
	errors: Record<string, string>;
	touched: Record<string, boolean>;

	// Async operations
	isSubmitting: boolean;
	isSavingDraft: boolean;
	isValidatingSlug: boolean;
	isLoadingCategories: boolean;
}

export interface FAQFormValidationSchema {
	quick: {
		required: Array<keyof FAQQuickFormData>;
		conditional: Record<string, Array<keyof FAQQuickFormData>>;
	};
	standard: {
		required: Array<keyof FAQCreateFormData>;
		conditional: Record<string, Array<keyof FAQCreateFormData>>;
	};
	detailed: {
		required: Array<keyof FAQDetailedFormData>;
		conditional: Record<string, Array<keyof FAQDetailedFormData>>;
	};
}

// ========================================
// API INTERACTION TYPES
// ========================================

export interface FAQFormSubmission<T = FAQCreateFormData> {
	data: T;
	metadata?: {
		formType: FAQFormType;
		source: 'admin' | 'api' | 'import' | 'bulk';
		timestamp: string;
		userAgent?: string;
		draft?: boolean; // Is this a draft save?
	};
}

export interface FAQCreateResponse {
	success: boolean;
	data?: {
		id: string;
		uuid: string;
		slug: string;
		fullUrl: string;
		status: FAQStatus;
	};
	errors?: Record<string, string>;
	message?: string;
	warnings?: string[]; // Non-fatal issues
}

export interface FAQUpdateResponse extends FAQCreateResponse {
	data?: FAQCreateResponse['data'] & {
		updatedAt: string;
		version: number;
		previousValues?: Partial<FAQ>; // For audit trail
	};
}

// ========================================
// UTILITY TYPES AND CONSTANTS
// ========================================

// Utility type for extracting form data based on form type
export type GetFAQFormData<T extends FAQFormType> =
	T extends 'quick' ? FAQQuickFormData :
		T extends 'standard' ? FAQCreateFormData :
			T extends 'detailed' ? FAQDetailedFormData :
				never;

// Form configurations
export const FAQ_FORM_CONFIGS: Record<FAQFormType, FAQFormConfig> = {
	quick: {
		type: 'quick',
		title: 'Quick FAQ',
		description: 'Simple question and answer entry',
		dataInterface: 'FAQQuickFormData',
		requiredFields: ['question', 'answer'],
		conditionalFields: {},
		defaultLayout: 'single',
		estimatedTime: '1-2 minutes'
	},
	standard: {
		type: 'standard',
		title: 'Standard FAQ',
		description: 'Full-featured FAQ with categorization',
		dataInterface: 'FAQCreateFormData',
		requiredFields: ['question', 'answer'],
		conditionalFields: {
			isPublished: ['faqCategoryId']
		},
		defaultLayout: 'two-column',
		estimatedTime: '3-5 minutes'
	},
	detailed: {
		type: 'detailed',
		title: 'Detailed FAQ',
		description: 'Advanced FAQ with all features',
		dataInterface: 'FAQDetailedFormData',
		requiredFields: ['question', 'answer'],
		conditionalFields: {
			isPublished: ['faqCategoryId', 'priority'],
			isFeatured: ['metaDescription'],
			trackingEnabled: ['customAnalyticsId']
		},
		defaultLayout: 'two-column',
		estimatedTime: '5-10 minutes'
	}
};

// Default validation schema
export const FAQ_VALIDATION_SCHEMAS: FAQFormValidationSchema = {
	quick: {
		required: ['question', 'answer'],
		conditional: {}
	},
	standard: {
		required: ['question', 'answer'],
		conditional: {
			isPublished: ['faqCategoryId']
		}
	},
	detailed: {
		required: ['question', 'answer'],
		conditional: {
			isPublished: ['faqCategoryId', 'priority'],
			isFeatured: ['metaDescription'],
			trackingEnabled: ['customAnalyticsId']
		}
	}
};

// ========================================
// UTILITY FUNCTIONS
// ========================================

// Get default form data based on form type
export function getDefaultFAQFormData<T extends FAQFormType>(
	formType: T
): GetFAQFormData<T> {
	const baseData: FAQFormDataBase = {
		question: '',
		answer: ''
	};

	switch (formType) {
		case 'quick':
			return {
				...baseData,
				isPublished: false
			} as GetFAQFormData<T>;

		case 'standard':
			return {
				...baseData,
				isPublished: false,
				isFeatured: false,
				displayOrder: 1,
				searchKeywords: '',
				metaDescription: '',
				tags: [],
				visibility: 'public'
			} as GetFAQFormData<T>;

		case 'detailed':
			return {
				...baseData,
				isPublished: false,
				isFeatured: false,
				displayOrder: 1,
				searchKeywords: '',
				metaDescription: '',
				priority: 'medium' as FAQPriority,
				visibility: 'public',
				tags: [],
				topics: [],
				secondaryCategories: [],
				relatedFAQs: [],
				trackingEnabled: false,
				requiresUpdate: false,
				language: 'en',
				attachments: []
			} as GetFAQFormData<T>;

		default:
			throw new Error(`Unknown form type: ${formType}`);
	}
}

// Convert FAQ entity to form data for editing
export function faqToFormData<T extends FAQFormType>(
	faq: FAQ,
	formType: T
): GetFAQFormData<T> {
	const baseData: FAQFormDataBase = {
		question: faq.question,
		answer: faq.answer
	};

	// Return appropriate data based on form type
	switch (formType) {
		case 'quick':
			return {
				...baseData,
				isPublished: faq.isPublished,
				faqCategoryId: faq.category?.id || ''
			} as GetFAQFormData<T>;

		case 'standard':
			return {
				...baseData,
				isPublished: faq.isPublished,
				isFeatured: faq.isFeatured,
				faqCategoryId: faq.category?.id || '',
				displayOrder: faq.displayOrder,
				searchKeywords: faq.searchKeywords || '',
				metaDescription: faq.metaDescription || '',
				priority: faq.priority,
				slug: faq.slug,
				tags: faq.searchKeywords?.split(',').filter(Boolean) || [],
				visibility: 'public' // Default since it's not in FAQ entity
			} as GetFAQFormData<T>;

		case 'detailed':
			return {
				...baseData,
				isPublished: faq.isPublished,
				isFeatured: faq.isFeatured,
				faqCategoryId: faq.category?.id || '',
				displayOrder: faq.displayOrder,
				searchKeywords: faq.searchKeywords || '',
				metaDescription: faq.metaDescription || '',
				priority: faq.priority,
				slug: faq.slug,
				tags: faq.searchKeywords?.split(',').filter(Boolean) || [],
				topics: [],
				secondaryCategories: [],
				relatedFAQs: [],
				visibility: 'public',
				trackingEnabled: false,
				requiresUpdate: false,
				language: 'en',
				attachments: []
			} as GetFAQFormData<T>;

		default:
			throw new Error(`Unknown form type: ${formType}`);
	}
}

// Form data to API payload conversion
export function formDataToAPIPayload<T extends FAQFormType>(
	formData: GetFAQFormData<T>,
	formType: T
): Partial<FAQ> {
	// Convert form data to what the API expects
	const basePayload: Partial<FAQ> = {
		question: formData.question,
		answer: formData.answer
	};

	// Add common fields for standard and detailed forms
	if (formType !== 'quick') {
		const extendedData = formData as FAQCreateFormData;
		Object.assign(basePayload, {
			isPublished: extendedData.isPublished || false,
			isFeatured: extendedData.isFeatured || false,
			displayOrder: extendedData.displayOrder || 1,
			searchKeywords: Array.isArray(extendedData.tags)
				? extendedData.tags.join(',')
				: extendedData.searchKeywords || '',
			metaDescription: extendedData.metaDescription || '',
			priority: extendedData.priority || 'medium',
			slug: extendedData.slug || ''
		});

		// Add category if selected
		if (extendedData.faqCategoryId) {
			Object.assign(basePayload, {
				categoryId: extendedData.faqCategoryId // Backend might expect categoryId instead of faqCategoryId
			});
		}
	} else {
		// Quick form specific handling
		const quickData = formData as FAQQuickFormData;
		Object.assign(basePayload, {
			isPublished: quickData.isPublished || false,
			isFeatured: false
		});

		if (quickData.faqCategoryId) {
			Object.assign(basePayload, {
				categoryId: quickData.faqCategoryId
			});
		}
	}

	return basePayload;
}