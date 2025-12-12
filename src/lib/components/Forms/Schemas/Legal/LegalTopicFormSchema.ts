import  {
	defineEntitySchema,
	type EntityFieldConfig,
	type EntityGroupConfig
} from '$lib/components/Forms/Schemas/FormSchemaFactory';
import type { LegalTopic } from '$lib/types/entities/LegalTopic';

export function createLegalTopicFields(): EntityFieldConfig[] {
	return [
		{
			name: 'name',
			label: 'Topic Title',
			type: 'text',
			group: 'topic',
			variants: { quick: true, standard: true, detailed: true, embedded: true },
			required: true,
			minLength: 3,
			maxLength: 20,
			placeholder: 'Name of the new topic?',
			helpText: 'Keep it clear and concise',
			colSpan: 2
		},
		{
			name: 'subtitle',
			label: 'Subtitle',
			type: 'text',
			group: 'topic',
			variants: { quick: true, standard: true, detailed: true, embedded: true },
			required: true,
			minLength: 3,
			maxLength: 20,
			placeholder: 'Name of the new topic?',
			helpText: 'Keep it clear and concise',
			colSpan: 2
		},
		{
			name: 'footer',
			label: 'Footer Content',
			type: 'text',
			group: 'topic',
			variants: { quick: true, standard: true, detailed: true, embedded: true },
			required: true,
			minLength: 3,
			maxLength: 20,
			placeholder: 'Name of the new topic?',
			helpText: 'Keep it clear and concise',
			colSpan: 2
		},
		{
			name: 'published',
			label: 'Published',
			type: 'checkbox',
			group: 'topic',
			variants: { quick: true, standard: true, detailed: true, embedded: true },
			required: true,
			minLength: 3,
			maxLength: 20,
			placeholder: 'Name of the new topic?',
			helpText: 'Keep it clear and concise',
			colSpan: 2
		},
		{
			name: 'showCta',
			label: 'Show Call to Action',
			type: 'checkbox',
			group: 'topic',
			variants: { quick: true, standard: true, detailed: true, embedded: true },
			required: true,
			minLength: 3,
			maxLength: 20,
			placeholder: 'Name of the new topic?',
			helpText: 'Keep it clear and concise',
			colSpan: 2
		}
	]
}

const legalTopicFormGroup: EntityGroupConfig[] = [
	{
		id: 'topic',
		title: 'Topic',
		description: 'Basic topic information displayed to customers',
		icon: '📝',
		variant: 'default',
		variants: { standard: true, embedded: true }
	},
]

export function createLegalTopicSchmaFactory() {
	return defineEntitySchema<LegalTopic>({
		entity: 'Legal Topic',
		fields: createLegalTopicFields(),
		groups: legalTopicFormGroup,
		variantConfig: {
			standard: {
				title: 'Create Topic',
				submitLabel: 'Create Topic',
				showReset: true,
				showCancel: true,
			},
			embedded: {
				title: 'Create Topic',
				submitLabel: 'Create Topic',
				showReset: true,
				showCancel: true,
			}
		}
	});
}

export const LegalTopicFormPresets = {
	standard: () => {
		return createLegalTopicSchmaFactory().create('standard');
	},
	embedded: () => {
		return createLegalTopicSchmaFactory().create('embedded');
	},
}