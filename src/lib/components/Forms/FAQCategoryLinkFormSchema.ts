// src/lib/components/Forms/FAQCategoryLinkFormSchema.ts
import type { FAQ } from '$lib/types';
import { FormBuilder } from '$lib/utils/formBuilder';

export interface FAQLinkFormData {
	faqUuid: string;
}


export function createFAQCategoryLinkFormSchema(availableFAQs: FAQ[] | (() => FAQ[]) = []) {
	// Handle both direct array and function that returns array
	const faqs = typeof availableFAQs === 'function' ? availableFAQs() : availableFAQs;

	// Transform FAQs into select options
	const faqOptions = faqs.map(faq => ({
		label: `${faq.question}${faq.isPublished ? '' : ' (Draft)'}`, // Show if it's a draft
		value: faq.uuid
	}));

	if (faqOptions.length === 0) {
		// Return a form with a disabled message field if no FAQs available
		return new FormBuilder<FAQLinkFormData>()
			.layout('single')
			.group('No FAQs Available')
			.text('message', 'Status', {
				defaultValue: 'No FAQs available to link to this category',
				colSpan: 1
			})
			.build();
	}

	// Create options with placeholder as first item
	const selectOptions = [
		{ label: 'Choose an FAQ to link...', value: '' }, // Empty value for placeholder
		...faqOptions
	];

	return new FormBuilder<FAQLinkFormData>()
		.layout('single')
		.group('Select FAQ to Link', 'Choose an FAQ to add to this category')
		.select('faqUuid', 'Select FAQ', selectOptions, {
			required: true,
			colSpan: 1,
			helpText: `${faqOptions.length} FAQ${faqOptions.length !== 1 ? 's' : ''} available`,
			defaultValue: '' // Explicitly set empty string as default
		})
		.build();
}

/*
export function createFAQCategorySearchLinkFormSchema(availableFAQs: FAQ[] | (() => FAQ[]) = []) {
	const faqs = typeof availableFAQs === 'function' ? availableFAQs() : availableFAQs;

	if (faqs.length === 0) {
		return null;
	}

	const faqOptions = faqs.map(faq => ({
		label: faq.question,
		value: faq.uuid,
		searchText: `${faq.question} ${faq.isPublished ? 'published' : 'draft'}`,
		metadata: {
			isPublished: faq.isPublished,
			status: faq.isPublished ? 'Published' : 'Draft',
			statusColor: faq.isPublished ? 'green' : 'orange'
		}
	}));

	return new FormBuilder<FAQLinkFormData>()
		.layout('single')
		.group('Select FAQ to Link', 'Choose an FAQ to add to this category')
		.custom('faqUuid', 'Select FAQ', 'EnhancedSelect', {
			componentProps: {
				options: faqOptions,
				placeholder: 'Search and select an FAQ...',
				searchable: true,
				showMetadata: true,
				customRenderer: true
			},
			required: true,
			colSpan: 1,
			helpText: `${faqOptions.length} FAQ${faqOptions.length !== 1 ? 's' : ''} available`,
			defaultValue: '',
			validationRules: [
				{ type: 'required', message: 'Please select an FAQ', value: true }
			]
		})
		.build();
}
*/