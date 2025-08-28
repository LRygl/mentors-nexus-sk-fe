// src/lib/utils/tableUtils.ts
import type { TableColumn, TableConfig, TableCallbacks } from '$lib/types/ui/table';
import { goto } from '$app/navigation';

/**
 * Table Configuration Factory
 * Provides pre-configured table setups for common entity types
 */
export class TableConfigFactory {
	/**
	 * Creates a standard CRUD table configuration
	 */
	static createCrudConfig<T>(
		entityName: string,
		entityNamePlural: string,
		idField: keyof T = 'id' as keyof T,
		titleField?: keyof T
	): TableConfig<T> {
		return {
			idField,
			titleField,
			createButtonLabel: `Create ${entityName}`,
			loadingTitle: `Loading ${entityNamePlural}`,
			loadingDescription: `Please wait while we fetch your ${entityNamePlural.toLowerCase()}...`,
			itemName: entityName.toLowerCase(),
			itemNamePlural: entityNamePlural.toLowerCase()
		};
	}

	/**
	 * Creates standard CRUD callbacks with navigation
	 */
	static createCrudCallbacks<T>(
		basePath: string,
		store: any,
		entityName: string,
		options: {
			onRowClick?: (item: T) => void;
			onCreate?: () => void;
			customActions?: Record<string, (item: T) => Promise<void>>;
		} = {}
	): TableCallbacks<T> {
		return {
			onRowClick: options.onRowClick || ((item: any) => {
				goto(`${basePath}/${item.id}`);
			}),

			onAction: async (actionId, item: any) => {
				// Handle custom actions first
				if (options.customActions?.[actionId]) {
					await options.customActions[actionId](item);
					return;
				}

				// Standard CRUD actions
				switch (actionId) {
					case 'view':
						await goto(`${basePath}/${item.id}`);
						break;
					case 'edit':
						await goto(`${basePath}/${item.id}/edit`);
						break;
					case 'duplicate':
						if (store.duplicateItem) {
							await store.duplicateItem(item.id);
							await store.refresh();
						}
						break;
					case 'delete':
						if (confirm(`Are you sure you want to delete this ${entityName.toLowerCase()}?`)) {
							await store.deleteItem?.(item.id);
							await store.refresh();
						}
						break;
					default:
						console.warn('Unknown action:', actionId);
				}
			},

			onRefresh: async () => {
				await store.refresh();
			},

			onCreate: options.onCreate || (() => {
				goto(`${basePath}/create`);
			}),

			onExport: (data) => {
				exportToCSV(data, `${entityName.toLowerCase()}s.csv`);
			},

			onBulkDelete: async (selectedIds) => {
				const count = selectedIds.length;
				if (confirm(`Are you sure you want to delete ${count} ${count > 1 ? entityName.toLowerCase() + 's' : entityName.toLowerCase()}?`)) {
					for (const id of selectedIds) {
						await store.deleteItem?.(id);
					}
					await store.refresh();
				}
			}
		};
	}
}

/**
 * Common table column patterns
 */
export class TableColumnPatterns {
	/**
	 * User display column with avatar and details
	 */
	static userColumn<T>(
		firstNameKey: keyof T = 'firstName' as keyof T,
		lastNameKey: keyof T = 'lastName' as keyof T,
		emailKey: keyof T = 'email' as keyof T,
		avatarKey?: keyof T
	): TableColumn<T> {
		return {
			key: firstNameKey,
			header: 'User',
			searchable: true,
			render: (item, value) => `
				<div class="flex items-center gap-3">
					<div class="w-10 h-10 rounded-full text-white bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-sm font-medium">
						${item[firstNameKey]?.[0] || ''}${item[lastNameKey]?.[0] || ''}
					</div>
					<div>
						<div class="text-sm font-semibold text-slate-900">
							${item[firstNameKey]} ${item[lastNameKey]}
						</div>
						<div class="text-xs text-slate-500">${item[emailKey]}</div>
					</div>
				</div>
			`
		};
	}

	/**
	 * Status badge column
	 */
	static statusBadge<T>(
		key: keyof T,
		statusMap: Record<string, { color: string; label?: string }> = {}
	): TableColumn<T> {
		const defaultMap = {
			active: { color: 'bg-green-100 text-green-800', label: 'Active' },
			inactive: { color: 'bg-red-100 text-red-800', label: 'Inactive' },
			pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
			draft: { color: 'bg-gray-100 text-gray-800', label: 'Draft' },
			published: { color: 'bg-blue-100 text-blue-800', label: 'Published' }
		};

		return {
			key,
			header: 'Status',
			searchable: true,
			render: (item, value) => {
				const status = String(value).toLowerCase();
				const config = statusMap[status] || defaultMap[status] || defaultMap.inactive;
				const label = config.label || String(value);

				return `
					<span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border border-slate-200 ${config.color}">
						${label}
					</span>
				`;
			}
		};
	}

	/**
	 * Count badge column
	 */
	static countBadge<T>(
		key: keyof T,
		label: string,
		options: {
			singular?: string;
			plural?: string;
			color?: string;
			showZero?: boolean;
		} = {}
	): TableColumn<T> {
		return {
			key,
			header: label,
			searchable: false,
			render: (item, value) => {
				const count = Number(value) || 0;
				if (!options.showZero && count === 0) {
					return '<span class="text-slate-400 text-xs">None</span>';
				}

				const countLabel = count === 1
					? (options.singular || label.slice(0, -1))
					: (options.plural || label);

				const colorClass = options.color || 'bg-slate-100 text-slate-700';

				return `
					<span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border border-slate-200 ${colorClass}">
						${count} ${countLabel.toLowerCase()}
					</span>
				`;
			}
		};
	}

	/**
	 * Image thumbnail column
	 */
	static imageThumbnail<T>(
		key: keyof T,
		header: string = 'Image',
		fallbackIcon: string = '🖼️'
	): TableColumn<T> {
		return {
			key,
			header,
			searchable: false,
			render: (item, value) => {
				if (!value) {
					return `
						<div class="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-lg">
							${fallbackIcon}
						</div>
					`;
				}

				return `
					<img 
						src="${value}" 
						alt="${header}"
						class="w-10 h-10 object-cover rounded-lg border border-slate-200"
						onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
					/>
					<div class="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-lg hidden">
						${fallbackIcon}
					</div>
				`;
			},
			cellClassName: 'py-2'
		};
	}

	/**
	 * Progress bar column
	 */
	static progressBar<T>(
		key: keyof T,
		header: string = 'Progress',
		options: {
			max?: number;
			color?: string;
			showPercentage?: boolean;
		} = {}
	): TableColumn<T> {
		return {
			key,
			header,
			searchable: false,
			render: (item, value) => {
				const current = Number(value) || 0;
				const max = options.max || 100;
				const percentage = Math.round((current / max) * 100);
				const color = options.color || 'bg-indigo-500';

				return `
					<div class="flex items-center gap-3">
						<div class="flex-1 bg-slate-200 rounded-full h-2 min-w-[60px]">
							<div class="${color} h-2 rounded-full transition-all duration-300" style="width: ${percentage}%"></div>
						</div>
						${options.showPercentage !== false ? `<span class="text-xs font-medium text-slate-600 min-w-[35px]">${percentage}%</span>` : ''}
					</div>
				`;
			}
		};
	}
}

/**
 * Export utilities
 */
export function exportToCSV(data: any[], filename: string): void {
	if (data.length === 0) return;

	// Get all unique keys from all objects
	const allKeys = new Set<string>();
	data.forEach(item => {
		Object.keys(item).forEach(key => allKeys.add(key));
	});

	const headers = Array.from(allKeys);
	const csvRows = [
		headers.join(','),
		...data.map(row =>
			headers.map(header => {
				const value = row[header] ?? '';
				// Escape quotes and wrap in quotes if contains comma, quote, or newline
				const stringValue = String(value);
				if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
					return `"${stringValue.replace(/"/g, '""')}"`;
				}
				return stringValue;
			}).join(',')
		)
	];

	const csv = csvRows.join('\n');
	const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
	const link = document.createElement('a');
	const url = URL.createObjectURL(blob);

	link.setAttribute('href', url);
	link.setAttribute('download', filename);
	link.style.visibility = 'hidden';

	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);

	URL.revokeObjectURL(url);
}

/**
 * Time formatting utilities
 */
export function formatRelativeTime(date: Date | string): string {
	const now = new Date();
	const targetDate = typeof date === 'string' ? new Date(date) : date;
	const diffInSeconds = Math.floor((now.getTime() - targetDate.getTime()) / 1000);

	if (diffInSeconds < 60) return 'Just now';
	if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
	if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
	if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
	if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 604800)}w ago`;

	return targetDate.toLocaleDateString();
}