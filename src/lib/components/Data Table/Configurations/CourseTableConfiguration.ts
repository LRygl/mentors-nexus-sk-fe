import { createTablePreset, defineTableConfig } from '$lib/components/Data Table/Configurations/DataTableConfigurationFactory';
import type { Course } from '$lib/types/entities/Course';
import { Eye } from '@lucide/svelte';
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
			key: 'status',
			header: 'Status',
			type: 'text',
			searchable: true,
			sortable: true,
			cellClassName: 'font-mono text-xs text-slate-500',
		},
		{
			key: 'created',
			header: 'Created',
			type: 'datetime',
			searchable: false,
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
			description: 'See full FAQ details',
			icon: Eye,
			variant: ActionType.DEFAULT,
			group: 'Actions'
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