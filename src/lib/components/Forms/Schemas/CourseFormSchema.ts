import type { Course } from '$lib/types/entities/Course';
import {
	defineEntitySchema,
	type EntityFieldConfig,
	type EntityGroupConfig
} from '$lib/components/Forms/Schemas/FormSchemaFactory';
import type { CourseCategory } from '$lib/types/entities/CourseCategory';
import type { User } from '$lib/types/entities/User';

export function createCourseFields(
	courseCategories: CourseCategory[] = [],
	users: User[] = [],

): EntityFieldConfig[] {

	// Prepare course category data
	const categoryOptions = courseCategories.map((c) => ({
		value: c.id,
		label: c.name
	}));

	// Prepare user data
	const userOptions = users.map((user) => ({
		value: user.id,
		label: `${user.firstName} ${user.lastName} (${user.email})`
	}))

	return [
		// Basic Information
		{
			name: 'name',
			label: 'Terminal Name',
			type: 'text',
			group: 'basic',
			variants: { quick: true, standard: true, detailed: true, edit: true, embedded: true },
			required: true,
			minLength: 3,
			maxLength: 100,
			placeholder: 'Enter terminal name',
			helpText: 'A clear, descriptive name for your terminal',
			colSpan: 2
		},
		{
			name: 'price',
			label: 'Price',
			type: 'number',
			group: 'basic',
			variants: { quick: true, standard: true, detailed: true, edit: true, embedded: true },
			required: true,
			helpText: 'Terminal price in CZK',
			colSpan: 1
		},
		{
			name: 'ownerId', // Store just the ID
			label: 'Course Owner',
			type: 'select',
			group: 'basic',
			variants: { standard: true, detailed: true, edit: true, embedded: true },
			required: true,
			searchable: true, // Makes it easy to find users
			options: userOptions,
			placeholder: 'Select course owner...',
			helpText: 'The instructor who will own this course',
			colSpan: 1
		},
		{
			name: 'status',
			label: 'Status',
			type: 'select',
			group: 'publishing',
			variants: { standard: true, detailed: true, edit: true, embedded: true },
			required: true,
			options: [
				{ value: 'DRAFT', label: 'Draft' },
				{ value: 'UNPUBLISHED', label: 'Unpublished' },
				{ value: 'PUBLISHED', label: 'Published' }
			],
			defaultValue: 'DRAFT',
			helpText: 'Current publication status',
			colSpan: 1
		},

		// Metadata
		{
			name: 'labels',
			label: 'Labels',
			type: 'tags',
			group: 'metadata',
			variants: { standard: true, detailed: true, edit: true, embedded: true },
			required: false,
			placeholder: 'Add labels...',
			helpText: 'Keywords for organization and search',
			colSpan: 2
		},
		{
			name: 'categoryIds',
			label: 'Categories',
			type: 'multiselect',
			group: 'metadata',
			variants: { standard: true, detailed: true, edit: true, embedded: true },
			required: true,
			minItems: 1,
			maxItems: 5,
			searchable: true,
			options: categoryOptions,
			placeholder: 'Select categories...',
			helpText: 'Assign this terminal to one or more categories',
			colSpan: 2
		},

		// Publishing
		{
			name: 'published',
			label: 'Publish Date',
			type: 'date',
			group: 'publishing',
			variants: { detailed: true, edit: true, embedded: true },
			required: false,
			helpText: 'Schedule when this terminal should be published',
			colSpan: 1,
			dependencies: [
				{
					field: 'status',
					condition: 'equals',
					value: 'PUBLISHED'
				}
			]
		},
		{
			name: 'featured',
			label: 'Featured Terminal',
			type: 'checkbox',
			group: 'publishing',
			variants: { detailed: true, edit: true, embedded: true },
			required: false,
			defaultValue: false,
			helpText: 'Display this terminal prominently on the homepage',
			colSpan: 1
		}
	];
}

const courseGroups: EntityGroupConfig[] = [
	// EMBEDDED VARIANT - clean headings
	{
		id: 'basic',
		title: 'Terminal Details',
		description: 'Basic information about your terminal',
		icon: '📝',
		variant: 'default',
		collapsible: false,
		variants: { embedded: true }
	},
	{
		id: 'metadata',
		title: 'Organization',
		description: 'Labels and categories for organization',
		icon: '🗂️',
		variant: 'default',
		collapsible: true,
		variants: { embedded: true }
	},
	{
		id: 'publishing',
		title: 'Publishing',
		description: 'Publication status and scheduling',
		icon: '🚀',
		variant: 'default',
		collapsible: true,
		variants: { embedded: true }
	},

	// EDIT/STANDARD VARIANTS - rounded cards
	{
		id: 'basic',
		title: 'Terminal Details',
		description: 'Basic information about your terminal',
		icon: '📝',
		variant: 'default',
		collapsible: false,
		variants: { standard: true, edit: true }
	},
	{
		id: 'metadata',
		title: 'Organization',
		description: 'Labels and categories for organization',
		icon: '🗂️',
		variant: 'default',
		collapsible: true,
		variants: { standard: true, edit: true }
	},
	{
		id: 'publishing',
		title: 'Publishing',
		description: 'Publication status and scheduling',
		icon: '🚀',
		variant: 'default',
		collapsible: true,
		collapsed: true,
		variants: { standard: true, edit: true }
	}
];

export function createCourseSchemaFactory(
	courseCategories: CourseCategory[] = [],
	users: User[] = []
) {
	return defineEntitySchema<Course>({
		entity: 'Course',
		fields: createCourseFields(courseCategories, users),
		groups: courseGroups,
		variantConfig: {
			standard: {
				title: 'Create Terminal',
				submitLabel: 'Create Terminal',
				layout: 'two-column',
				showReset: true,
				showCancel: true
			},
			edit: {
				title: 'Edit Terminal',
				submitLabel: 'Save Changes',
				layout: 'two-column',
				showReset: false,
				showCancel: true
			},
			embedded: {
				title: '',
				submitLabel: 'Save',
				layout: 'two-column',
				showReset: false,
				showCancel: false,
				validateOnChange: true
			}
		}
	});
}

export const CourseFormPresets = {
	standard: (categories: CourseCategory[] = [], users: User[] = []) => {
		return createCourseSchemaFactory(categories, users).create('standard');
	},
	edit: (categories: CourseCategory[] = [], users: User[] = []) => {
		return createCourseSchemaFactory(categories, users).create('edit');
	},
	embedded: (categories: CourseCategory[] = [], users: User[] = []) => {
		return createCourseSchemaFactory(categories, users).create('embedded');
	}
};