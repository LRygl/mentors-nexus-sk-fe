import type { FAQ } from '$lib/types';
import {
	defineEntitySchema,
	type EntityFieldConfig,
	type EntityGroupConfig
} from '$lib/components/Forms/Schemas/FormSchemaFactory';

/**
 * FAQ Link Field Definitions
 * For linking FAQs to a category
 */
export function createFAQLinkFields(availableFAQs: FAQ[] = []): EntityFieldConfig[] {
	const faqOptions = availableFAQs.map(faq => ({
		label: faq.question,
		value: faq.uuid,
		// Optional: add subtitle or extra info
		subtitle: faq.answer?.substring(0, 50) + '...'
	}));

	return [
		{
			name: 'faqUuid',
			label: 'Select FAQ',
			type: 'select',
			variants: { link: true },
			options: [
				{ label: 'Choose an FAQ...', value: '', disabled: true },
				...faqOptions
			],
			required: true,
			searchable: true,
			helpText: `${availableFAQs.length} unpublished FAQ${availableFAQs.length === 1 ? '' : 's'} without a category available`,
			colSpan: 1
		}
	];
}

/**
 * Optional: Groups (if you need them later)
 */
const faqLinkGroups: EntityGroupConfig[] = [
	// Add groups here if needed in the future
];

/**
 * Create FAQ Link Schema Factory
 */
export function createFAQLinkSchemaFactory(availableFAQs: FAQ[] = []) {
	return defineEntitySchema({
		entity: 'FAQ Link',
		fields: createFAQLinkFields(availableFAQs),
		groups: faqLinkGroups,
		variantConfig: {
			link: {
				title: 'Link FAQ to Category',
				description: 'Associate an FAQ with this category',
				submitLabel: 'Link FAQ',
				showReset: false,
				showCancel: true
			}
		}
	});
}

/**
 * FAQ Link Presets - Simple API
 */
export const FAQLinkPresets = {
	link: (faqs: FAQ[] = []) =>
		createFAQLinkSchemaFactory(faqs).create('link')
};

/**
 * Backward compatibility helper
 */
export function createFAQLinkFormSchema(
	availableFAQs: FAQ[] = []
) {
	return createFAQLinkSchemaFactory(availableFAQs).create('link');
}