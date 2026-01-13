import {
	defineEntitySchema,
	type EntityFieldConfig,
	type EntityGroupConfig
} from '$lib/components/Forms/Schemas/FormSchemaFactory';
import type { Lesson } from '$lib/types/entities/Lesson';
import { LessonCategory } from '$lib/types/enums/LessonCategory';
import { LessonType } from '$lib/types/enums/LessonType';

export function createLessonFields(): EntityFieldConfig[] {

	return [
		{
			name: 'title',
			label: 'Terminal Title',
			type: 'text',
			group: 'terminal',
			variants: { quick: true, standard: true, detailed: true, embedded: true },
			required: true,
			minLength: 3,
			maxLength: 20,
			placeholder: 'Name of the new category?',
			helpText: 'Keep it clear and concise',
			colSpan: 3
		},
		{
			name: 'description',
			label: 'Description',
			type: 'text',
			group: 'terminal',
			variants: { quick: true, standard: true, detailed: true, embedded: true },
			required: true,
			minLength: 3,
			maxLength: 20,
			placeholder: 'Name of the new category?',
			helpText: 'Keep it clear and concise',
			colSpan: 3
		},
		{
			name: 'duration',
			label: 'Length',
			type: 'number',
			group: 'terminal',
			variants: { quick: true, standard: true, detailed: true, embedded: true },
			required: true,
			minLength: 3,
			maxLength: 20,
			placeholder: 'Terminal duration',
			helpText: 'Length of the lesson in minutes',
			colSpan: 1
		},
		{
			name: 'category',
			label: 'Category',
			type: 'select',
			group: 'terminal',
			variants: { quick: true, standard: true, embedded: true },
			required: true,
			options: [
				...Object.values(LessonCategory).map((category) => ({
					label: category.charAt(0).toUpperCase() + category.slice(1).toLowerCase(),
					value: category
				}))
			],
			placeholder: 'Lesson category',
			helpText: 'Type of the terminal category',
			colSpan: 1
		},
		{
			name: 'type',
			label: 'Type',
			type: 'select',
			group: 'terminal',
			variants: { quick: true, standard: true, embedded: true },
			required: true,
			options: [
				...Object.values(LessonType).map((category) => ({
					label: category.charAt(0).toUpperCase() + category.slice(1).toLowerCase(),
					value: category
				}))
			],
			placeholder: 'Lesson category',
			helpText: 'Type of the terminal category',
			colSpan: 1
		},

		{
			name: 'imageUrl',
			label: 'Terminal Cover Image',
			type: 'image',
			group: 'terminal',
			variants: { embedded: true },
			required: false,
			placeholder: 'Upload a terminal thumbnail...',
			helpText: 'A featured image for your course (JPEG, PNG, WebP, or GIF)',
			maxFileSize: 5 * 1024 * 1024, // 5MB
			acceptedFileTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
			colSpan: 3
		},
		{
			name: 'videoUrl',
			label: 'Terminal Content',
			type: 'image',
			group: 'content',
			variants: { embedded: true },
			required: false,
			placeholder: 'Upload a terminal thumbnail...',
			helpText: 'A featured image for your course (JPEG, PNG, WebP, or GIF)',
			maxFileSize: 5 * 1024 * 1024, // 5MB
			acceptedFileTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
			colSpan: 3
		}
	];
}

const lessonGroup: EntityGroupConfig[] = [
	{
		id: 'terminal',
		title: 'Terminal',
		description: 'Basic terminal information displayed to customers',
		icon: '📝',
		variant: 'default',
		variants: { standard: true, embedded: true }
	},
	{
		id: 'content',
		title: 'Content',
		description: 'Terminal content based on the category',
		icon: '📝',
		variant: 'default',
		variants: { standard: true, embedded: true }
	}
]

export function createLessonSchemaFactory() {
	return defineEntitySchema<Lesson>({
		entity: 'Course',
		fields: createLessonFields(),
		groups: lessonGroup,
		variantConfig: {
			standard: {
				title: 'Create Course',
				submitLabel: 'Create Course',
				showReset: true,
				showCancel: true,
			},
			embedded: {
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
	},
	embedded: () => {
		return createLessonSchemaFactory().create('embedded');
	}
};