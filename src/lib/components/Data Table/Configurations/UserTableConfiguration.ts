import {
	createTablePreset,
	defineTableConfig
} from '$lib/components/Data Table/Configurations/DataTableConfigurationFactory';
import type { User } from '$lib/types/entities/User';
import { Eye } from '@lucide/svelte';
import { ActionType } from '$lib/types';

const userTableDefinition = defineTableConfig<User>({
	entity: 'User',
	entityPlural: 'Users',

	idField: 'id',
	titleField: 'email',

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
			key: 'email',
			header: 'Email',
			type: 'text',
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

	emptyTitle: 'No Users',
	emptyDescription: 'Get started by defining questions which might be interesting to your users and provide simple answers.',
	emptyActionLabel: 'Create your first FAQ Category!',
	loadingTitle: 'Loading FAQ Categories',
	loadingDescription: 'Please wait while we fetch your FAQ Categories...',
	searchPlaceholder: 'Search FAQ Categories...'
})

export const UserTablePreset = createTablePreset(userTableDefinition);

export const UserTableConfig = {
	UserTableConfig: () => UserTablePreset.config(),
	UserTableColumns: () => UserTablePreset.columns(),
	UserTableActions: (user: User) => UserTablePreset.getActions(user),
	UserTableProps: () => UserTablePreset.props(),

	all: () => UserTablePreset.all()
};