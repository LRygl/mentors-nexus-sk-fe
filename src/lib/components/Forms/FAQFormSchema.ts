import { FormBuilder } from '$lib/utils/formBuilder';
import type { FAQCreateFormData } from '$lib/types/entities/faq';
import type { FAQCategory } from '$lib/types/entities/faqCategory';


export function createFAQFormSchema(faqCategories: FAQCategory[] = []) {
	return new FormBuilder<FAQCreateFormData>()
		.layout('two-column')

		.group(
			'FAQ Details'
			)

		.text('question', 'Question', {
			placeholder: 'e.g., How do you drink tea?',
			required: true,
			minLength: 2,
			maxLength: 250,
			colSpan: 1
		})
		.textarea('answer', 'Answer', {
			placeholder: 'With your mouth!',
			required: true,
			minLength: 1,
			maxLength: 500,
			rows: 3,
			colSpan: 2
		})

		// Visibility Settings
		.group('Settings')
		.checkbox('isPublished', 'Publish?', {
			helpText: 'Category will be marked as published when created. FAQ Category is required.',
			defaultValue: false,
			colSpan: 1
		})
		.checkbox('isFeatured', 'Featured?', {
			helpText: 'Featured FAQ',
			defaultValue: false,
			colSpan: 1
		})

		// Conditional FAQ Category select - only show when isPublished is true
		.select('faqCategoryId', 'FAQ Category',
			[
				{ label: 'Select a category...', value: '' },
				...faqCategories.map(cat => ({
					label: cat.name,
					value: cat.id
				}))
			], {
				placeholder: 'Choose FAQ Category',
				colSpan: 2,
				helpText: 'Required when FAQ is published',
				// Add dependency configuration
				dependencies: [{
					field: 'isPublished',
					condition: 'truthy'
				}],
				conditionalValidation: [{
					when: {
						field: 'isPublished',
						condition: 'truthy'
					},
					rules: [{ type: 'required', message: 'FAQ Category is required when publishing' }]
				}]
			})
		.build();







}


