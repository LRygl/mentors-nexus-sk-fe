// ============================================================================
// FAQ CATEGORY TABLE CONFIGURATION
// Complete table setup in one file
// ============================================================================


import {
	createTablePreset,
	defineTableConfig
} from '$lib/components/Data Table/Configurations/DataTableConfigurationFactory';
import type { FAQCategory } from '$lib/types/entities/faqCategory';
import { ActionType } from '$lib/types';
import { Eye, Trash } from '@lucide/svelte';

const faqCategoryTableDefinition = defineTableConfig<FAQCategory>({
	// Entity info
	entity: 'FAQ Category',
	entityPlural: 'FAQ Categories',

	// ID and title fields
	idField: 'id',
	titleField: 'question',

	// Column definitions
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
			searchable: true,
			sortable: true,
			cellClassName: 'font-semibold text-slate-900'
		},
		{
			key: 'faqCount',
			header: 'Questions',
			searchable: false,
			sortable: true,
			renderType: 'default',
			cellClassName: 'text-center',
			render: (category: FAQCategory) => {
				// ✅ Use faqs.length for accurate count
				const count = category.faqs?.length || category.faqCount || 0;
				return {
					text: `${count} ${count === 1 ? 'FAQ' : 'FAQs'}`,
					variant: 'default',
					className: 'bg-slate-100 text-slate-700'
				};
			}
		},
		{
			key: 'isActive',
			header: 'Visible',
			type: 'badge',
			format: 'short',
		},
		{
			key: 'createdAt',
			header: 'Created',
			type: 'datetime',
			format: 'short',
			searchable: false,
			sortable: true,
			cellClassName: 'text-xs'
		},
		{
			key: 'updatedAt',
			header: 'Updated',
			type: 'date',
			format: 'relative',
			searchable: false,
			sortable: true,
			cellClassName: 'text-xs'
		}
	],
	
	// Actions definitions
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
			label: 'Delete Category',
			description: 'Remove the FAQ Category',
			icon: Trash,
			variant: ActionType.DANGER,
			group: 'Management'
		},
	],
	
	searchable: true,
	filterable: true,
	selectable: true,
	exportable: true,
	sortable: true,

	emptyTitle: 'No FAQ Categories yet',
	emptyDescription: 'Get started by defining questions which might be interesting to your users and provide simple answers.',
	emptyActionLabel: 'Create your first FAQ Category!',
	loadingTitle: 'Loading FAQ Categories',
	loadingDescription: 'Please wait while we fetch your FAQ Categories...',
	searchPlaceholder: 'Search FAQ Categories...'
});

/**
 * Export preset for easy use in components
 */
export const FAQCategoryTablePreset = createTablePreset(faqCategoryTableDefinition)

/**
 * All-in-one export for simple usage
 */

export const FAQCategoryTableConfig = {
	FAQCategoryConfig: () => FAQCategoryTablePreset.config(),
	FAQCategoryTableColumns: () => FAQCategoryTablePreset.columns(),
	FAQCategoryTableActions: (category: FAQCategory) => FAQCategoryTablePreset.getActions(category),
	FAQCategoryTableProps: () => FAQCategoryTablePreset.props(),

	// Export all at once
	all: () => FAQCategoryTablePreset.all()
};