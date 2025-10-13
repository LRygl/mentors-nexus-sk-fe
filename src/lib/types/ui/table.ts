// ============================================================================
// TABLE TYPE DEFINITIONS
// Core types for the table configuration system
// ============================================================================

import type { Component } from 'svelte';

// ============================================================================
// TABLE ACTION TYPES
// ============================================================================

export interface TableAction {
	id: string;
	label: string;
	description?: string;
	icon?: Component;
	variant?: 'default' | 'destructive' | 'outline' | 'secondary';
	disabled?: boolean;
	loading?: boolean;
	divider?: boolean;
}

// ============================================================================
// TABLE COLUMN TYPES
// ============================================================================

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

	// Rendering types
	renderType?: 'text' | 'badge' | 'user' | 'image' | 'color' | 'count' | 'date' | 'custom';
	renderOptions?: Record<string, any>;
	renderCustom?: (item: T) => any;
}

// ============================================================================
// TABLE CONFIGURATION
// ============================================================================

export interface TableConfig<T = any> {
	idField: keyof T | string;
	titleField: keyof T | string;
	createButtonLabel?: string;
	loadingTitle?: string;
	loadingDescription?: string;
	itemName?: string;
	itemNamePlural?: string;
	actionsInline?: boolean;
}

// ============================================================================
// TABLE CALLBACKS
// ============================================================================

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

// ============================================================================
// TABLE STORE INTEGRATION
// ============================================================================

export interface TableStore<T> {
	data: T[];
	loading: boolean;
	error: string | null;
	creating?: boolean;
	createError?: string | null;
	refresh: () => Promise<void>;
	createItem?: (data: any) => Promise<T>;
}

// ============================================================================
// SELECTION STATE
// ============================================================================

export interface SelectionState {
	selectedItems: Set<string>;
	isAllSelected: boolean;
	isPartiallySelected: boolean;
}

// ============================================================================
// COLUMN BUILDER HELPERS
// Convenience functions for creating common column types
// ============================================================================

export class TableColumnBuilder {
	/**
	 * Create an ID column
	 */
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
			sortable: true,
			accessor: options.prefix
				? (item) => `${options.prefix}${item[key]}`
				: undefined,
			cellClassName: `font-mono text-xs text-slate-500 ${options.cellClassName || ''}`,
			width: options.width || 'w-20',
			headerClassName: options.headerClassName
		};
	}

	/**
	 * Create a text column
	 */
	static text<T>(key: keyof T, header: string, options: {
		searchable?: boolean;
		sortable?: boolean;
		width?: string;
		align?: 'left' | 'center' | 'right';
		headerClassName?: string;
		cellClassName?: string;
	} = {}): TableColumn<T> {
		return {
			key,
			header,
			renderType: 'text',
			searchable: options.searchable ?? true,
			sortable: options.sortable ?? true,
			width: options.width,
			align: options.align,
			headerClassName: options.headerClassName,
			cellClassName: options.cellClassName
		};
	}

	/**
	 * Create a badge/status column
	 */
	static badge<T>(key: keyof T, header: string, options: {
		colorMap?: Record<string, string>;
		searchable?: boolean;
		sortable?: boolean;
		width?: string;
		headerClassName?: string;
		cellClassName?: string;
	} = {}): TableColumn<T> {
		return {
			key,
			header,
			renderType: 'badge',
			renderOptions: { colorMap: options.colorMap },
			searchable: options.searchable ?? true,
			sortable: options.sortable ?? true,
			width: options.width,
			headerClassName: options.headerClassName,
			cellClassName: options.cellClassName
		};
	}

	/**
	 * Create a count column (e.g., "5 items")
	 */
	static count<T>(key: keyof T, header: string, options: {
		singular: string;
		plural: string;
		showZero?: boolean;
		color?: string;
		searchable?: boolean;
		sortable?: boolean;
		width?: string;
		headerClassName?: string;
		cellClassName?: string;
	}): TableColumn<T> {
		return {
			key,
			header,
			renderType: 'count',
			renderOptions: {
				singular: options.singular,
				plural: options.plural,
				showZero: options.showZero ?? true,
				color: options.color
			},
			searchable: options.searchable ?? false,
			sortable: options.sortable ?? true,
			width: options.width,
			headerClassName: options.headerClassName,
			cellClassName: options.cellClassName
		};
	}

	/**
	 * Create a date column
	 */
	static date<T>(key: keyof T, header: string, options: {
		format?: 'relative' | 'short' | 'long';
		searchable?: boolean;
		sortable?: boolean;
		width?: string;
		headerClassName?: string;
		cellClassName?: string;
	} = {}): TableColumn<T> {
		return {
			key,
			header,
			renderType: 'date',
			renderOptions: { format: options.format || 'short' },
			searchable: options.searchable ?? false,
			sortable: options.sortable ?? true,
			cellClassName: `text-slate-600 ${options.cellClassName || ''}`,
			width: options.width,
			headerClassName: options.headerClassName
		};
	}

	/**
	 * Create a custom rendered column
	 */
	static custom<T>(key: keyof T, header: string, options: {
		renderCustom: (item: T) => any;
		searchable?: boolean;
		sortable?: boolean;
		width?: string;
		headerClassName?: string;
		cellClassName?: string;
	}): TableColumn<T> {
		return {
			key,
			header,
			renderType: 'custom',
			renderCustom: options.renderCustom,
			searchable: options.searchable ?? false,
			sortable: options.sortable ?? false,
			width: options.width,
			headerClassName: options.headerClassName,
			cellClassName: options.cellClassName
		};
	}

	/**
	 * Create a color swatch column
	 */
	static color<T>(key: keyof T, header: string, options: {
		width?: string;
		headerClassName?: string;
		cellClassName?: string;
	} = {}): TableColumn<T> {
		return {
			key,
			header,
			renderType: 'color',
			searchable: false,
			sortable: false,
			width: options.width || 'w-24',
			headerClassName: options.headerClassName,
			cellClassName: options.cellClassName
		};
	}

	/**
	 * Create an image column
	 */
	static image<T>(key: keyof T, header: string, options: {
		width?: string;
		headerClassName?: string;
		cellClassName?: string;
	} = {}): TableColumn<T> {
		return {
			key,
			header,
			renderType: 'image',
			searchable: false,
			sortable: false,
			width: options.width || 'w-20',
			headerClassName: options.headerClassName,
			cellClassName: options.cellClassName
		};
	}
}

// ============================================================================
// COMMON COLUMN PRESETS
// Quick shortcuts for standard columns
// ============================================================================

export const CommonColumns = {
	id: <T>(key: keyof T = 'id' as keyof T) =>
		TableColumnBuilder.id(key),

	name: <T>(key: keyof T = 'name' as keyof T) =>
		TableColumnBuilder.text(key, 'Name', { searchable: true }),

	title: <T>(key: keyof T = 'title' as keyof T) =>
		TableColumnBuilder.text(key, 'Title', { searchable: true }),

	description: <T>(key: keyof T = 'description' as keyof T) =>
		TableColumnBuilder.text(key, 'Description', { searchable: true }),

	createdAt: <T>(key: keyof T = 'createdAt' as keyof T) =>
		TableColumnBuilder.date(key, 'Created', { format: 'short' }),

	updatedAt: <T>(key: keyof T = 'updatedAt' as keyof T) =>
		TableColumnBuilder.date(key, 'Updated', { format: 'relative' }),

	status: <T>(key: keyof T = 'status' as keyof T) =>
		TableColumnBuilder.badge(key, 'Status')
};

export default TableColumnBuilder;