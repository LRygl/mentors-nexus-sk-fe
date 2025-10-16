import {
	createTablePreset,
	defineTableConfig
} from '$lib/components/Data Table/Configurations/DataTableConfigurationFactory';
import type { CourseCategory } from '$lib/types/entities/CourseCategory';
import { Eye } from '@lucide/svelte';
import { ActionType } from '$lib/types';
import type { Course } from '$lib/types/entities/Course';

const courseCategoryTableDefinition = defineTableConfig<CourseCategory>({
	entity: 'Course Category',
	entityPlural: 'Course Categories',

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
			key: 'color',
			header: 'Color',
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

	emptyTitle: 'No Course Categories',
	emptyDescription: 'Get started by defining questions which might be interesting to your users and provide simple answers.',
	emptyActionLabel: 'Create your first Course Category',
	loadingTitle: 'Loading Course Categories',
	loadingDescription: 'Please wait while we fetch your Course Categories...',
	searchPlaceholder: 'Search Course Categories...'
});

export const CourseCategoryTablePreset = createTablePreset(courseCategoryTableDefinition);

export const CourseTableConfig = {
	CourseCategoryTableConfig: () => CourseCategoryTablePreset.config(),
	CourseCategoryTableColumns: () => CourseCategoryTablePreset.columns(),
	CourseCategoryTableActions: (course: Course) => CourseCategoryTablePreset.getActions(course),
	CourseCategoryTableProps: () => CourseCategoryTablePreset.props(),

	all: () => CourseCategoryTablePreset.all()
};