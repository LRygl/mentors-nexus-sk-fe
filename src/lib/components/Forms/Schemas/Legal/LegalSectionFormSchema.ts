import type { FormSchema } from '$lib/types/entities/forms';

export const LegalSectionFormSchema: FormSchema = {
	fields: [
		{
			name: 'name',
			label: 'Section Name',
			type: 'text',
			placeholder: 'Enter section name',
			required: true,
			minLength: 3,
			maxLength: 255,
			colSpan: 2
		}
	]
};

export const LegalSectionFormPresets = {
	create: (): FormSchema => LegalSectionFormSchema,
	embedded: (): FormSchema => LegalSectionFormSchema
};