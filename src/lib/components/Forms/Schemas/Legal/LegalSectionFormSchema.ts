import type { FormSchema } from '$lib/components/Forms/BaseFormType';
import type { LegalSection } from '$lib/types/entities/LegalSection';

export const LegalSectionFormSchema: FormSchema = {
	fields: [
		{
			name: 'name',
			label: 'Section Name',
			type: 'text',
			placeholder: 'Enter section name',
			required: true,
			validation: {
				minLength: 3,
				maxLength: 100
			}
		},
		{
			name: 'icon',
			label: 'Icon',
			type: 'icon-select',
			placeholder: 'Select an icon (optional)',
			required: false
		},
		{
			name: 'published',
			label: 'Published',
			type: 'checkbox',
			placeholder: 'Publish this section',
			required: false
		}
	]
};

export const LegalSectionFormPresets = {
	create: (): FormSchema => LegalSectionFormSchema,
	embedded: (): FormSchema => LegalSectionFormSchema
};