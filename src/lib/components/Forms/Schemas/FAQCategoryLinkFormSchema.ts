import type { FAQCategory } from '$lib/types/entities/faqCategory';
import {
	defineEntitySchema,
	type EntityFieldConfig,
	type EntityGroupConfig
} from './FormSchemaFactory';


/**
 * FAQ Category Link Field Definitions
 */
export function createFAQCategoryLinkFields(availableCategories: FAQCategory[] = []): EntityFieldConfig[] {
	const categoryOptions = availableCategories.map(category => ({
		label: category.name,
		value: category.uuid,
		icon: category.iconClass,
		color: category.colorCode
	}));

	return [
		{
			name: 'categoryUuid',
			label: 'Select Category',
			type: 'select',
			variants: { link: true },
			options: [
				{ label: 'Choose a category...', value: '', disabled: true },
				...categoryOptions
			],
			required: true,
			searchable: true,
			helpText: `${availableCategories.length} categor${availableCategories.length === 1 ? 'y' : 'ies'} available`,
			colSpan: 1
		}
	];
}

/**
 * Optional: Groups (if you need them later)
 */
const faqCategoryLinkGroups: EntityGroupConfig[] = [
	// Add groups here if needed in the future
];

/**
 * Create FAQ Category Link Schema Factory
 */
export function createFAQCategoryLinkSchemaFactory(availableCategories: FAQCategory[] = []) {
	return defineEntitySchema({
		entity: 'FAQ Category Link',
		fields: createFAQCategoryLinkFields(availableCategories),
		groups: faqCategoryLinkGroups,
		variantConfig: {
			link: {
				title: 'Link FAQ to Category',
				description: 'Associate this FAQ with a category',
				submitLabel: 'Link to Category',
				showReset: false,
				showCancel: true
			}
		}
	});
}

/**
 * FAQ Category Link Presets - Simple API (consistent naming)
 */
export const FAQCategoryLinkPresets = {
	link: (categories: FAQCategory[] = []) =>
		createFAQCategoryLinkSchemaFactory(categories).create('link')
};

/**
 * Backward compatibility helper (matches FAQ pattern)
 */
export function createFAQCategoryLinkFormSchema(
	variant: 'link',
	categories: FAQCategory[] = []
) {
	return createFAQCategoryLinkSchemaFactory(categories).create(variant);
}