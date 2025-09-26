import type { FormField, FormFieldGroup, FormSchema } from '$lib/types/entities/forms';
import { FormValidator } from '$lib/utils/formValidator';

export class FormBuilder<T = Record<string, any>> {
	private schema: FormSchema<T>;
	private currentGroup: FormFieldGroup | null = null;

	constructor(title?: string, description?: string) {
		this.schema = {
			title,
			description,
			groups: [],
			layout: 'single'
		};
	}

	/**
	 * Set form layout
	 */
	layout(layout: 'single' | 'two-column'): FormBuilder<T> {
		this.schema.layout = layout;
		return this;
	}

	/**
	 * Start a new field group
	 */
	group(title?: string, description?: string): FormBuilder<T> {
		this.currentGroup = {
			title,
			description,
			fields: []
		};
		this.schema.groups?.push(this.currentGroup);
		return this;
	}

	/**
	 * Add a text field
	 */
	text(
		name: string,
		label: string,
		options: {
			placeholder?: string;
			required?: boolean;
			minLength?: number;
			maxLength?: number;
			colSpan?: 1 | 2;
			helpText?: string;
			defaultValue?: string;
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
			validationRules
		});
	}

	/**
	 * Add a textarea field
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
			colSpan?: 1 | 2;
			helpText?: string;
			defaultValue?: string;
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
			validationRules
		});
	}

	/**
	 * Add a number field
	 */
	number(
		name: string,
		label: string,
		options: {
			placeholder?: string;
			required?: boolean;
			min?: number;
			max?: number;
			colSpan?: 1 | 2;
			helpText?: string;
			defaultValue?: number;
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
			colSpan: options.colSpan,
			helpText: options.helpText,
			defaultValue: options.defaultValue,
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
			colSpan?: 1 | 2;
			helpText?: string;
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
			colSpan?: 1 | 2;
		} = {}
	): FormBuilder<T> {
		return this.addField({
			name,
			label,
			type: 'checkbox',
			helpText: options.helpText,
			defaultValue: options.defaultValue || false,
			colSpan: options.colSpan
		});
	}

	/**
	 * Add a select field
	 */
	select(
		name: string,
		label: string,
		optionsArray: Array<{ label: string; value: any }>,
		options: {
			placeholder?: string;
			required?: boolean;
			colSpan?: 1 | 2;
			helpText?: string;
			defaultValue?: any;
		} = {}
	): FormBuilder<T> {
		const validationRules = [];

		if (options.required) {
			validationRules.push(FormValidator.rules.required());
		}

		// Filter out placeholder options from validation if they exist
		const hasPlaceholder = optionsArray.some((opt) => opt.value === '');

		return this.addField({
			name,
			label,
			type: 'select',
			placeholder: options.placeholder,
			required: options.required,
			options: optionsArray,
			colSpan: options.colSpan,
			helpText: options.helpText,
			// Don't set defaultValue to empty string if required and has placeholder
			defaultValue:
				options.defaultValue !== undefined
					? options.defaultValue
					: hasPlaceholder && options.required
						? ''
						: optionsArray[0]?.value || '',
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
			colSpan?: 1 | 2;
			defaultValue?: string;
			previewColor?: string;
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
			previewColor: options.previewColor,
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
			colSpan?: 1 | 2;
			helpText?: string;
			defaultValue?: any;
			validationRules?: any[];
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
			validationRules: options.validationRules
		});
	}

	/**
	 * Add a field to current group or create default group
	 */
	private addField(field: FormField): FormBuilder<T> {
		if (!this.currentGroup) {
			this.group(); // Create default group
		}

		this.currentGroup!.fields.push(field);
		return this;
	}

	/**
	 * Build and return the form schema
	 */
	build(): FormSchema<T> {
		return this.schema;
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