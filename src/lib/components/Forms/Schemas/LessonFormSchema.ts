import {
	defineEntitySchema,
	type EntityFieldConfig,
	type EntityGroupConfig
} from '$lib/components/Forms/Schemas/FormSchemaFactory';
import type { Course } from '$lib/types/entities/Course';

export function createLessonFields(): EntityFieldConfig[] {
	return [
		{
			name: 'title',
			label: 'Lesson Title',
			type: 'text',
			group: 'content',
			variants: { quick: true, standard: true, detailed: true, edit: true },
			required: true,
			minLength: 3,
			maxLength: 20,
			placeholder: 'Name of the new category?',
			helpText: 'Keep it clear and concise',
			colSpan: 2
		},
		{
			name: 'description',
			label: 'Description',
			type: 'text',
			group: 'content',
			variants: { quick: true, standard: true, detailed: true, edit: true },
			required: true,
			minLength: 3,
			maxLength: 20,
			placeholder: 'Name of the new category?',
			helpText: 'Keep it clear and concise',
			colSpan: 2
		},
		{
			name: 'number',
			label: 'Length',
			type: 'number',
			group: 'content',
			variants: { quick: true, standard: true, detailed: true, edit: true },
			required: true,
			minLength: 3,
			maxLength: 20,
			placeholder: 'Name of the new category?',
			helpText: 'Keep it clear and concise',
			colSpan: 2
		},
	]
}

const lessonGroup: EntityGroupConfig[] = [
	{
		id: 'content',
		title: 'Content',
		description: 'Question and answer content',
		icon: '📝',
		variant: 'default',
		variants: { standard: true, edit: true }
	}
]

export function createLessonSchemaFactory() {
	return defineEntitySchema<Course>({
		entity: 'Course',
		fields: createLessonFields(),
		groups: lessonGroup,
		variantConfig: {
			standard: {
				title: 'Create Course',
				submitLabel: 'Create Course',
				showReset: true,
				showCancel: true,
			}
		}
	});
}

export const LessonFormPresets = {
	standard: () => {
		return createLessonSchemaFactory().create('standard');  // ← PASS HERE!
	}
};