import type { FAQCategory } from '$lib/types/entities/faqCategory';
import { type TableColumn, TableColumnBuilder, type TableConfig } from '$lib/types/ui/table';

// Table Configuration
export const faqCategoryTableConfig: TableConfig<FAQCategory> = {
	idField: 'id', // or 'id' - check what your API returns
	titleField: 'name',
	createButtonLabel: 'Create Category',
	loadingTitle: 'Loading Categories',
	loadingDescription: 'Please wait while we fetch your FAQ categories...',
	itemName: 'category',
	itemNamePlural: 'categories'
};

// Table Column Definition
export const faqCategoryTableColumns: TableColumn<FAQCategory>[] = [
	{
		key: 'id',
		header: 'ID',
		searchable: false,
		cellClassName: 'font-mono text-xs text-slate-500'
	},
	{
		key: 'name',
		header: 'Name',
		searchable: true,
	},
	{
		key: 'iconClass',
		header: 'Icon',
		searchable: true,
		renderType: 'custom',
		cellClassName: 'font-semibold text-slate-900'
	},

	{
		key: 'displayOrder',
		header: 'Order',
		searchable: false,
		cellClassName: 'text-center',
		headerClassName: 'text-center',
		width: 'w-20'
	},
	TableColumnBuilder.count<FAQCategory>('faqCount', 'Questions', {
		singular: 'FAQ',
		plural: 'FAQs',
		color: 'bg-slate-100 text-slate-700'
	}),
	TableColumnBuilder.date<FAQCategory>('createdAt', 'Created', {
		format: 'short'
	})
];

// Table callbacks definition
