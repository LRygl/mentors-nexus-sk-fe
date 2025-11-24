import {
	createTablePreset,
	defineTableConfig,
	TableConfigFactory
} from '$lib/components/Data Table/Configurations/DataTableConfigurationFactory';
import type { LegalTopic } from '$lib/types/entities/LegalTopic';
import { Eye } from '@lucide/svelte';
import { ActionType } from '$lib/types';
import type { User } from '$lib/types/entities/User';
import Trash2Icon from '@lucide/svelte/icons/trash-2';

const legalTopicTableConfiguration: TableConfigFactory<LegalTopic> =  defineTableConfig<LegalTopic>({
	entity: 'Legal Topic',
	entityPlural: 'Legal Topics',
	idField: 'id',
	titleField: 'title',

	columns: [
		{
			key: 'id',
			header: 'ID',
			type: 'text',
			searchable: false,
			sortable: true,
			cellClassName: 'font-mono text-xs text-slate-500'
		},
		{
			key: 'name',
			header: 'Name',
			type: 'text',
			searchable: false,
			sortable: true,
			cellClassName: 'font-mono text-xs text-slate-500'
		},
		{
			key: 'showCta',
			header: 'CTA',
			type: 'boolean',
			searchable: false,
			sortable: true,
			cellClassName: 'font-mono text-xs text-slate-500'
		},
		{
			key: 'effectiveAt',
			header: 'Effective Date',
			type: 'datetime',
			searchable: false,
			sortable: true,
			cellClassName: 'font-mono text-xs text-slate-500'
		},
	],
	actions: [
		{
			id: 'view',
			label: 'View Details',
			description: `See full Lesson details`,
			icon: Eye,
			variant: ActionType.DEFAULT,
			group: 'Actions'
		},
		{
			id: 'delete',
			label: 'Delete',
			description: `See full Lesson details`,
			icon: Trash2Icon,
			variant: ActionType.DANGER,
			group: 'Actions'
		},
	],

	searchable: true,
	filterable: true,
	selectable: true,
	exportable: true,
	sortable: true,

	emptyTitle: 'No Topics',
	emptyDescription:
		'Get started by defining questions which might be interesting to your users and provide simple answers.',
	emptyActionLabel: 'Create your first Legal Topic!',
	loadingTitle: 'Loading Legal Topics',
	loadingDescription: 'Please wait while we fetch your Legal Topics...',
	searchPlaceholder: 'Search Legal Topics...'
});

export const LegalTopicTableConfiguration = createTablePreset(legalTopicTableConfiguration);

export const LegalTableConfig = {
	LegalTopicTableConfig: () => LegalTopicTableConfiguration.config(),
	LegalTopicTableColumns: () => LegalTopicTableConfiguration.columns(),
	LegalTopicTableActions: (user: User) => LegalTopicTableConfiguration.getActions(user),
	LegalTopicTableProps: () => LegalTopicTableConfiguration.props(),

	all: () => LegalTopicTableConfiguration.all()
};