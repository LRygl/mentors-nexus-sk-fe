import type { FAQ } from '$lib/types/entities/faq';
import type { FAQCategory } from '$lib/types/entities/faqCategory';
import {
	defineEntitySchema,
	type EntityFieldConfig,
	type EntityGroupConfig
} from './FormSchemaFactory';

/**
 * FAQ Field Definitions
 * Define once, use in all form variants
 */
export function createFAQFields(categories: FAQCategory[] = []): EntityFieldConfig[] {
	const categoryOptions = [
		{ label: 'Select a category...', value: '', disabled: true },
		...categories.map(cat => ({
			label: cat.name,
			value: cat.id,
			icon: cat.iconClass,
			color: cat.colorCode
		}))
	];

	return [
		// Content fields
		{
			name: 'question',
			label: 'Question',
			type: 'text',
			group: 'content',
			variants: { quick: true, standard: true, detailed: true, edit: true },
			required: true,
			minLength: 10,
			maxLength: 200,
			placeholder: 'What would you like to know?',
			helpText: 'Keep it clear and concise',
			colSpan: 2
		},
		{
			name: 'answer',
			label: 'Answer',
			type: 'textarea',
			group: 'content',
			variants: { quick: true, standard: true, detailed: true, edit: true },
			required: true,
			minLength: 20,
			maxLength: 2000,
			rows: 6,
			placeholder: 'Provide a comprehensive answer...',
			helpText: 'Give detailed instructions',
			colSpan: 2
		},

		// Publishing fields
		{
			name: 'isPublished',
			label: 'Published',
			type: 'checkbox',
			group: 'publishing',
			variants: { quick: true, standard: true, detailed: true, edit: true },
			helpText: 'Make this FAQ visible to users',
			defaultValue: false,
			colSpan: 1
		},
		{
			name: 'isFeatured',
			label: 'Featured',
			type: 'checkbox',
			group: 'publishing',
			variants: { standard: true, detailed: true, edit: true },
			helpText: 'Show in featured sections',
			defaultValue: false,
			colSpan: 1
		},

		// Category (conditional on isPublished)
		{
			name: 'categoryId',
			label: 'Category',
			type: 'select',
			group: 'category',
			variants: {
				quick: true,
				standard: true,
				detailed: true,
				edit: true,
			},
			options: categoryOptions,
			searchable: true,
			placeholder: 'Choose a category',
			helpText: 'Required when publishing',
			colSpan: 2,
			dependencies: [{ field: 'isPublished', condition: 'truthy' }],
			conditionalValidation: [{
				when: { field: 'isPublished', condition: 'truthy' },
				rules: [{
					type: 'required',
					message: 'Category required when publishing'
				}]
			}]
		},

		// Add more fields as needed...
	];
}

/**
 * FAQ Group Definitions
 */
const faqGroups: EntityGroupConfig[] = [
	{
		id: 'content',
		title: 'Content',
		description: 'Question and answer content',
		icon: '📝',
		variant: 'card',
		variants: { quick: true, standard: true, detailed: true, edit: true }
	},
	{
		id: 'publishing',
		title: 'Publishing',
		description: 'Publication settings',
		icon: '🚀',
		variant: 'card',
		collapsible: true,
		collapsed: false,
		variants: { quick: false, standard: true, detailed: true, edit: true }
	},
	{
		id: 'category',
		title: 'Category',
		description: 'FAQ Category',
		icon: '🚀',
		variant: 'card',
		collapsible: true,
		collapsed: false,
		variants: { quick: false, standard: true, detailed: true, edit: true }
	}
];

/**
 * Create FAQ Schema Factory
 */
export function createFAQSchemaFactory(categories: FAQCategory[] = []) {
	return defineEntitySchema<FAQ>({
		entity: 'FAQ',
		fields: createFAQFields(categories),
		groups: faqGroups,
		variantConfig: {
			edit: {
				submitLabel: 'Update FAQ',
				showReset: false,
				showCancel: true
			}
		}
	});
}

/**
 * FAQ Form Presets - Simple API
 */
export const FAQFormPresets = {
	quick: (categories: FAQCategory[] = []) =>
		createFAQSchemaFactory(categories).create('quick'),

	standard: (categories: FAQCategory[] = []) =>
		createFAQSchemaFactory(categories).create('standard'),

	detailed: (categories: FAQCategory[] = []) =>
		createFAQSchemaFactory(categories).create('detailed'),

	edit: (categories: FAQCategory[] = []) =>
		createFAQSchemaFactory(categories).create('edit'),

	link: () =>
		createFAQSchemaFactory().create('link')
};

/**
 * Backward compatibility helper
 */
export function createFAQFormSchema(
	variant: 'quick' | 'standard' | 'detailed' | 'edit' | 'link',
	categories: FAQCategory[] = []
) {
	return createFAQSchemaFactory(categories).create(variant);
}