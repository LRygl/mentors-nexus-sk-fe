import type { FormField, FormFieldGroup, FormSchema } from '$lib/types/entities/forms';

export interface EntityFieldConfig {
	name: string;
	label: string;
	type: 'text' | 'textarea' | 'number' | 'color' | 'checkbox' | 'select' | 'icon-selector' | 'image-upload' | 'date' | 'tags' | 'multiselect' | 'custom';
	group: string;
	variants: {
		quick?: boolean;
		standard?: boolean;
		detailed?: boolean;
		edit?: boolean;
		embedded?: boolean;
	};
	required?: boolean;
	placeholder?: string;
	helpText?: string;
	defaultValue?: any;
	colSpan?: 1 | 2;
	options?: Array<{ label: string; value: any }>;
	dependencies?: Array<{
		field: string;
		condition: 'equals' | 'not-equals' | 'truthy' | 'falsy';
		value?: any;
	}>;

	// Field-specific properties
	minLength?: number;
	maxLength?: number;
	min?: number;
	max?: number;
	minItems?: number;
	maxItems?: number;
	rows?: number;
	searchable?: boolean;

	// Image upload specific
	accept?: string;
	maxSize?: number;
	previewWidth?: number;
	previewHeight?: number;

	// Date specific
	minDate?: string | Date;
	maxDate?: string | Date;
}

export interface EntityGroupConfig {
	id: string;
	title: string;
	description?: string;
	icon?: string;
	variant?: 'default' | 'card' | 'compact';
	collapsible?: boolean;
	collapsed?: boolean;
	variants: {
		quick?: boolean;
		standard?: boolean;
		detailed?: boolean;
		edit?: boolean;
		embedded?: boolean;
	};
}

export interface VariantConfig {
	title?: string;
	submitLabel?: string;
	layout?: 'single' | 'two-column';
	showReset?: boolean;
	showCancel?: boolean;
	validateOnChange?: boolean;
}

export interface EntitySchemaConfig<T> {
	entity: string;
	fields: EntityFieldConfig[];
	groups: EntityGroupConfig[];
	variantConfig: {
		quick?: VariantConfig;
		standard?: VariantConfig;
		detailed?: VariantConfig;
		edit?: VariantConfig;
		embedded?: VariantConfig;
	};
}

export type VariantType = 'quick' | 'standard' | 'detailed' | 'edit' | 'embedded';

export class EntitySchemaFactory<T> {
	private config: EntitySchemaConfig<T>;

	constructor(config: EntitySchemaConfig<T>) {
		this.config = config;
	}

	create(variant: VariantType): FormSchema<T> {
		const variantConfig = this.config.variantConfig[variant] || {};

		// Filter fields for this variant
		const variantFields = this.config.fields.filter(f => f.variants[variant]);

		// Filter groups for this variant
		const variantGroups = this.config.groups.filter(g => g.variants[variant]);

		// Group fields by group id
		const groupedFields = new Map<string, FormField[]>();

		variantFields.forEach(field => {
			if (!groupedFields.has(field.group)) {
				groupedFields.set(field.group, []);
			}

			const formField: FormField = {
				name: field.name,
				label: field.label,
				type: field.type,
				required: field.required,
				placeholder: field.placeholder,
				helpText: field.helpText,
				defaultValue: field.defaultValue,
				colSpan: field.colSpan,
				options: field.options,
				dependencies: field.dependencies,
				minLength: field.minLength,
				maxLength: field.maxLength,
				min: field.min,
				max: field.max,
				minItems: field.minItems,
				maxItems: field.maxItems,
				rows: field.rows,
				searchable: field.searchable,
				accept: field.accept,
				maxSize: field.maxSize,
				previewWidth: field.previewWidth,
				previewHeight: field.previewHeight,
				minDate: field.minDate,
				maxDate: field.maxDate,
			};

			groupedFields.get(field.group)!.push(formField);
		});

		// Create form groups
		const formGroups: FormFieldGroup[] = variantGroups.map(groupConfig => {
			const fields = groupedFields.get(groupConfig.id) || [];
			return {
				title: groupConfig.title,
				description: groupConfig.description,
				fields
			};
		});

		return {
			title: variantConfig.title,
			description: undefined,
			groups: formGroups,
			submitLabel: variantConfig.submitLabel,
			cancelLabel: variantConfig.showCancel ? 'Cancel' : undefined,
			layout: variantConfig.layout || 'single'
		};
	}
}

export function defineEntitySchema<T>(config: EntitySchemaConfig<T>): EntitySchemaFactory<T> {
	return new EntitySchemaFactory(config);
}
