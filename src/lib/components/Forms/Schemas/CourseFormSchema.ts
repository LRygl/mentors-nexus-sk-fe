import type { Course } from '$lib/types/entities/Course';
import {
	defineEntitySchema,
	type EntityFieldConfig,
	type EntityGroupConfig
} from '$lib/components/Forms/Schemas/FormSchemaFactory';
import type { CourseCategory } from '$lib/types/entities/CourseCategory';

export function createCourseFields(courseCategories: CourseCategory[] = []): EntityFieldConfig[] {

	const categoryOptions = courseCategories.map(c => ({
		value: c.id?.toString(),
		label: c.name,
	}));

	return [
		{
			name: 'name',
			label: 'Course name',
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
			name: 'price',
			label: 'Price',
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
		{
			name: 'labels',
			label: 'Labels',
			type: 'tags',
			group: 'content',
			variants: { quick: true, standard: true, detailed: true, edit: true },
			required: true,
			placeholder: 'Name of the new category?',
			helpText: 'Keep it clear and concise',
			colSpan: 2
		},
		{
			name: 'categories',
			label: 'Course Categories',
			type: 'multiselect',
			group: 'content',
			variants: { standard: true, edit: true },
			required: true,
			minItems: 1,
			maxItems: 5,
			searchable: true,
			options: categoryOptions,
			placeholder: 'Select categories...',
			helpText: 'Choose the categories this course belongs to',
			colSpan: 2
		}
	]
}

const courseGroup: EntityGroupConfig[] = [
	{
		id: 'content',
		title: 'Content',
		description: 'Question and answer content',
		icon: '📝',
		variant: 'default',
		variants: { standard: true, edit: true }
	}
]

export function createCourseSchemaFactory(courseCategories: CourseCategory[] = []) {
	console.log('🏭 createCourseSchemaFactory - Input categories:', courseCategories);
	return defineEntitySchema<Course>({
		entity: 'Course',
		fields: createCourseFields(courseCategories),
		groups: courseGroup,
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

export const CourseFormPresets = {
	standard: (categories: CourseCategory[] = []) => {
		return createCourseSchemaFactory(categories).create('standard');  // ← PASS HERE!
	}
};
