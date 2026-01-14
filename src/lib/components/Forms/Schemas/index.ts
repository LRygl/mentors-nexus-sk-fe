// ============================================================================
// FAQ FORM SCHEMAS
// ============================================================================

export {
	FAQFormPresets,
	createFAQFormSchema,
	createFAQSchemaFactory
} from './FAQ/FAQFormSchema';

// ============================================================================
// FAQ CATEGORY FORM SCHEMAS
// ============================================================================

export {
	FAQCategoryFormPresets,
	createFAQCategoryFormSchema,
	createFAQCategorySchemaFactory,
	QUICK_COLORS
} from './FAQCategoryFormSchema';

// ============================================================================
// FAQ CATEGORY LINK FORM SCHEMAS
// ============================================================================

export {
	FAQCategoryLinkPresets,
	createFAQCategoryLinkFormSchema,
	createFAQCategoryLinkSchemaFactory
} from './FAQCategoryLinkFormSchema';




export type {
	FAQFormDataBase,
	FAQQuickFormData,
	FAQCreateFormData,
	FAQDetailedFormData,
	FAQUpdateFormData,
	GetFAQFormData
} from '$lib/types/Forms/FAQFormData';

export type {
	FAQCategoryFormDataBase,
	FAQCategoryQuickFormData,
	FAQCategoryStandardFormData,
	GetFAQCategoryFormData
} from '$lib/types/Forms/FAQCategoryFormData';