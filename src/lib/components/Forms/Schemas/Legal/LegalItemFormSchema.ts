import type { FormSchema } from '$lib/components/Forms/BaseFormType';
import type { LegalItem } from '$lib/types/entities/LegalItem';

export const LegalItemFormSchema: FormSchema = {
	fields: [
		{
			name: 'content',
			label: 'Content',
			type: 'textarea',
			placeholder: 'Enter item content',
			required: true,
			validation: {
				minLength: 1,
				maxLength: 5000
			}
		},
		{
			name: 'published',
			label: 'Published',
			type: 'checkbox',
			placeholder: 'Publish this item',
			required: false
		}
	]
};

export const SubItemFormSchema: FormSchema = {
	fields: [
		{
			name: 'content',
			label: 'Content',
			type: 'textarea',
			placeholder: 'Enter sub-item content',
			required: true,
			validation: {
				minLength: 1,
				maxLength: 5000
			}
		},
		{
			name: 'published',
			label: 'Published',
			type: 'checkbox',
			placeholder: 'Publish this sub-item',
			required: false
		}
	]
};

export const LegalItemFormPresets = {
	create: (): FormSchema => LegalItemFormSchema,
	embedded: (): FormSchema => LegalItemFormSchema,
	subItem: (): FormSchema => SubItemFormSchema
};