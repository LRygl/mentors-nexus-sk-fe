import { createTablePreset, defineTableConfig } from '$lib/components/Data Table/Configurations/DataTableConfigurationFactory';
import type { Course } from '$lib/types/entities/Course';
import { Eye, Star, StarOff } from '@lucide/svelte';
import { ActionType } from '$lib/types';

const courseTableDefinition = defineTableConfig<Course>({
	entity: 'Course',
	entityPlural: 'Courses',

	idField: 'id',
	titleField: 'name',
	columns: [
		{
			key: 'id',
			header: 'ID',
			type: 'text',
			searchable: false,
			sortable: true,
			cellClassName: 'font-mono text-xs text-slate-500',
		},
		{
			key: 'name',
			header: 'Name',
			type: 'text',
			searchable: true,
			sortable: true,
			cellClassName: 'font-mono text-xs text-slate-500',
		},
		{
			key: 'owner',
			header: 'Owner',
			type: 'text',
			searchable: true,
			sortable: true,
			cellClassName: 'font-mono text-xs text-slate-500',
			accessor: (course: Course) => {
				const name = course.owner?.firstName + ' ' + course.owner?.lastName;
				if (!name) return 'No Owner';
				return `${name}`;
			}
		},
		{
			key: 'lessons',
			header: 'Lessons',
			type: 'text',
			searchable: true,
			sortable: true,
			cellClassName: 'font-mono text-xs text-slate-500',
		},
		{
			key: 'isFeatured',
			header: 'Featured',
			type: 'text',
			searchable: true,
			sortable: true,
			cellClassName: 'font-mono text-xs text-slate-500',
		},
		{
			key: 'status',
			header: 'Status',
			type: 'text',
			searchable: true,
			sortable: true,
			cellClassName: 'font-mono text-xs text-slate-500',
		},
		{
			key: 'updated',
			header: 'Updated',
			type: 'datetime',
			searchable: false,
			sortable: true,
			cellClassName: 'font-mono text-xs text-slate-500',
		},
		{
			key: 'published',
			header: 'Published',
			type: 'datetime',
			searchable: false,
			sortable: true,
			cellClassName: 'font-mono text-xs text-slate-500',
		},
		{
			key: 'price',
			header: 'Price',
			type: 'text',
			searchable: true,
			sortable: true,
			cellClassName: 'font-mono text-xs text-slate-500',
		},
	],
	actions: [
		{
			id: 'view',
			label: 'View Details',
			description: 'See full course details',
			icon: Eye,
			variant: ActionType.DEFAULT,
			group: 'Actions'
		},
		{
			id: 'publish',
			label: 'Set as Published',
			description: 'Publish now',
			icon: Star,
			variant: ActionType.WARNING,
			group: 'State',
			condition: (course: Course) => !!course.published
		},
		{
			id: 'unpublish',
			label: 'Remove Published',
			description: 'Remove course as featured',
			icon: StarOff,
			variant: ActionType.WARNING,
			group: 'State',
			condition: (course: Course) => !course.published
		},
		{
			id: 'feature',
			label: 'Set as Featured',
			description: 'Set course as featured',
			icon: Star,
			variant: ActionType.WARNING,
			group: 'State',
			condition: (course: Course) => !!course.featured
		},
		{
			id: 'unfeature',
			label: 'Remove Featured',
			description: 'Remove course as featured',
			icon: StarOff,
			variant: ActionType.WARNING,
			group: 'State',
			condition: (course: Course) => !course.featured
		},
		{
			id: 'delete',
			label: 'Delete',
			description: 'Delete the course record',
			icon: Eye,
			variant: ActionType.DANGER,
			group: 'Management'
		},
	],

	searchable: true,
	filterable: true,
	selectable: true,
	exportable: true,
	sortable: true,

	emptyTitle: 'No Courses',
	emptyDescription: 'Get started by defining questions which might be interesting to your users and provide simple answers.',
	emptyActionLabel: 'Create your first Course',
	loadingTitle: 'Loading Courses',
	loadingDescription: 'Please wait while we fetch your Courses...',
	searchPlaceholder: 'Search Courses...'
})

export const CourseTablePreset = createTablePreset(courseTableDefinition);

export const CourseTableConfig = {
	CourseTableConfig: () => CourseTablePreset.config(),
	CourseTableColumns: () => CourseTablePreset.columns(),
	CourseTableActions: (course: Course) => CourseTablePreset.getActions(course),
	CourseTableProps: () => CourseTablePreset.props(),

	all: () => CourseTablePreset.all()
};