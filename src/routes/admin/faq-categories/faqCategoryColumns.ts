// src/routes/admin/faq-categories/faqCategoryColumns.ts

import type { ColumnDef } from '@tanstack/table-core';
import type { FAQCategory } from '$lib/types/faq';
import { formatDateTime } from '$lib/components/utils/dateTimeFormat';

/**
 * DataTable column definitions for FAQ Categories
 * Used with TanStack Table in the admin interface
 */
export const faqCategoryColumns: ColumnDef<FAQCategory>[] = [
	{
		id: 'displayOrder',
		accessorKey: 'displayOrder',
		header: 'Order',
		cell: ({ row }) => {
			const order = row.getValue('displayOrder') as number;
			return `<div class="text-center font-mono text-sm">${order}</div>`;
		},
		size: 60,
		meta: {
			headerClassName: 'text-center'
		}
	},
	{
		id: 'name',
		accessorKey: 'name',
		header: 'Category Name',
		cell: ({ row }) => {
			const category = row.original;
			const iconClass = category.iconClass || 'lucide-folder';
			const colorCode = category.colorCode || '#6B7280';

			return `
				<div class="flex items-center gap-3">
					<div class="flex-shrink-0">
						<div class="w-8 h-8 rounded-lg flex items-center justify-center" style="background-color: ${colorCode}20; border: 1px solid ${colorCode}40;">
							<i class="${iconClass}" style="color: ${colorCode}; font-size: 14px;"></i>
						</div>
					</div>
					<div class="flex flex-col">
						<div class="font-semibold text-gray-900">${category.name}</div>
						<div class="text-xs text-gray-500">/${category.slug}</div>
					</div>
				</div>
			`;
		},
		size: 200
	},
	{
		id: 'description',
		accessorKey: 'description',
		header: 'Description',
		cell: ({ row }) => {
			const description = row.getValue('description') as string;
			if (!description) {
				return '<span class="text-gray-400 italic">No description</span>';
			}
			const truncated = description.length > 60 ? description.substring(0, 60) + '...' : description;
			return `<div class="text-sm text-gray-700" title="${description}">${truncated}</div>`;
		},
		size: 180
	},
	{
		id: 'faqCount',
		accessorKey: 'faqCount',
		header: 'FAQs',
		cell: ({ row }) => {
			const category = row.original;
			const total = category.faqCount || 0;
			const published = category.publishedFaqCount || 0;

			return `
				<div class="text-center">
					<div class="font-semibold text-gray-900">${published}</div>
					<div class="text-xs text-gray-500">${total} total</div>
				</div>
			`;
		},
		size: 80,
		meta: {
			headerClassName: 'text-center'
		}
	},
	{
		id: 'status',
		accessorKey: 'isActive',
		header: 'Status',
		cell: ({ row }) => {
			const category = row.original;
			const isActive = category.isActive;
			const isVisible = category.isVisible;

			let statusClass = '';
			let statusText = '';
			let dotColor = '';

			if (isActive && isVisible) {
				statusClass = 'bg-green-100 text-green-800 border-green-200';
				statusText = 'Active';
				dotColor = 'bg-green-500';
			} else if (isActive && !isVisible) {
				statusClass = 'bg-yellow-100 text-yellow-800 border-yellow-200';
				statusText = 'Hidden';
				dotColor = 'bg-yellow-500';
			} else {
				statusClass = 'bg-gray-100 text-gray-800 border-gray-200';
				statusText = 'Inactive';
				dotColor = 'bg-gray-500';
			}

			return `
				<div class="inline-flex items-center gap-2 px-2 py-1 rounded-full text-xs font-medium border ${statusClass}">
					<div class="w-2 h-2 rounded-full ${dotColor}"></div>
					${statusText}
				</div>
			`;
		},
		size: 100,
		meta: {
			headerClassName: 'text-center'
		}
	},
	{
		id: 'createdAt',
		accessorKey: 'createdAt',
		header: 'Created',
		cell: ({ row }) => {
			const createdAt = row.getValue('createdAt') as string;
			const createdBy = row.original.createdBy;
			const formatted = formatDateTime(new Date(createdAt));

			return `
				<div class="text-sm">
					<div class="text-gray-900">${formatted}</div>
					${createdBy ? `<div class="text-xs text-gray-500">by ${createdBy}</div>` : ''}
				</div>
			`;
		},
		size: 140
	},
	{
		id: 'actions',
		header: 'Actions',
		cell: ({ row }) => {
			const category = row.original;
			return `
				<div class="flex items-center gap-1">
					<button 
						class="action-btn-edit p-2 hover:bg-blue-100 rounded-md transition-colors" 
						data-category-id="${category.id}"
						title="Edit Category"
					>
						<svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
						</svg>
					</button>
					<button 
						class="action-btn-toggle p-2 hover:bg-yellow-100 rounded-md transition-colors" 
						data-category-id="${category.id}"
						data-is-active="${category.isActive}"
						title="${category.isActive ? 'Deactivate' : 'Activate'} Category"
					>
						<svg class="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							${category.isActive ?
				'<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>' :
				'<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M19 10a9 9 0 11-18 0 9 9 0 0118 0z"></path>'
			}
						</svg>
					</button>
					<button 
						class="action-btn-delete p-2 hover:bg-red-100 rounded-md transition-colors" 
						data-category-id="${category.id}"
						data-category-name="${category.name}"
						title="Delete Category"
					>
						<svg class="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
						</svg>
					</button>
				</div>
			`;
		},
		size: 120,
		meta: {
			headerClassName: 'text-center'
		}
	}
];

/**
 * Column visibility configuration
 */
export const columnVisibilityOptions = [
	{ key: 'displayOrder', label: 'Display Order', defaultVisible: true },
	{ key: 'name', label: 'Category Name', defaultVisible: true },
	{ key: 'description', label: 'Description', defaultVisible: true },
	{ key: 'faqCount', label: 'FAQ Count', defaultVisible: true },
	{ key: 'status', label: 'Status', defaultVisible: true },
	{ key: 'createdAt', label: 'Created Date', defaultVisible: true },
	{ key: 'actions', label: 'Actions', defaultVisible: true }
];

/**
 * Default column visibility state
 */
export const defaultColumnVisibility = columnVisibilityOptions.reduce((acc, col) => {
	acc[col.key] = col.defaultVisible;
	return acc;
}, {} as Record<string, boolean>);