
import { FAQPriority, FAQStatus } from '$lib/types';
import type { FormContext } from '$lib/types/entities/forms';



export interface FAQFormDataBase {
	question: string;
	answer: string;
}

// Quick form data - minimal Fields needed to create the object
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

	// Content enhancement
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

	// Additional Fields that might be updated
	status?: FAQStatus;
	viewCount?: number;
	helpfulVotes?: number;
	notHelpfulVotes?: number;

	// Audit Fields
	updatedBy?: string;
}

// Utility type for extracting form data based on form type
export type GetFAQFormData<T extends FormContext> =
	T extends 'quick' ? FAQQuickFormData :
		T extends 'standard' ? FAQCreateFormData :
			T extends 'detailed' ? FAQDetailedFormData :
				never;
