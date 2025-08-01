// src/routes/admin/faq-category/faqCategoryColumns.ts

import type { FAQCategory } from '$lib/types/faq';
import { faqCategoryAdminStore } from '$lib/stores/faqCategoryAdminStore';
import { getErrorMessage, logError, handleApiError, showErrorNotification, showSuccessNotification } from '$lib/utils/errorUtils';

/**
 * Column definition matching your DataTable component's expected ColumnDef type
 * Adjust these properties based on your actual DataTable implementation
 */
export interface ColumnDef<TData = unknown, TValue = unknown> {
	id?: string;
	accessorKey?: keyof TData;
	accessorFn?: (row: TData) => TValue;
	header?: string | ((props: any) => any);
	cell?: (props: { row: { original: TData }; getValue: () => TValue }) => any;
	enableSorting?: boolean;
	enableHiding?: boolean;
	size?: number;
	minSize?: number;
	maxSize?: number;
	meta?: {
		align?: 'left' | 'center' | 'right';
		className?: string;
	};
}

export const faqCategoryColumns: ColumnDef<FAQCategory>[] = [
	{
		id: 'name',
		accessorKey: 'name',
		header: 'Category',
		enableSorting: true,
		cell: ({ row }) => {
			const category = row.original;
			const icon = category.iconClass
				? `<i class="${category.iconClass}" style="color: ${category.colorCode}; margin-right: 0.75rem;"></i>`
				: '';
			const description = category.description
				? `<div class="text-sm text-gray-500">${category.description}</div>`
				: '';

			return `
				<div class="flex items-center">
					${icon}
					<div>
						<div class="text-sm font-medium text-gray-900">${category.name}</div>
						${description}
					</div>
				</div>
			`;
		}
	},
	{
		id: 'slug',
		accessorKey: 'slug',
		header: 'Slug',
		enableSorting: true,
		cell: ({ getValue }) => {
			const slug = getValue() as string;
			return `<code class="text-xs bg-gray-100 px-2 py-1 rounded font-mono">${slug}</code>`;
		}
	},
	{
		id: 'status',
		accessorKey: 'isActive',
		header: 'Status',
		enableSorting: true,
		meta: { align: 'center' },
		cell: ({ getValue }) => {
			const isActive = getValue() as boolean;
			const statusClass = isActive
				? 'bg-green-100 text-green-800'
				: 'bg-red-100 text-red-800';
			const statusText = isActive ? 'Active' : 'Inactive';

			return `<span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusClass}">${statusText}</span>`;
		},
		size: 100
	},
	{
		id: 'displayOrder',
		accessorKey: 'displayOrder',
		header: 'Order',
		enableSorting: true,
		meta: { align: 'center' },
		cell: ({ getValue }) => {
			const order = getValue() as number;
			return `<span class="font-mono text-sm font-medium">${order}</span>`;
		},
		size: 80
	},
	{
		id: 'faqCount',
		accessorKey: 'faqCount',
		header: 'FAQs',
		enableSorting: true,
		meta: { align: 'center' },
		cell: ({ getValue }) => {
			const count = (getValue() as number) || 0;
			const badgeClass = count > 0 ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600';
			return `<span class="inline-flex px-2 py-1 text-xs font-medium rounded-full ${badgeClass}">${count}</span>`;
		},
		size: 80
	},
	{
		id: 'createdAt',
		accessorKey: 'createdAt',
		header: 'Created',
		enableSorting: true,
		cell: ({ getValue }) => {
			const dateString = getValue() as string;
			const date = new Date(dateString);
			return `<span class="text-sm text-gray-600">${date.toLocaleDateString()}</span>`;
		},
		size: 120
	},
	{
		id: 'actions',
		header: 'Actions',
		enableSorting: false,
		meta: { align: 'right' },
		cell: ({ row }) => {
			const category = row.original;
			return `
				<div class="flex space-x-2 justify-end">
					<button 
						class="text-blue-600 hover:text-blue-900 text-sm font-medium hover:underline"
						data-action="edit"
						data-category-id="${category.id}"
						type="button"
					>
						Edit
					</button>
					<button 
						class="text-green-600 hover:text-green-900 text-sm font-medium hover:underline"
						data-action="toggle"
						data-category-id="${category.id}"
						data-current-status="${category.isActive}"
						type="button"
					>
						${category.isActive ? 'Deactivate' : 'Activate'}
					</button>
					<button 
						class="text-red-600 hover:text-red-900 text-sm font-medium hover:underline"
						data-action="delete"
						data-category-id="${category.id}"
						type="button"
					>
						Delete
					</button>
				</div>
			`;
		},
		size: 160
	}
];

/**
 * Handle table row actions (for use with DataTable component)
 * Call this function from your page component to handle button clicks
 */
export async function handleTableAction(event: Event, action: string, categoryId: number, additionalData?: any) {
	console.log(`🔄 Handling ${action} for category ${categoryId}`);

	try {
		switch (action) {
			case 'edit':
				await faqCategoryAdminStore.loadCategory(categoryId);
				// Use a custom event to communicate with the parent component
				window.dispatchEvent(new CustomEvent('openFAQCategoryForm', {
					detail: { categoryId, action: 'edit' }
				}));
				break;

			case 'toggle':
				const currentStatus = additionalData?.currentStatus === 'true';
				await faqCategoryAdminStore.toggleCategoryStatus(categoryId, !currentStatus);
				const statusText = currentStatus ? 'deactivated' : 'activated';
				showSuccessNotification(`Category ${statusText} successfully`);
				console.log('✅ Category status toggled');
				break;

			case 'delete':
				if (confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
					await faqCategoryAdminStore.deleteCategory(categoryId);
					showSuccessNotification('Category deleted successfully');
					console.log('✅ Category deleted');
				}
				break;

			default:
				console.warn(`Unknown action: ${action}`);
		}
	} catch (error) {
		const errorMessage = handleApiError(error, `${action} category`);
		logError(`Handle table action: ${action}`, error, { categoryId });
		showErrorNotification(errorMessage);
	}
}

/**
 * Alternative simplified column configuration (if the above doesn't work)
 * Use this if your DataTable component has a simpler column definition format
 */
export const simpleFaqCategoryColumns = [
	{
		key: 'name',
		header: 'Category',
		sortable: true
	},
	{
		key: 'slug',
		header: 'Slug',
		sortable: true
	},
	{
		key: 'isActive',
		header: 'Status',
		sortable: true
	},
	{
		key: 'displayOrder',
		header: 'Order',
		sortable: true
	},
	{
		key: 'actions',
		header: 'Actions',
		sortable: false
	}
];