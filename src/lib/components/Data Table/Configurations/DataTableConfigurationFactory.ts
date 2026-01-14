// ============================================================================
// UNIVERSAL TABLE CONFIGURATION FACTORY
// Single source of truth for all table configurations
// ============================================================================

import type {
	TableColumn,
	TableConfig,
} from '$lib/types/ui/table';
import type { Component } from 'svelte';
import { ActionType } from '$lib/types';

// Re-export ActionGroup and ActionItem from your types
// Adjust the import path based on your project structure
export interface ActionItem {
	id: string;
	label: string;
	description?: string;
	icon: Component;
	variant: 'default' | 'destructive' | 'outline' | 'secondary' | 'success' | 'warning';
	disabled?: boolean;
}

export interface ActionGroup {
	title: string;
	items: ActionItem[];
}

/**
 * Column definition for entity properties
 */
export interface EntityColumnConfig<T = any> {
	key: keyof T | string;
	header: string;
	type?: 'text' | 'number' | 'date' | 'datetime' | 'badge' | 'count' | 'boolean' | 'custom' | 'icon' | 'duration';

	// Display options
	searchable?: boolean;
	sortable?: boolean;
	width?: string;
	cellClassName?: string;
	headerClassName?: string;

	// Type-specific options
	format?: 'short' | 'long' | 'relative' | 'time';
	dateFormat?: 'date' | 'datetime' | 'time'; // Explicit date formatting
	singular?: string; // For counts
	plural?: string; // For counts
	color?: string; // For badges/counts
	trueLabel?: string; // For booleans
	falseLabel?: string; // For booleans
	durationUnit?: 'seconds' | 'minutes';

	// Add accessor function for nested values
	accessor?: (item: T) => any;

	// Custom rendering
	renderType?: 'default' | 'custom';
	customRender?: (value: any, item: T) => string;
}

/**
 * Action definition for entity operations
 */
export interface EntityActionConfig {
	id: string;
	label: string;
	description?: string;
	icon: Component;
	variant: ActionType;
	group?: string; // Which group this action belongs to
	condition?: (item: any) => boolean; // Show action conditionally
}

/**
 * Complete entity table configuration
 */
export interface EntityTableDefinition<T = any> {
	// Entity info
	entity: string;
	entityPlural: string;

	// ID and title fields
	idField: keyof T | string;
	titleField: keyof T | string;

	// Columns
	columns: EntityColumnConfig<T>[];

	// Actions
	actions?: EntityActionConfig[];

	// Table behavior
	searchable?: boolean;
	filterable?: boolean;
	selectable?: boolean;
	exportable?: boolean;
	sortable?: boolean;

	// Custom messages
	emptyTitle?: string;
	emptyDescription?: string;
	emptyActionLabel?: string;
	loadingTitle?: string;
	loadingDescription?: string;
	searchPlaceholder?: string;
}

/**
 * Universal Table Configuration Factory
 */
export class TableConfigFactory<T = any> {
	private definition: EntityTableDefinition<T>;

	constructor(definition: EntityTableDefinition<T>) {
		this.definition = definition;
	}

	/**
	 * Generate TableConfig for UniversalDataTable
	 */
	getTableConfig(): TableConfig<T> {
		return {
			idField: this.definition.idField as string,
			titleField: this.definition.titleField as string,
			//Need to get override for CREATE
			createButtonLabel: `Create ${this.definition.entity}`,
			loadingTitle: this.definition.loadingTitle || `Loading ${this.definition.entityPlural}`,
			loadingDescription: this.definition.loadingDescription ||
				`Please wait while we fetch your ${this.definition.entityPlural.toLowerCase()}...`,
			itemName: this.definition.entity.toLowerCase(),
			itemNamePlural: this.definition.entityPlural.toLowerCase()
		};
	}

	/**
	 * Generate column configuration
	 */
	getColumns(): TableColumn<T>[] {
		return this.definition.columns.map(col => this.buildColumn(col));
	}

	/**
	 * Build a single column from Config
	 */
	private buildColumn(config: EntityColumnConfig<T>): TableColumn<T> {
		const baseColumn: TableColumn<T> = {
			key: config.key as string,
			header: config.header,
			searchable: config.searchable ?? true,
			sortable: config.sortable ?? true,
			width: config.width,
			cellClassName: config.cellClassName,
			headerClassName: config.headerClassName,
			accessor: config.accessor
		};

		// Type-specific configuration
		switch (config.type) {
			case 'date':
				return {
					...baseColumn,
					renderType: 'date',
					renderOptions: {
						dateFormat: 'date',
						format: config.format || 'short'
					}
				};

			case 'datetime':
				return {
					...baseColumn,
					renderType: 'date',
					renderOptions: {
						dateFormat: 'datetime',
						format: config.format || 'short'
					}
				};


			case 'duration':
				return {
					...baseColumn,
					renderType: 'duration',
					renderOptions: {
						durationUnit: config.durationUnit || 'minutes',
						format: config.format || 'short'
					}
				};

			case 'count':
				return {
					...baseColumn,
					renderType: 'count',
					renderOptions: {
						singular: config.singular,
						plural: config.plural,
						showZero: true,
						color: config.color
					}
				};

			case 'badge':
				return {
					...baseColumn,
					renderType: 'badge',
					renderOptions: {
						color: config.color
					}
				};

			case 'boolean':
				return {
					...baseColumn,
					renderType: 'custom',
					renderOptions: {
						trueLabel: config.trueLabel || 'Yes',
						falseLabel: config.falseLabel || 'No'
					}
				};

			case 'icon':
				return {
					...baseColumn,
					renderType: 'custom'
				};

			case 'custom':
				return {
					...baseColumn,
					renderType: 'custom',
					renderCustom: config.customRender
				};

			default:
				return baseColumn;
		}
	}

	/**
	 * Generate action groups
	 */
	getActions(item: T): ActionGroup[] {
		if (!this.definition.actions) {
			return [];
		}

		// Group actions by their group property
		const groupedActions = new Map<string, ActionItem[]>();

		for (const actionConfig of this.definition.actions) {
			// Check condition if exists
			if (actionConfig.condition && !actionConfig.condition(item)) {
				continue;
			}

			const groupName = actionConfig.group || 'Actions';

			if (!groupedActions.has(groupName)) {
				groupedActions.set(groupName, []);
			}

			groupedActions.get(groupName)!.push({
				id: actionConfig.id,
				label: actionConfig.label,
				description: actionConfig.description,
				icon: actionConfig.icon,
				variant: actionConfig.variant
			});
		}

		// Convert to ActionGroup array
		return Array.from(groupedActions.entries()).map(([title, items]) => ({
			title,
			items
		}));
	}

	/**
	 * Get table behavior props
	 */
	getTableProps() {
		return {
			searchable: this.definition.searchable ?? true,
			filterable: this.definition.filterable ?? true,
			selectable: this.definition.selectable ?? true,
			exportable: this.definition.exportable ?? true,
			sortable: this.definition.sortable ?? true,
			searchPlaceholder: this.definition.searchPlaceholder ||
				`Search ${this.definition.entityPlural.toLowerCase()}...`,
			emptyTitle: this.definition.emptyTitle ||
				`No ${this.definition.entityPlural.toLowerCase()} yet`,
			emptyDescription: this.definition.emptyDescription ||
				`Get started by creating your first ${this.definition.entity.toLowerCase()}.`,
			emptyActionLabel: this.definition.emptyActionLabel ||
				`Create ${this.definition.entity}`
		};
	}

	/**
	 * Get everything at once
	 */
	getAll() {
		return {
			config: this.getTableConfig(),
			columns: this.getColumns(),
			props: this.getTableProps(),
			getActions: (item: T) => this.getActions(item)
		};
	}
}

/**
 * Helper function to define table configuration
 */
export function defineTableConfig<T = any>(
	definition: EntityTableDefinition<T>
): TableConfigFactory<T> {
	return new TableConfigFactory(definition);
}

/**
 * Create a preset class for easy access
 */
export function createTablePreset<T = any>(
	factory: TableConfigFactory<T>
) {
	return {
		config: () => factory.getTableConfig(),
		columns: () => factory.getColumns(),
		props: () => factory.getTableProps(),
		getActions: (item: T) => factory.getActions(item),
		all: () => factory.getAll()
	};
}