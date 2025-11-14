import {
	defineEntitySchema,
	type EntityFieldConfig,
	type EntityGroupConfig
} from '$lib/components/Forms/Schemas/FormSchemaFactory';
import type { CourseCategory } from '$lib/types/entities/CourseCategory';
import { createCourseSchemaFactory } from '$lib/components/Forms/Schemas/CourseFormSchema';

export const QUICK_COLORS = [
	{ name: 'Blue', value: '#3B82F6' },
	{ name: 'Purple', value: '#8B5CF6' },
	{ name: 'Green', value: '#10B981' },
	{ name: 'Red', value: '#EF4444' },
	{ name: 'Orange', value: '#F59E0B' },
	{ name: 'Pink', value: '#EC4899' },
	{ name: 'Indigo', value: '#6366F1' },
	{ name: 'Teal', value: '#14B8A6' }
];


export function createCourseCategoryFields(courseCategory: CourseCategory[] = []): EntityFieldConfig[] {

	return [
		{
			name: 'name',
			label: 'Category name',
			type: 'text',
			group: 'content',
			variants: { quick: true, standard: true, embedded: true },
			required: true,
			minLength: 3,
			maxLength: 20,
			placeholder: 'Name of the new category?',
			helpText: 'Keep it clear and concise',
			colSpan: 1
		},
		{
			name: 'description',
			label: 'Description',
			type: 'text',
			group: 'content',
			variants: { standard: true, edit: true, embedded: true },
			required: true,
			minLength: 3,
			maxLength: 20,
			placeholder: 'Name of the new category?',
			helpText: 'Keep it clear and concise',
			colSpan: 1
		},
		{
			name: 'colorCode',
			label: 'Color',
			type: 'color',
			group: 'content',
			variants: { standard: true, edit: true, embedded: true },
			options: QUICK_COLORS.map(color => ({
				label: color.name,
				value: color.value,
				color: color.value
			})),
			defaultValue: QUICK_COLORS[0].value,
			helpText: 'Choose a color for this category',
			colSpan: 1
		},
	];
}

const courseCategoryGroup: EntityGroupConfig[] = [
	{
		id: 'content',
		title: 'Content',
		description: 'Question and answer content',
		icon: '📝',
		variant: 'default',
		variants: { standard: true, edit: true, embedded: true },
	}
]

export function createCourseCategorySchemaFactory() {
	return defineEntitySchema<CourseCategory>({
		entity: 'Course Category',
		fields: createCourseCategoryFields(),
		groups: courseCategoryGroup,
		variantConfig: {
			standard: {
				title: 'Create Course Category',
				submitLabel: 'Create Course Category',
				showReset: true,
				showCancel: true,
			},
			embedded: {
				title: 'Create Course Category',
				submitLabel: 'Create Course Category',
				showReset: true,
				showCancel: true,
			}
		}
	});
}

export const CourseCategoryFormPresets = {
	standard: () => createCourseCategorySchemaFactory().create('standard'),
	embedded: () => { return createCourseCategorySchemaFactory().create('embedded'); },
};

