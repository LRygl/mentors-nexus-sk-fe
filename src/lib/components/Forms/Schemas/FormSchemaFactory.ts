import type { ConditionalValidation, FormFieldDependency, FormSchema } from '$lib/types/entities/forms';
import { FormBuilder } from '$lib/utils/formBuilder';

/**
 * Standard form variants supported by the system
 */
export type FormVariant = 'quick' | 'standard' | 'detailed' | 'edit' | 'link' | 'embedded';

/**
 * Field configuration for entity properties
 * Defines how a field should appear in different form variants
 */
export interface EntityFieldConfig {
	name: string;
	label: string;
	type: 'text' | 'textarea' | 'number' | 'checkbox' | 'select' | 'date' | 'tags' | 'multiselect';

	// Visibility in different form variants
	variants: {
		quick?: boolean;
		standard?: boolean;
		detailed?: boolean;
		edit?: boolean;
		link?: boolean;
		embedded?: boolean;
	};

	// Field properties
	required?: boolean;
	placeholder?: string;
	helpText?: string;
	minLength?: number;
	maxLength?: number;
	min?: number;
	max?: number;
	rows?: number;
	defaultValue?: any;
	colSpan?: 1 | 2 | 3 | 4;

	// For select fields
	options?: any[];
	searchable?: boolean;
	multiple?: boolean;

	// MultiSelect specific
	maxItems?: number;
	minItems?: number;

	// Dependencies and conditional validation
	dependencies?: FormFieldDependency[];
	conditionalValidation?: ConditionalValidation[];

	// Group assignment
	group?: string;
}

/**
 * Group configuration for organizing fields
 */
export interface EntityGroupConfig {
	id: string;
	title: string;
	description?: string;
	icon?: string;
	variant?: 'default' | 'card' | 'minimal' | 'embedded';
	collapsible?: boolean;
	collapsed?: boolean;

	// Visibility in different form variants
	variants: {
		quick?: boolean;
		standard?: boolean;
		detailed?: boolean;
		edit?: boolean;
		link?: boolean;
		embedded?: boolean;
	};
}

/**
 * Entity schema definition
 * Defines all fields and groups for an entity
 */
export interface EntitySchemaDefinition<T = any> {
	entity: string;
	fields: EntityFieldConfig[];
	groups?: EntityGroupConfig[];

	// Form-level configurations per variant
	variantConfig?: {
		quick?: Partial<FormSchemaConfig>;
		standard?: Partial<FormSchemaConfig>;
		detailed?: Partial<FormSchemaConfig>;
		edit?: Partial<FormSchemaConfig>;
		link?: Partial<FormSchemaConfig>;
		embedded?: Partial<FormSchemaConfig>;
	};
}

/**
 * Form schema configuration options
 */
export interface FormSchemaConfig {
	title?: string;
	description?: string;
	layout?: 'single' | 'two-column' | 'three-column' | 'grid';
	variant?: 'default' | 'bordered' | 'floating' | 'minimal';
	size?: 'sm' | 'md' | 'lg';
	submitLabel?: string;
	showReset?: boolean;
	showCancel?: boolean;
	validateOnChange?: boolean;
}

/**
 * Generic Entity Form Schema Factory
 * Creates form schemas for any entity based on configuration
 */
export class FormSchemaFactory<T = any> {
 private definition: EntitySchemaDefinition<T>;

 constructor(definition: EntitySchemaDefinition<T>) {
	 this.definition = definition;
 }

	/**
	* Create a form schema for a specific variant
 	*/
	create(variant: FormVariant, options: {
		additionalFields?: EntityFieldConfig[];
		overrideConfig?: Partial<FormSchemaConfig>;
	} = {}) : FormSchema<T> {
		const { additionalFields = [], overrideConfig = {} } = options;

		// Get base configuration for this variant
		const baseConfig = this.getVariantConfig(variant);
		const config = { ...baseConfig, ...overrideConfig };

		// Filter fields for this variant
		const variantFields = [
			...this.definition.fields.filter(f => f.variants[variant]),
			...additionalFields
		];

		// Filter groups for this variant
		const variantGroups = this.definition.groups?.filter(g => g.variants[variant]) || [];

		// Build the form
		const builder = new FormBuilder<T>(config);

		// Apply validation settings
		builder.validation({
				validateOnChange: true,
				validateOnBlur: true
		});

		builder.actions({
			submitLabel: config.submitLabel || this.getDefaultSubmitLabel(variant),
			showReset: config.showReset ?? (variant === "standard" || variant === "detailed"),
			showCancel: config.showCancel ?? (variant === "edit" || variant === "detailed"),
		});


		// Build Groups and fields
		if (variantGroups.length > 0) {
			this.buildGroupedFields(builder, variantFields,variantGroups);
		} else {
			this.buildUngroupedFields(builder, variantFields);
		}

		return builder.build();
	}

	private buildGroupedFields(
		builder: FormBuilder<T>,
		fields: EntityFieldConfig[],
		groups: EntityGroupConfig[]
	): void {
		for (const group of groups) {
			// Add group
			builder.group(group.title, {
				description: group.description,
				icon: group.icon,
				variant: group.variant,
				collapsible: group.collapsible,
				collapsed: group.collapsed
			});

			// Add fields in this group
			const groupFields = fields.filter(f => f.group === group.id);
			for (const field of groupFields) {
				this.addField(builder, field);
			}
		}

		// Add ungrouped fields
		const ungroupedFields = fields.filter(f => !f.group);
		if (ungroupedFields.length > 0) {
			builder.group("Additional Information")
			for (const field of ungroupedFields) {
				this.addField(builder, field);
			}
		}
	}

	/**
	 * Build fields without groups
	 */
	private buildUngroupedFields(
		builder: FormBuilder<T>,
		fields: EntityFieldConfig[]
	): void {
		for (const field of fields) {
			this.addField(builder, field);
		}
	}

	/**
	 * Add a single field to the builder
	 */
	private addField(
		builder: FormBuilder<T>,
		field: EntityFieldConfig
	) : void {
		const baseOptions = {
			placeholder: field.placeholder,
			helpText: field.helpText,
			required: field.required,
			colSpan: field.colSpan,
			defaultValue: field.defaultValue,
			dependencies: field.dependencies,
			conditionalValidation: field.conditionalValidation,
		};

		switch (field.type) {
			case 'text':
				builder.text(field.name, field.label, {
					...baseOptions,
					minLength: field.minLength,
					maxLength: field.maxLength
				});
				break;

			case 'textarea':
				builder.textarea(field.name, field.label, {
					...baseOptions,
					minLength: field.minLength,
					maxLength: field.maxLength,
					rows: field.rows
				});
				break;

			case 'number':
				builder.number(field.name, field.label, {
					...baseOptions,
					min: field.min,
					max: field.max
				});
				break;

			case 'checkbox':
				builder.checkbox(field.name, field.label, baseOptions);
				break;

			case 'select':
				builder.select(field.name, field.label, field.options || [], {
					...baseOptions,
					searchable: field.searchable,
					multiple: field.multiple
				});
				break;

			case 'date':
				builder.date(field.name, field.label, baseOptions);
				break;

			case 'tags':
				builder.tags(field.name, field.label, {
					...baseOptions,
					maxTags: field.maxLength
				});
				break;
			case 'multiselect':
				builder.multiselect(field.name, field.label, field.options || [], {
					...baseOptions,
					maxItems: field.maxItems,
					minItems: field.minItems,
					searchable: field.searchable
				});
				break;
		}
	}


	/**
	 * Get configuration for a specific variant
	 */
	private getVariantConfig(variant: FormVariant): FormSchemaConfig {
		const customConfig = this.definition.variantConfig?.[variant] || {};
		const defaultConfigs: Record<FormVariant, FormSchemaConfig> = {
			quick: {
				title: `Quick ${this.definition.entity} Entry`,
				layout: 'single',
				variant: 'minimal',
				size: 'lg'
			},
			standard: {
				title: `Create ${this.definition.entity}`,
				description: `Create a new ${this.definition.entity.toLowerCase()} with standard options`,
				layout: 'two-column',
				variant: 'default',
				size: 'md'
			},
			detailed: {
				title: `Detailed ${this.definition.entity} Creation`,
				description: `Create a comprehensive ${this.definition.entity.toLowerCase()} with all available options`,
				layout: 'two-column',
				variant: 'bordered',
				size: 'md'
			},
			edit: {
				title: `Edit ${this.definition.entity}`,
				description: `Update ${this.definition.entity.toLowerCase()} information`,
				layout: 'two-column',
				variant: 'default',
				size: 'md'
			},
			link: {
				title: `Link ${this.definition.entity}`,
				layout: 'single',
				variant: 'minimal',
				size: 'md'
			},
			embedded: {
				title: `Edit ${this.definition.entity}`,
				description: `Update ${this.definition.entity.toLowerCase()} information`,
				layout: 'two-column',
				variant: 'default',
				size: 'md'
			}
		};

		return { ...defaultConfigs[variant], ...customConfig };
	}

	/**
	 * Get default submit label for variant
	 */
	private getDefaultSubmitLabel(variant: FormVariant): string {
		const labels: Record<FormVariant, string> = {
			quick: `Create ${this.definition.entity}`,
			standard: `Create ${this.definition.entity}`,
			detailed: `Create Detailed ${this.definition.entity}`,
			edit: `Update ${this.definition.entity}`,
			link: `Link ${this.definition.entity}`
		};
		return labels[variant];
	}

	/**
	 * Create all standard form variants at once
	 */
	createAll(): Record<FormVariant, FormSchema<T>> {
		return {
			quick: this.create('quick'),
			standard: this.create('standard'),
			detailed: this.create('detailed'),
			edit: this.create('edit'),
			link: this.create('link')
		};
	}
}

/**
 * Helper function to create a form schema factory
 */
export function defineEntitySchema<T = any>(
	definition: EntitySchemaDefinition<T>
): FormSchemaFactory<T> {
	return new FormSchemaFactory(definition);
}

/**
 * Preset class generator for entity forms
 */
export function createEntityFormPresets<T = any>(
	factory: FormSchemaFactory<T>,
	entityName: string
) {
	return class {
		static quick() {
			return factory.create('quick');
		}

		static standard() {
			return factory.create('standard');
		}

		static detailed() {
			return factory.create('detailed');
		}

		static edit() {
			return factory.create('edit');
		}

		static link() {
			return factory.create('link');
		}

		static custom(variant: FormVariant, config?: Partial<FormSchemaConfig>) {
			return factory.create(variant, { overrideConfig: config });
		}
	};
}