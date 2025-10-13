// ============================================================================
// FAQ TABLE CONFIGURATION
// Complete table setup in one file
// ============================================================================

import type { FAQ } from '$lib/types/entities/faq';
import { defineTableConfig, createTablePreset } from '$lib/components/Data Table/Configurations/DataTableConfigurationFactory';
import { ActionType } from '$lib/types';
import { CheckCircle, Edit, Eye, LinkIcon, Star, StarOff, Trash2, XCircle } from '@lucide/svelte';

/**
 * FAQ Table Definition
 */
const faqTableDefinition = defineTableConfig<FAQ>({
	// Entity info
	entity: 'FAQ',
	entityPlural: 'FAQs',

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
			width: 'w-20'
		},
		{
			key: 'question',
			header: 'Question',
			type: 'text',
			searchable: true,
			sortable: true,
			cellClassName: 'font-semibold text-slate-900'
		},
		{
			key: 'categoryName',
			header: 'Category',
			type: 'badge',
			searchable: true,
			sortable: true,
			color: 'bg-blue-100 text-blue-700',
			width: 'w-40',
			accessor: (faq: FAQ)=> {
				if (!faq.category) return 'Uncategorized';
				return faq.category.name;
			}
		},
		{
			key: 'isPublished',
			header: 'Status',
			type: 'custom',
			searchable: false,
			sortable: true,
			cellClassName: 'text-center',
			headerClassName: 'text-center',
			width: 'w-32',
			customRender: (faq: FAQ) => {  // ← Receives the whole FAQ object
				if (faq.isPublished) {  // ← Access the property
					return `
        <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-100 text-green-700">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
          <span class="text-sm font-medium">Published</span>
        </div>
      `;
				}
				return `
      <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-100 text-gray-600">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="8" y1="12" x2="16" y2="12"></line>
        </svg>
        <span class="text-sm font-medium">Draft</span>
      </div>
    `;
			}
		},
		{
			key: 'isFeatured',
			header: 'Featured',
			type: 'custom',
			searchable: false,
			sortable: true,
			cellClassName: 'text-center',
			headerClassName: 'text-center',
			width: 'w-24',
			customRender: (faq: FAQ) => {  // ← Receives the whole FAQ object
				if (faq.isFeatured) {  // ← Access the property
					return `
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" class="text-yellow-500 inline-block">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
        </svg>
      `;
				}
				return `<span class="text-gray-300 text-xl">-</span>`;
			}
		},
		{
			key: 'viewCount',
			header: 'Views',
			type: 'count',
			singular: 'view',
			plural: 'views',
			color: 'bg-green-100 text-green-700',
			searchable: false,
			sortable: true,
			width: 'w-28'
		},
		{
			key: 'helpfulnessRatio',
			header: 'Helpful',
			type: 'custom',
			searchable: false,
			sortable: true,
			width: 'w-28',
			customRender: (value: number) => {
				const percentage = Math.round(value * 100);
				const color = percentage >= 75 ? 'text-green-600' :
					percentage >= 50 ? 'text-yellow-600' : 'text-red-600';
				return `<span class="font-semibold ${color}">${percentage}%</span>`;
			}
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

	// Action definitions
	actions: [
		// Primary Actions
		{
			id: 'edit',
			label: 'Edit FAQ',
			description: 'Modify question and answer',
			icon: Edit,
			variant: ActionType.DEFAULT,
			group: 'Actions'
		},
		{
			id: 'link-faq',
			label: 'Link to Category',
			description: 'Assign to a category',
			icon: LinkIcon,
			variant: ActionType.DEFAULT,
			group: 'Actions',
			condition: (faq: FAQ) => !faq.category
		},
		{
			id: 'unlink-faq',
			label: 'Unlink from Category',
			description: 'Remove from category',
			icon: LinkIcon,
			variant: ActionType.WARNING,
			group: 'Actions',
			condition: (faq: FAQ) => !!faq.category
		},

		// Publishing Actions
		{
			id: 'publish',
			label: 'Publish',
			description: 'Make FAQ visible',
			icon: CheckCircle,
			variant: ActionType.SUCCESS,
			group: 'Publishing',
			condition: (faq: FAQ) => !faq.isPublished
		},
		{
			id: 'unpublish',
			label: 'Unpublish',
			description: 'Hide FAQ from users',
			icon: XCircle,
			variant: ActionType.WARNING,
			group: 'Publishing',
			condition: (faq: FAQ) => faq.isPublished
		},
		{
			id: 'feature',
			label: 'Feature',
			description: 'Add to featured section',
			icon: Star,
			variant: ActionType.DEFAULT,
			group: 'Publishing',
			condition: (faq: FAQ) => !faq.isFeatured
		},
		{
			id: 'unfeature',
			label: 'Remove Feature',
			description: 'Remove from featured',
			icon: StarOff,
			variant: ActionType.DEFAULT,
			group: 'Publishing',
			condition: (faq: FAQ) => faq.isFeatured
		},

		// Management
		{
			id: 'delete',
			label: 'Delete FAQ',
			description: 'Permanent removal',
			icon: Trash2,
			variant: ActionType.DANGER,
			group: 'Management'
		}
	],

	// Table behavior
	searchable: true,
	filterable: true,
	selectable: true,
	exportable: true,
	sortable: true,

	// Custom messages
	emptyTitle: 'No FAQs yet',
	emptyDescription: 'Get started by defining questions which might be interesting to your users and provide simple answers.',
	emptyActionLabel: 'Create your first FAQ!',
	loadingTitle: 'Loading FAQs',
	loadingDescription: 'Please wait while we fetch your FAQs...',
	searchPlaceholder: 'Search FAQs...'
});

/**
 * Export preset for easy use in components
 */
export const FAQTablePreset = createTablePreset(faqTableDefinition);

/**
 * All-in-one export for simple usage
 */
export const FAQTableConfiguration = {
	// Individual exports
	FAQTableConfig: () => FAQTablePreset.config(),
	FAQTableColumnsConfig: () => FAQTablePreset.columns(),
	FAQTableActionsConfig: (faq: FAQ) => FAQTablePreset.getActions(faq),
	FAQTablePropsConfig: () => FAQTablePreset.props(),

	// All at once
	all: () => FAQTablePreset.all()
};