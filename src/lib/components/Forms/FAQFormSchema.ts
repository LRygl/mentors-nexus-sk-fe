import { FormBuilder } from '$lib/utils/formBuilder';
import type { FAQCreateFormData } from '$lib/types/entities/faq';


export function createFAQFormSchema() {
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
		.build();







}


