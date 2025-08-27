import type {
	CreateFAQCategoryRequest,
	FAQCategoryFormData
} from '$lib/types/entities/faqCategory';
import { FormBuilder } from '$lib/utils/formBuilder';

// Ultra-simple approach using the entity form pattern
export function createFAQCategoryFormSchema() {
	return FormBuilder.entityForm<FAQCategoryFormData & { iconName: string }>('FAQ Category', {
		name: true,
		description: true,
		displayOrder: true,
		isActive: true,
		isVisible: true,
		color: true,
		icon: true
	});
}

// Custom approach with specific business logic (without title/description for modal use)
export function createCustomFAQCategoryFormSchema() {
	return new FormBuilder<FAQCategoryFormData & { iconName: string }>()
		.layout('two-column')

		// Basic Information
		.group(
			'Basic Information',
			'Basic information about the new category'
		)

		.text('name', 'Category Name', {
			placeholder: 'e.g., Account & Billing',
			required: true,
			minLength: 2,
			maxLength: 50,
			colSpan: 1
		})
		.number('displayOrder', 'Display Order', {
			min: 1,
			max: 999,
			defaultValue: 1,
			helpText: 'Lower numbers appear first',
			colSpan: 1
		})
		.textarea('description', 'Description', {
			placeholder: 'What topics does this category cover?',
			required: true,
			minLength: 10,
			maxLength: 200,
			rows: 3,
			colSpan: 2
		})

		// Visual Design
		.group('Visual Design', 'Make your category stand out')
		.iconSelector('iconName', 'Icon', {
			placeholder: 'Choose an icon...',
			required: true,
			colSpan: 1,
			defaultValue: 'HelpCircle'
		})
		.color('colorCode', 'Brand Color', {
			defaultValue: '#3B82F6',
			colSpan: 1
		})

		// Visibility Settings
		.group('Visibility Settings')
		.checkbox('isActive', 'Active', {
			helpText: 'Category is available for use',
			defaultValue: true,
			colSpan: 1
		})
		.checkbox('isVisible', 'Public Visibility', {
			helpText: 'Show in customer-facing category lists',
			defaultValue: true,
			colSpan: 1
		})

		.build();
}

// Transform form data to API request format
export function transformToCreateRequest(
	formData: FAQCategoryFormData & { iconName: string }
): CreateFAQCategoryRequest & { iconClass: string } {
	return {
		name: formData.name.trim(),
		description: formData.description.trim(),
		colorCode: formData.colorCode,
		iconClass: formData.iconName, // Map iconName to iconClass for backend
		isActive: formData.isActive,
		isVisible: formData.isVisible,
		displayOrder: formData.displayOrder
	};
}

// Example of creating different form variations
export const FAQ_CATEGORY_FORM_VARIATIONS = {

	// Minimal form - only essential fields
	minimal: () => new FormBuilder('Quick Category Setup')
		.group()
		.text('name', 'Name', { required: true, maxLength: 50 })
		.textarea('description', 'Name', { required: true, maxLength: 200 })
		.build(),

	// Admin form - all fields with advanced options
	admin: () => createCustomFAQCategoryFormSchema(),

	// Simple form - standard business fields
	standard: () => FormBuilder.entityForm('FAQ Category'),

	// Bulk edit form - only commonly changed fields
	bulkEdit: () => new FormBuilder('Bulk Edit Categories', 'Update multiple categories at once')
		.group()
		.checkbox('isActive', 'Active Status')
		.checkbox('isVisible', 'Visibility')
		.color('colorCode', 'Color')
		.build()
};

// Helper to get form variation based on user role or context
export function getFAQCategoryFormSchema(variant: 'minimal' | 'standard' | 'admin' | 'bulkEdit' = 'standard') {
	return FAQ_CATEGORY_FORM_VARIATIONS[variant]();
}

// Predefined color options for quick selection
export const QUICK_COLORS = [
	{ name: 'Blue', value: '#3B82F6' },
	{ name: 'Purple', value: '#8B5CF6' },
	{ name: 'Green', value: '#10B981' },
	{ name: 'Red', value: '#EF4444' },
	{ name: 'Orange', value: '#F59E0B' },
	{ name: 'Pink', value: '#EC4899' },
	{ name: 'Indigo', value: '#6366F1' },
	{ name: 'Teal', value: '#14B8A6' }
];

// Example of how to create an edit schema with pre-filled data
export function createEditFAQCategoryFormSchema(
	existingData: Partial<FAQCategoryFormData & { iconClass: string }>
) {
	// Use the same schema as create, but could be customized for editing
	return createCustomFAQCategoryFormSchema();
}