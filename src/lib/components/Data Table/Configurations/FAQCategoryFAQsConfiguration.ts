import { createTablePreset, defineTableConfig } from '$lib/components/Data Table/Configurations/DataTableConfigurationFactory';
import { ActionType, type FAQ } from '$lib/types';
import { Eye, LinkIcon, CheckCircle, XCircle } from '@lucide/svelte';
import type { CourseCategory } from '$lib/types/entities/CourseCategory';

/**
 * Table Definition
 */
const faqCategoryFAQsTableDefinition = defineTableConfig<FAQ>({
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
			key: 'courseCount',
			header: 'Courses',
			type: 'badge',
			searchable: false,
			sortable: true,
			color: 'bg-blue-100 text-blue-700',
			width: 'w-32',
			accessor: (category: CourseCategory) => {
				console.log('Category object:', category);
				console.log('Has courses?:', !!category.courses);
				console.log('Courses count:', category.courses?.length);

				const count = category.courses?.length ?? 0;

				if (count === 0) return 'No courses';
				return `${count} ${count === 1 ? 'course' : 'courses'}`;
			}
		},
		{
			key: 'isPublished',
			header: 'Status',
			type: 'boolean',
			trueLabel: 'Published',
			falseLabel: 'Draft',
			searchable: false,
			sortable: true,
			cellClassName: 'text-center',
			headerClassName: 'text-center',
			width: 'w-32'
		},
		{
			key: 'isFeatured',
			header: 'Featured',
			type: 'boolean',
			trueLabel: '⭐',
			falseLabel: '-',
			searchable: false,
			sortable: true,
			cellClassName: 'text-center text-xl',
			headerClassName: 'text-center',
			width: 'w-24'
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
			key: 'displayOrder',
			header: 'Order',
			type: 'number',
			searchable: false,
			sortable: true,
			cellClassName: 'text-center text-xs',
			headerClassName: 'text-center',
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
			id: 'view',
			label: 'View Details',
			description: 'See full FAQ details',
			icon: Eye,
			variant: ActionType.DEFAULT,
			group: 'Actions'
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
export const FAQListTablePreset = createTablePreset(faqCategoryFAQsTableDefinition);

/**
 * All-in-one export for simple usage
 */
export const FAQTableConfiguration = {
	// Individual exports
	FAQListTableConfig: () => FAQListTablePreset.config(),
	FAQListTableColumnsConfig: () => FAQListTablePreset.columns(),
	FAQListTableActionsConfig: (faq: FAQ) => FAQListTablePreset.getActions(faq),
	FAQListTablePropsConfig: () => FAQListTablePreset.props(),

	// All at once
	all: () => FAQListTablePreset.all()
};