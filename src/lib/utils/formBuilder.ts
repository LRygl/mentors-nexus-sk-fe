import type {
	ConditionalValidation,
	FieldSize,
	FormField,
	FormFieldDependency,
	FormFieldGroup,
	FormLayout,
	FormSchema,
	FormVariant,
	ValidationRule
} from '$lib/types/entities/forms';
import { FormValidator } from '$lib/utils/formValidator';

export class FormBuilder<T = Record<string, any>> {
	private schema: FormSchema<T>;
	private currentGroup: FormFieldGroup | null = null;
	private lastAddedField: FormField | null = null;

	// Updated constructor to support both old and new API
	constructor(configOrTitle?: string | {
		title?: string;
		description?: string;
		layout?: FormLayout;
		variant?: FormVariant;
		size?: FieldSize;
	}, description?: string) {
		if (typeof configOrTitle === 'string') {
			// Old API compatibility
			this.schema = {
				title: configOrTitle,
				description,
				groups: [],
				layout: 'single'
			};
		} else {
			// New API
			const config = configOrTitle || {};
			this.schema = {
				title: config.title,
				description: config.description,
				groups: [],
				layout: config.layout || 'single',
				variant: config.variant || 'default',
				size: config.size || 'md',
				validateOnChange: true,
				validateOnBlur: true
			};
		}
	}

	/**
	 * Set form layout
	 */
	layout(layout: FormLayout): FormBuilder<T> {
		this.schema.layout = layout;
		return this;
	}

	/**
	 * Set form variant
	 */
	variant(variant: FormVariant): FormBuilder<T> {
		this.schema.variant = variant;
		return this;
	}

	/**
	 * Set form size
	 */
	size(size: FieldSize): FormBuilder<T> {
		this.schema.size = size;
		return this;
	}

	/**
	 * Configure validation behavior
	 */
	validation(config: {
		validateOnChange?: boolean;
		validateOnBlur?: boolean;
	}): FormBuilder<T> {
		Object.assign(this.schema, config);
		return this;
	}

	/**
	 * Configure form actions
	 */
	actions(config: {
		submitLabel?: string;
		cancelLabel?: string;
		resetLabel?: string;
		showCancel?: boolean;
		showReset?: boolean;
	}): FormBuilder<T> {
		Object.assign(this.schema, config);
		return this;
	}

	/**
	 * Start a new field group with enhanced options
	 */
	group(
		title?: string,
		descriptionOrOptions?: string | {
			description?: string;
			icon?: string;
			collapsible?: boolean;
			collapsed?: boolean;
			variant?: 'default' | 'card' | 'minimal' | 'embedded';
		}
	): FormBuilder<T> {
		let options: any = {};
		let description: string | undefined;

		if (typeof descriptionOrOptions === 'string') {
			// Old API compatibility
			description = descriptionOrOptions;
		} else {
			// New API
			options = descriptionOrOptions || {};
			description = options.description;
		}

		this.currentGroup = {
			title,
			description,
			icon: options.icon,
			collapsible: options.collapsible || false,
			collapsed: options.collapsed || false,
			variant: options.variant || 'default',
			fields: []
		};
		this.schema.groups?.push(this.currentGroup);
		return this;
	}

	/**
	 * Add a text field with enhanced options
	 */
	text(
		name: string,
		label: string,
		options: {
			placeholder?: string;
			required?: boolean;
			minLength?: number;
			maxLength?: number;
			colSpan?: 1 | 2 | 3 | 4;
			helpText?: string;
			defaultValue?: string;
			autoFocus?: boolean;
			dependencies?: FormFieldDependency[];
			conditionalValidation?: ConditionalValidation[];
		} = {}
	): FormBuilder<T> {
		const validationRules = [];

		if (options.required) {
			validationRules.push(FormValidator.rules.required());
		}
		if (options.minLength) {
			validationRules.push(FormValidator.rules.minLength(options.minLength));
		}
		if (options.maxLength) {
			validationRules.push(FormValidator.rules.maxLength(options.maxLength));
		}

		return this.addField({
			name,
			label,
			type: 'text',
			placeholder: options.placeholder,
			required: options.required,
			colSpan: options.colSpan,
			helpText: options.helpText,
			defaultValue: options.defaultValue,
			autoFocus: options.autoFocus,
			dependencies: options.dependencies,
			conditionalValidation: options.conditionalValidation,
			validationRules
		});
	}

	/**
	 * Add a textarea field with enhanced options
	 */
	textarea(
		name: string,
		label: string,
		options: {
			placeholder?: string;
			required?: boolean;
			rows?: number;
			minLength?: number;
			maxLength?: number;
			colSpan?: 1 | 2 | 3 | 4;
			helpText?: string;
			defaultValue?: string;
			dependencies?: FormFieldDependency[];
			conditionalValidation?: ConditionalValidation[];
		} = {}
	): FormBuilder<T> {
		const validationRules = [];

		if (options.required) {
			validationRules.push(FormValidator.rules.required());
		}
		if (options.minLength) {
			validationRules.push(FormValidator.rules.minLength(options.minLength));
		}
		if (options.maxLength) {
			validationRules.push(FormValidator.rules.maxLength(options.maxLength));
		}

		return this.addField({
			name,
			label,
			type: 'textarea',
			placeholder: options.placeholder,
			required: options.required,
			rows: options.rows || 3,
			colSpan: options.colSpan,
			helpText: options.helpText,
			defaultValue: options.defaultValue,
			dependencies: options.dependencies,
			conditionalValidation: options.conditionalValidation,
			validationRules
		});
	}

	/**
	 * Add a number field with enhanced options
	 */
	number(
		name: string,
		label: string,
		options: {
			placeholder?: string;
			required?: boolean;
			min?: number;
			max?: number;
			colSpan?: 1 | 2 | 3 | 4;
			helpText?: string;
			defaultValue?: number;
			step?: number;
			prefix?: string;
			suffix?: string;
			dependencies?: FormFieldDependency[];
			conditionalValidation?: ConditionalValidation[];
		} = {}
	): FormBuilder<T> {
		const validationRules = [];

		if (options.required) {
			validationRules.push(FormValidator.rules.required());
		}
		if (options.min !== undefined) {
			validationRules.push(FormValidator.rules.min(options.min));
		}
		if (options.max !== undefined) {
			validationRules.push(FormValidator.rules.max(options.max));
		}

		return this.addField({
			name,
			label,
			type: 'number',
			placeholder: options.placeholder,
			required: options.required,
			min: options.min,
			max: options.max,
			step: options.step,
			colSpan: options.colSpan,
			helpText: options.helpText,
			defaultValue: options.defaultValue,
			prefix: options.prefix,
			suffix: options.suffix,
			dependencies: options.dependencies,
			conditionalValidation: options.conditionalValidation,
			validationRules
		});
	}

	/**
	 * Add a color field
	 */
	color(
		name: string,
		label: string,
		options: {
			defaultValue?: string;
			required?: boolean;
			colSpan?: 1 | 2 | 3 | 4;
			helpText?: string;
			dependencies?: FormFieldDependency[];
			conditionalValidation?: ConditionalValidation[];
		} = {}
	): FormBuilder<T> {
		const validationRules = [];

		if (options.required) {
			validationRules.push(FormValidator.rules.required());
		}
		validationRules.push(FormValidator.rules.hexColor());

		return this.addField({
			name,
			label,
			type: 'color',
			required: options.required,
			colSpan: options.colSpan,
			helpText: options.helpText,
			defaultValue: options.defaultValue || '#3B82F6',
			dependencies: options.dependencies,
			conditionalValidation: options.conditionalValidation,
			validationRules
		});
	}

	/**
	 * Add a checkbox field
	 */
	checkbox(
		name: string,
		label: string,
		options: {
			helpText?: string;
			defaultValue?: boolean;
			colSpan?: 1 | 2 | 3 | 4;
			dependencies?: FormFieldDependency[];
			conditionalValidation?: ConditionalValidation[];
		} = {}
	): FormBuilder<T> {
		return this.addField({
			name,
			label,
			type: 'checkbox',
			helpText: options.helpText,
			defaultValue: options.defaultValue || false,
			colSpan: options.colSpan,
			dependencies: options.dependencies,
			conditionalValidation: options.conditionalValidation
		});
	}

	/**
	 * Add a select field with enhanced options
	 */
	select(
		name: string,
		label: string,
		optionsArray: Array<{ label: string; value: any; disabled?: boolean; icon?: string; color?: string }>,
		options: {
			placeholder?: string;
			required?: boolean;
			colSpan?: 1 | 2 | 3 | 4;
			helpText?: string;
			defaultValue?: any;
			searchable?: boolean;
			clearable?: boolean;
			multiple?: boolean;
			dependencies?: FormFieldDependency[];
			conditionalValidation?: ConditionalValidation[];
		} = {}
	): FormBuilder<T> {
		const validationRules = [];

		if (options.required) {
			validationRules.push(FormValidator.rules.required());
		}

		const hasPlaceholder = optionsArray.some((opt) => opt.value === '');

		return this.addField({
			name,
			label,
			type: options.multiple ? 'multiselect' : 'select',
			placeholder: options.placeholder,
			required: options.required,
			options: optionsArray,
			colSpan: options.colSpan,
			helpText: options.helpText,
			searchable: options.searchable,
			clearable: options.clearable,
			multiple: options.multiple,
			defaultValue:
				options.defaultValue !== undefined
					? options.defaultValue
					: hasPlaceholder && options.required
						? ''
						: optionsArray[0]?.value || '',
			dependencies: options.dependencies,
			conditionalValidation: options.conditionalValidation,
			validationRules
		});
	}

	/**
	 * Add an image upload field
	 */
	image(
		name: string,
		label: string,
		options: {
			placeholder?: string;
			required?: boolean;
			colSpan?: 1 | 2 | 3 | 4;
			helpText?: string;
			defaultValue?: string;
			maxFileSize?: number;
			acceptedFileTypes?: string[];
			dependencies?: FormFieldDependency[];
			conditionalValidation?: ConditionalValidation[];
		} = {}
	): FormBuilder<T> {
		const validationRules = [];

		if (options.required) {
			validationRules.push(FormValidator.rules.required());
		}

		// Add file size validation if specified
		if (options.maxFileSize) {
			validationRules.push({
				type: 'custom' as const,
				validator: (value: any) => {
					if (value instanceof File && value.size > options.maxFileSize!) {
						const maxSizeMB = (options.maxFileSize! / (1024 * 1024)).toFixed(1);
						return `File size exceeds ${maxSizeMB}MB limit`;
					}
					return null;
				}
			});
		}

		// Add file type validation if specified
		if (options.acceptedFileTypes && options.acceptedFileTypes.length > 0) {
			validationRules.push({
				type: 'custom' as const,
				validator: (value: any) => {
					if (value instanceof File && !options.acceptedFileTypes!.includes(value.type)) {
						const types = options.acceptedFileTypes!.map(t => t.split('/')[1].toUpperCase()).join(', ');
						return `Invalid file type. Accepted: ${types}`;
					}
					return null;
				}
			});
		}

		return this.addField({
			name,
			label,
			type: 'image',
			placeholder: options.placeholder || 'Upload an image...',
			required: options.required,
			colSpan: options.colSpan || 2,
			helpText: options.helpText,
			defaultValue: options.defaultValue || '',
			maxFileSize: options.maxFileSize || 5 * 1024 * 1024, // Default 5MB
			acceptedFileTypes: options.acceptedFileTypes || ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
			dependencies: options.dependencies,
			conditionalValidation: options.conditionalValidation,
			validationRules
		});
	}



	/**
	 * Add new field types
	 */
	email(
		name: string,
		label: string,
		options: {
			placeholder?: string;
			required?: boolean;
			colSpan?: 1 | 2 | 3 | 4;
			helpText?: string;
			defaultValue?: string;
			dependencies?: FormFieldDependency[];
			conditionalValidation?: ConditionalValidation[];
		} = {}
	): FormBuilder<T> {
		const validationRules = [];

		if (options.required) {
			validationRules.push(FormValidator.rules.required());
		}
		validationRules.push(FormValidator.rules.email());

		return this.addField({
			name,
			label,
			type: 'email',
			placeholder: options.placeholder,
			required: options.required,
			colSpan: options.colSpan,
			helpText: options.helpText,
			defaultValue: options.defaultValue,
			dependencies: options.dependencies,
			conditionalValidation: options.conditionalValidation,
			validationRules
		});
	}

	date(
		name: string,
		label: string,
		options: {
			required?: boolean;
			colSpan?: 1 | 2 | 3 | 4;
			helpText?: string;
			defaultValue?: string;
			min?: number;
			max?: number;
			dependencies?: FormFieldDependency[];
			conditionalValidation?: ConditionalValidation[];
		} = {}
	): FormBuilder<T> {
		const validationRules = [];

		if (options.required) {
			validationRules.push(FormValidator.rules.required());
		}

		return this.addField({
			name,
			label,
			type: 'date',
			required: options.required,
			colSpan: options.colSpan,
			helpText: options.helpText,
			defaultValue: options.defaultValue,
			min: options.min,
			max: options.max,
			dependencies: options.dependencies,
			conditionalValidation: options.conditionalValidation,
			validationRules
		});
	}

	tags(
		name: string,
		label: string,
		options: {
			placeholder?: string;
			required?: boolean;
			colSpan?: 1 | 2 | 3 | 4;
			helpText?: string;
			defaultValue?: string[];
			maxTags?: number;
			dependencies?: FormFieldDependency[];
			conditionalValidation?: ConditionalValidation[];
		} = {}
	): FormBuilder<T> {
		const validationRules = [];

		if (options.required) {
			validationRules.push(FormValidator.rules.required());
		}

		return this.addField({
			name,
			label,
			type: 'tags',
			placeholder: options.placeholder,
			required: options.required,
			colSpan: options.colSpan,
			helpText: options.helpText,
			defaultValue: options.defaultValue || [],
			dependencies: options.dependencies,
			conditionalValidation: options.conditionalValidation,
			validationRules
		});
	}

	/**
	 * Add an icon selector field
	 */
	iconSelector(
		name: string,
		label: string,
		options: {
			placeholder?: string;
			required?: boolean;
			colSpan?: 1 | 2 | 3 | 4;
			defaultValue?: string;
			previewColor?: string;
			dependencies?: FormFieldDependency[];
			conditionalValidation?: ConditionalValidation[];
		} = {}
	): FormBuilder<T> {
		const validationRules = [];

		if (options.required) {
			validationRules.push(FormValidator.rules.required('Please select an icon'));
		}

		return this.addField({
			name,
			label,
			type: 'icon-selector',
			placeholder: options.placeholder,
			required: options.required,
			colSpan: options.colSpan,
			defaultValue: options.defaultValue || 'HelpCircle',
			dependencies: options.dependencies,
			conditionalValidation: options.conditionalValidation,
			validationRules
		});
	}


	/**
	 * Add a multiselect field
	 */
	multiselect(
		name: string,
		label: string,
		options: Array<{ value: string; label: string; disabled?: boolean }>,
		fieldOptions: {
			placeholder?: string;
			helpText?: string;
			required?: boolean;
			minItems?: number;
			maxItems?: number;
			searchable?: boolean;
			colSpan?: 1 | 2 | 3 | 4;
			defaultValue?: string[];
			dependencies?: FormFieldDependency[];
			conditionalValidation?: ConditionalValidation[];
		} = {}
	): FormBuilder<T> {
		const validationRules = [];

		if (fieldOptions.required) {
			validationRules.push(FormValidator.rules.required(`${label} is required`));
		}

		return this.addField({
			name,
			label,
			type: 'multiselect',
			placeholder: fieldOptions.placeholder,
			helpText: fieldOptions.helpText,
			required: fieldOptions.required,
			colSpan: fieldOptions.colSpan,
			defaultValue: fieldOptions.defaultValue || [],
			options: options,
			minItems: fieldOptions.minItems,
			maxItems: fieldOptions.maxItems,
			searchable: fieldOptions.searchable ?? true,
			dependencies: fieldOptions.dependencies,
			conditionalValidation: fieldOptions.conditionalValidation,
			validationRules
		});
	}


	/**
	 * Add a custom field
	 */
	custom(
		name: string,
		label: string,
		component: any,
		options: {
			componentProps?: Record<string, any>;
			required?: boolean;
			colSpan?: 1 | 2 | 3 | 4;
			helpText?: string;
			defaultValue?: any;
			validationRules?: any[];
			dependencies?: FormFieldDependency[];
			conditionalValidation?: ConditionalValidation[];
		} = {}
	): FormBuilder<T> {
		return this.addField({
			name,
			label,
			type: 'custom',
			component,
			componentProps: options.componentProps,
			required: options.required,
			colSpan: options.colSpan,
			helpText: options.helpText,
			defaultValue: options.defaultValue,
			dependencies: options.dependencies,
			conditionalValidation: options.conditionalValidation,
			validationRules: options.validationRules
		});
	}

	/**
	 * Conditional logic methods
	 */
	showWhen(dependency: FormFieldDependency): FormBuilder<T> {
		if (this.lastAddedField) {
			this.lastAddedField.dependencies = [dependency];
		}
		return this;
	}

	requiredWhen(dependency: FormFieldDependency, message?: string): FormBuilder<T> {
		if (this.lastAddedField) {
			this.lastAddedField.conditionalValidation = [
				{
					when: dependency,
					rules: [{ type: 'required', message: message || `${this.lastAddedField.label} is required` }]
				}
			];
		}
		return this;
	}

	/**
	 * Add a field to current group or create default group
	 */
	private addField(field: FormField): FormBuilder<T> {
		if (!this.currentGroup) {
			this.group(); // Create default group
		}

		this.currentGroup!.fields.push(field);
		this.lastAddedField = field;
		return this;
	}

	/**
	 * Build and return the form schema
	 */
	build(): FormSchema<T> {
		return this.schema;
	}

	/**
	 * Helper method to create dependency conditions
	 */
	static when(field: string, condition: 'equals' | 'not-equals' | 'truthy' | 'falsy', value?: any): FormFieldDependency {
		return { field, condition, value };
	}

	/**
	 * Helper method to create conditional validation rules
	 */
	static conditionallyRequired(when: FormFieldDependency, message?: string): ConditionalValidation {
		return {
			when,
			rules: [{ type: 'required', message: message || 'This field is required' }]
		};
	}

	/**
	 * Create a quick entity form with common patterns
	 */
	static entityForm<T>(
		entityName: string,
		fields: {
			name?: boolean;
			description?: boolean;
			displayOrder?: boolean;
			isActive?: boolean;
			isVisible?: boolean;
			color?: boolean;
			icon?: boolean;
		} = {}
	): FormSchema<T> {
		const builder = new FormBuilder<T>(
			`${entityName} Details`,
			`Configure your ${entityName.toLowerCase()} settings`
		).layout('two-column');

		// Basic info group
		builder.group('Basic Information', 'Essential details');

		if (fields.name !== false) {
			builder.text('name', 'Name', {
				placeholder: `Enter ${entityName.toLowerCase()} name`,
				required: true,
				minLength: 2,
				maxLength: 100,
				colSpan: 1
			});
		}

		if (fields.displayOrder !== false) {
			builder.number('displayOrder', 'Display Order', {
				min: 1,
				max: 999,
				defaultValue: 1,
				helpText: 'Lower numbers appear first',
				colSpan: 1
			});
		}

		if (fields.description !== false) {
			builder.textarea('description', 'Description', {
				placeholder: `Brief description of this ${entityName.toLowerCase()}...`,
				required: true,
				minLength: 10,
				maxLength: 500,
				colSpan: 2
			});
		}

		// Visual settings group
		if (fields.color !== false || fields.icon !== false) {
			builder.group('Visual Settings', 'Customize appearance');

			if (fields.icon !== false) {
				builder.iconSelector('iconName', 'Icon', {
					placeholder: 'Choose an icon...',
					required: true,
					colSpan: 1
				});
			}

			if (fields.color !== false) {
				builder.color('colorCode', 'Color', {
					colSpan: 1
				});
			}
		}

		// Status settings group
		if (fields.isActive !== false || fields.isVisible !== false) {
			builder.group('Status Settings', 'Control availability and visibility');

			if (fields.isActive !== false) {
				builder.checkbox('isActive', 'Active', {
					helpText: 'Available for use',
					defaultValue: true,
					colSpan: 1
				});
			}

			if (fields.isVisible !== false) {
				builder.checkbox('isVisible', 'Visible', {
					helpText: 'Show in public lists',
					defaultValue: true,
					colSpan: 1
				});
			}
		}

		return builder.build();
	}
}
