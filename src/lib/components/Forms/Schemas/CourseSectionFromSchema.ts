import {
	defineEntitySchema,
	type EntityFieldConfig,
	type EntityGroupConfig
} from '$lib/components/Forms/Schemas/FormSchemaFactory';
import type { CourseSection } from '$lib/types/entities/CourseSection';

export function createCourseSectionFields(): EntityFieldConfig[] {
	return [
		{
			name: 'title',
			label: 'Section Name',
			type: 'text',
			group: 'content',
			variants: { standard: true },
			required: true,
			minLength: 3,
			maxLength: 20,
			placeholder: 'Name of the new section?',
			helpText: 'Keep it clear and concise',
			colSpan: 2
		},
		{
			name: 'description',
			label: 'Description',
			type: 'text',
			group: 'content',
			variants: { standard: true },
			required: true,
			minLength: 3,
			maxLength: 20,
			placeholder: 'Name of the new category?',
			helpText: 'Keep it clear and concise',
			colSpan: 2
		},
		{
			name: 'orderIndex',
			label: 'Order',
			type: 'number',
			group: 'content',
			variants: { quick: true, standard: true, detailed: true, edit: true },
			required: true,
			placeholder: 'Name of the new category?',
			helpText: 'Keep it clear and concise',
			colSpan: 2
		}
	]
}

const courseSectionGroup: EntityGroupConfig[] = [
	{
		id: 'content',
		title: 'Content',
		description: 'Terminal Section',
		icon: '📝',
		variant: 'default',
		variants: { standard: true, edit: true }
	}
]

export function createCourseSectionSchemaFactory() {
	return defineEntitySchema<CourseSection>({
		entity: 'Course',
		fields: createCourseSectionFields(),
		groups: courseSectionGroup,
		variantConfig: {
			standard: {
				title: 'Create Course Section',
				submitLabel: 'Create Section',
				showReset: true,
				showCancel: true,
			}
		}
	});
}

export const CourseSectionFormPresets = {
	standard: () => {
		return createCourseSectionSchemaFactory().create('standard');
	}
};
