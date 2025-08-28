// src/lib/types/ui/table.ts - Corrected Version
import type { Component, Snippet } from 'svelte';

export interface TableAction {
	id: string;
	label: string;
	icon?: Component;
	variant?: 'default' | 'destructive' | 'outline' | 'secondary';
	disabled?: boolean;
	loading?: boolean;
	divider?: boolean;
}

// Simplified column definition - no complex render functions
export interface TableColumn<T = any> {
	key: keyof T | string;
	header: string;
	accessor?: (item: T) => any;
	sortable?: boolean;
	searchable?: boolean;
	width?: string;
	align?: 'left' | 'center' | 'right';
	headerClassName?: string;
	cellClassName?: string;
	// For custom rendering, we'll use a different approach in the component
	renderType?: 'text' | 'badge' | 'user' | 'image' | 'color' | 'count' | 'date' | 'custom';
	renderOptions?: Record<string, any>; // Configuration for different render types
	renderCustom?:(item: T) => any;
}

export interface TableConfig<T = any> {
	idField: keyof T;
	titleField?: keyof T;
	createButtonLabel?: string;
	loadingTitle?: string;
	loadingDescription?: string;
	itemName?: string;
	itemNamePlural?: string;
}

export interface SelectionState {
	selectedItems: Set<string>;
	isAllSelected: boolean;
	isPartiallySelected: boolean;
}

export interface TableCallbacks<T = any> {
	onRowClick?: (item: T) => void;
	onAction?: (actionId: string, item: T) => Promise<void> | void;
	onSelectionChange?: (selectedIds: string[]) => void;
	onRefresh?: () => Promise<void> | void;
	onCreate?: () => void;
	onExport?: (data: T[]) => void;
	onSettings?: () => void;
	onBulkEdit?: (selectedIds: string[]) => void;
	onBulkDelete?: (selectedIds: string[]) => void;
}

// Utility type for table store integration
export interface TableStore<T> {
	data: T[];
	loading: boolean;
	error: string | null;
	creating?: boolean;
	createError?: string | null;
	refresh: () => Promise<void>;
	createItem?: (data: any) => Promise<T>;
}

// Simplified column builders without complex rendering
export class TableColumnBuilder<T> {
	static id<T>(key: keyof T, options: {
		prefix?: string;
		searchable?: boolean;
		width?: string;
		headerClassName?: string;
		cellClassName?: string;
	} = {}): TableColumn<T> {
		return {
			key,
			header: 'ID',
			searchable: options.searchable ?? false,
			accessor: (item) => options.prefix ? `${options.prefix}${item[key]}` : item[key],
			cellClassName: `font-mono text-xs text-slate-500 ${options.cellClassName || ''}`,
			width: options.width,
			headerClassName: options.headerClassName
		};
	}

	static text<T>(key: keyof T, header: string, options: {
		searchable?: boolean;
		width?: string;
		align?: 'left' | 'center' | 'right';
		headerClassName?: string;
		cellClassName?: string;
	} = {}): TableColumn<T> {
		return {
			key,
			header,
			searchable: options.searchable ?? true,
			width: options.width,
			align: options.align,
			headerClassName: options.headerClassName,
			cellClassName: options.cellClassName
		};
	}

	static badge<T>(key: keyof T, header: string, options: {
		colorMap?: Record<string, string>;
		searchable?: boolean;
		width?: string;
		headerClassName?: string;
		cellClassName?: string;
	} = {}): TableColumn<T> {
		return {
			key,
			header,
			searchable: options.searchable ?? true,
			renderType: 'badge',
			renderOptions: { colorMap: options.colorMap },
			width: options.width,
			headerClassName: options.headerClassName,
			cellClassName: options.cellClassName
		};
	}

	static count<T>(key: keyof T, header: string, options: {
		singular: string;
		plural: string;
		showZero?: boolean;
		color?: string;
		searchable?: boolean;
		width?: string;
		headerClassName?: string;
		cellClassName?: string;
	}): TableColumn<T> {
		return {
			key,
			header,
			searchable: options.searchable ?? false,
			renderType: 'count',
			renderOptions: {
				singular: options.singular,
				plural: options.plural,
				showZero: options.showZero,
				color: options.color
			},
			width: options.width,
			headerClassName: options.headerClassName,
			cellClassName: options.cellClassName
		};
	}

	static date<T>(key: keyof T, header: string, options: {
		format?: 'relative' | 'short' | 'long';
		searchable?: boolean;
		width?: string;
		headerClassName?: string;
		cellClassName?: string;
	} = {}): TableColumn<T> {
		return {
			key,
			header,
			searchable: options.searchable ?? false,
			renderType: 'date',
			renderOptions: { format: options.format || 'short' },
			cellClassName: `text-slate-600 ${options.cellClassName || ''}`,
			width: options.width,
			headerClassName: options.headerClassName
		};
	}
}

// Common column presets
export const CommonColumns = {
	id: <T>(key: keyof T = 'id' as keyof T) => TableColumnBuilder.id(key),
	name: <T>(key: keyof T = 'name' as keyof T) => TableColumnBuilder.text(key, 'Name'),
	title: <T>(key: keyof T = 'title' as keyof T) => TableColumnBuilder.text(key, 'Title'),
	createdAt: <T>(key: keyof T = 'createdAt' as keyof T) => TableColumnBuilder.date(key, 'Created'),
	updatedAt: <T>(key: keyof T = 'updatedAt' as keyof T) => TableColumnBuilder.date(key, 'Updated')
};

export default TableColumnBuilder;