import type { FAQCategory } from '$lib/types/entities/faqCategory';
import {
	defineEntitySchema,
	type EntityFieldConfig,
	type EntityGroupConfig
} from './FormSchemaFactory';

/**
 * Predefined color options for category selection
 */
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

/**
 * FAQ Category Field Definitions
 * Define once, use in all form variants
 */
export function createFAQCategoryFields(): EntityFieldConfig[] {
	return [
		// Basic fields
		{
			name: 'name',
			label: 'Category Name',
			type: 'text',
			group: 'content',
			variants: { quick: true, standard: true, detailed: true, edit: true },
			required: true,
			minLength: 5,
			maxLength: 50,
			placeholder: 'Category Name',
			helpText: 'Make the name captivating and simple',
			colSpan: 2
		},
		{
			name: 'description',
			label: 'Description',
			type: 'textarea',
			group: 'content',
			variants: { quick: true, standard: true, detailed: true, edit: true },
			required: true,
			minLength: 5,
			maxLength: 500,
			rows: 4,
			placeholder: 'Describe this category...',
			helpText: 'Brief description of what this category covers',
			colSpan: 2
		},

		// Appearance fields (for standard and detailed)
		{
			name: 'colorCode',
			label: 'Color',
			type: 'color',
			group: 'appearance',
			variants: { standard: true, detailed: true, edit: true },
			options: QUICK_COLORS.map(color => ({
				label: color.name,
				value: color.value,
				color: color.value
			})),
			defaultValue: QUICK_COLORS[0].value,
			helpText: 'Choose a color for this category',
			colSpan: 1
		},
		{
			name: 'iconClass',
			label: 'Icon',
			type: 'icon',
			group: 'appearance',
			variants: { standard: true, detailed: true, edit: true },
			placeholder: 'Select an icon...',
			helpText: 'Icon to represent this category',
			colSpan: 1
		},

		// Publishing fields (for detailed)
		{
			name: 'isActive',
			label: 'Active',
			type: 'checkbox',
			group: 'publishing',
			variants: { detailed: true, edit: true },
			helpText: 'Make this category visible',
			defaultValue: true,
			colSpan: 1
		},
		{
			name: 'displayOrder',
			label: 'Display Order',
			type: 'number',
			group: 'publishing',
			variants: { detailed: true, edit: true },
			min: 0,
			defaultValue: 0,
			helpText: 'Lower numbers appear first',
			colSpan: 1
		}
	];
}

/**
 * FAQ Category Group Definitions
 */
const faqCategoryGroups: EntityGroupConfig[] = [
	{
		id: 'content',
		title: 'Category Details',
		description: 'Basic category information',
		icon: '📁',
		variant: 'card',
		variants: { quick: true, standard: true, detailed: true, edit: true }
	},
	{
		id: 'appearance',
		title: 'Appearance',
		description: 'Visual customization',
		icon: '🎨',
		variant: 'card',
		collapsible: true,
		collapsed: false,
		variants: { quick: false, standard: true, detailed: true, edit: true }
	},
	{
		id: 'publishing',
		title: 'Publishing Settings',
		description: 'Visibility and ordering',
		icon: '⚙️',
		variant: 'card',
		collapsible: true,
		collapsed: false,
		variants: { quick: false, standard: false, detailed: true, edit: true }
	}
];

/**
 * Create FAQ Category Schema Factory
 */
export function createFAQCategorySchemaFactory() {
	return defineEntitySchema<FAQCategory>({
		entity: 'FAQ Category',
		fields: createFAQCategoryFields(),
		groups: faqCategoryGroups,
		variantConfig: {
			quick: {
				title: 'Create FAQ Category',
				submitLabel: 'Create Category',
				showReset: true,
				showCancel: false
			},
			standard: {
				title: 'Create FAQ Category',
				submitLabel: 'Create Category',
				showReset: true,
				showCancel: false
			},
			detailed: {
				title: 'Create FAQ Category',
				description: 'Create a new category with full customization',
				submitLabel: 'Create Category',
				showReset: true,
				showCancel: false
			},
			edit: {
				title: 'Edit FAQ Category',
				submitLabel: 'Update Category',
				showReset: false,
				showCancel: true
			}
		}
	});
}

/**
 * FAQ Category Form Presets - Simple API
 */
export const FAQCategoryFormPresets = {
	quick: () => createFAQCategorySchemaFactory().create('quick'),

	standard: () => createFAQCategorySchemaFactory().create('standard'),

	detailed: () => createFAQCategorySchemaFactory().create('detailed'),

	edit: () => createFAQCategorySchemaFactory().create('edit')
};

/**
 * Backward compatibility helper
 */
export function createFAQCategoryFormSchema(
	variant: 'quick' | 'standard' | 'detailed' | 'edit'
) {
	return createFAQCategorySchemaFactory().create(variant);
}