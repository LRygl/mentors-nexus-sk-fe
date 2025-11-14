import {
	createTablePreset,
	defineTableConfig
} from '$lib/components/Data Table/Configurations/DataTableConfigurationFactory';
import type { Lesson } from '$lib/types/entities/Lesson';
import { Eye, Trash2Icon } from '@lucide/svelte';
import { ActionType } from '$lib/types';
import type { User } from '$lib/types/entities/User';
import { formatDuration } from '$lib/utils/DurationUtils';

const lessonTableDefinition = defineTableConfig<Lesson>({
	entity: 'Lesson',
	entityPlural: 'Lessons',

	idField: 'id',
	titleField: 'title',

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
			key: 'title',
			header: 'Title',
			type: 'text',
			searchable: false,
			sortable: true,
			cellClassName: 'font-mono text-xs text-slate-500',
		},
		{
			key: 'duration',
			header: 'Duration',
			type: 'text',
			searchable: false,
			sortable: true,
			cellClassName: 'font-mono text-xs text-slate-500',
		},
		{
			key: 'createdAt',
			header: 'Created',
			type: 'datetime',
			searchable: false,
			sortable: true,
			cellClassName: 'font-mono text-xs text-slate-500',
		},
		{
			key: 'updatedAt',
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
		{
			id: 'delete',
			label: 'Delete',
			description: 'Delete course record',
			icon: Trash2Icon,
			variant: ActionType.DANGER,
			group: 'Management'
		},
	],

	searchable: true,
	filterable: true,
	selectable: true,
	exportable: true,
	sortable: true,

	emptyTitle: 'No Terminals',
	emptyDescription: 'Get started by defining questions which might be interesting to your users and provide simple answers.',
	emptyActionLabel: 'Create your first Terminal!',
	loadingTitle: 'Loading Terminals',
	loadingDescription: 'Please wait while we fetch your FAQ Categories...',
	searchPlaceholder: 'Search FAQ Categories...'
});

export const LessonTablePreset = createTablePreset(lessonTableDefinition);

export const UserTableConfig = {
	LessonTableConfig: () => LessonTablePreset.config(),
	LessonTableColumns: () => LessonTablePreset.columns(),
	LessonTableActions: (user: User) => LessonTablePreset.getActions(user),
	LessonTableProps: () => LessonTablePreset.props(),

	all: () => LessonTablePreset.all()
};