import type { FormSchema } from '$lib/types/entities/forms';
import {
	defineEntitySchema,
	type EntityFieldConfig
} from '$lib/components/Forms/Schemas/FormSchemaFactory';
import type { LegalItem } from '$lib/types/entities/LegalItem';

export function createLegalItemFields(): EntityFieldConfig[] {
	return [
		{
			name: 'content',
			label: 'Content',
			type: 'textarea',
			group: 'standard',
			variants: { standard: true },
			placeholder: 'Enter item content',
			required: true,
			minLength: 1,
			maxLength: 5000
		}
	];
}

export function createLegalItemSchemaFactory() {
	return defineEntitySchema<LegalItem>({
		entity: 'LegalItem',
		fields: createLegalItemFields(),
		variantConfig: {
			standard: {
				title: 'Add Legal Item',
				submitLabel: 'Add Item',
				layout: 'single'
			}
		}
	});
}

export const LegalItemFormPresets = {
	create: () => createLegalItemSchemaFactory().create('standard')
};