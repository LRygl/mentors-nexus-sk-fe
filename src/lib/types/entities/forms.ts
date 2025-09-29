import type { Component } from 'svelte';

export type FormFieldType =
	| 'text'
	| 'email'
	| 'password'
	| 'textarea'
	| 'number'
	| 'tel'
	| 'url'
	| 'color'
	| 'date'
	| 'datetime-local'
	| 'time'
	| 'checkbox'
	| 'select'
	| 'multiselect'
	| 'radio'
	| 'file'
	| 'image'
	| 'icon-selector'
	| 'slider'
	| 'toggle'
	| 'tags'
	| 'custom';

export type FormLayout = 'single' |'two-column' | 'three-column' | 'grid' | 'compact';
export type FormVariant = 'default' | 'bordered' | 'floating' | 'minimal';
export type FieldSize = 'sm' | 'md' | 'lg';
export type FormFieldColSpan = 1 | 2 | 3 | 4;
export type FormFieldGroupVariant = 'default' | 'card' | 'minimal';
export type FormFieldDependencyConcition = 'equals' | 'not-equals' | 'truthy' | 'falsy' | 'id' | 'not-in' | 'greater-than' | 'less-than';
export type FormFieldValidationRuleType = 'required' | 'email' | 'url' | 'minLength' | 'maxLength' | 'min' | 'max' | 'pattern' | 'custom';

export interface FormFieldDependency {
	field: string;
	condition: FormFieldDependencyConcition;
	value?: any;
	values?: any[]; // For 'in' and 'not-in' conditions
}

export interface ConditionalValidation {
	when: FormFieldDependency;
	rules: ValidationRule[];
}

export interface ValidationRule {
	type: FormFieldValidationRuleType;
	value?: any;
	message?: string;
	validator?: (value: any, formData?: Record<string, any>) => string | null;
}

export interface FieldOption {
	label: string;
	value: any;
	disabled?: boolean;
	icon?: string;
	color?: string;
	group?: string;
}

/*
* FORM FIELD DEFINITION
*/
export interface FormField {
	name: string;
	label: string;
	type: FormFieldType;

	// Basic form properties
	placeholder?: string;
	helpText?: string;
	description?: string;
	required?: boolean;
	disabled?: boolean;
	readonly?: boolean;
	autoFocus?: boolean;

	// Layout and styling
	colSpan?: FormFieldColSpan;
	size?: FieldSize;
	className?: string;
	variant?: FormVariant;

	// Type-specific field properties
	min?:number;
	max?:number;
	step?:number;
	minLength?:number;
	maxLength?:number;
	rows?:number; // For Textarea
	cols?:number;
	multiple?: boolean;
	accept?:string; // For File inputs
	pattern?:string;

	// Options for select, radio, etc.
	options?: FieldOption[];

	// Default values
	defaultValue?: any;

	// Validation
	validationRules?: ValidationRule[];

	// Dependency and conditional validation
	dependencies?: FormFieldDependency[];
	conditionalValidation?: ConditionalValidation[];

	// Advanced features
	searchable?: boolean; // For select Fields
	clearable?: boolean;
	loading?: boolean;
	prefix?: string;
	suffix?: string;
	icon?: string;

	// Custom component
	component?: Component;
	componentProps?: Record<string, any>

	// Rich text options
	toolbar?: string[];

	// File upload options
	maxFilesize?: number;
	allowedFileTypes?: string[];
	uploadUrl?: string;

	// Slider options
	marks?: Record<number, string>
	toltipFormatter?: (value: number) => string;

	/*
	onChangeType?: (value: T) => void; // Optional type hint for the onChange callback
	// Icon selector specific
	previewColor?: string;
  */
 }

export interface FormFieldGroup {
	id?: string;
	title?: string;
	description?: string;
	icon?: string;
	collapsible?: boolean;
	collapsed?: boolean;
	className?: string;
	variant?: FormFieldGroupVariant;
	fields: FormField[];
}

export interface FormSchema<T = Record<string, any>> {
	id?: string;
	title?: string;
	description?: string;
	layout?: FormLayout;
	variant?: FormVariant;
	size?: FieldSize;
	className?: string;

	// Form-level options
	validateOnChange?: boolean;
	validateOnBlur?: boolean;
	showProgress?: boolean;
	showSteps?: boolean;

	// Groups or direct Fields
	groups?: FormFieldGroup[];
	fields?: FormField[];

	// Form actions
	submitLabel?: string;
	cancelLabel?: string;
	resetLabel?: string;
	showCancel?: boolean;
	showReset?: boolean;

	// Advanced actions
	autosave?: boolean;
	autosaveDelay?: number;
	confirmOnLeave?: boolean;

	// Callbacks
	onBeforeSubmit?: (data: T) => Promise<boolean> | boolean;
	onAfterSubmit?: (data: T, result: any) => void;
	onFieldChange?: (field: string, value: any, formData: T) => void;
}

export interface FormState<T = Record<string, any>> {
	data: T;
	errors: Record<string, string>;
	touched: Record<string, boolean>;
	loading: Record<string, boolean>;
	isValid: boolean;
	isDirty: boolean;
	isSubmitting: boolean;
	submitCount: number;
}

export interface FormCallbacks<T = Record<string, any>> {
	onValidate?: (result: FormValidationResult) => void;
	onChange?: (field: string, value: any, formState: FormState<T>) => void;
	onSubmit?: (data: T) => Promise<void> | void;
	onReset?: () => void;
	onCancel?: () => void;
	onFieldFocus?: (field: string) => void;
	onFieldBlur?: (field: string) => void;
}

export interface FormValidationResult {
	isValid: boolean;
	errors: Record<string, string>;
	firstErrorField?: string;
}

// Preset configuration for common form patterns
export interface FromPreset {
	name: string;
	description: string;
	schema: Partial<FormSchema>
	defaultFields?: FormField[];
}

// Theme configuration
export interface FormTheme {
	name:string;
	colors: {
		primary: string;
		success: string;
		warning: string;
		error: string;
		info: string;
	};
	spacing: {
		xs: string;
		sm: string;
		md: string;
		lg: string;
		xl: string;
	};
	borderRadius: {
		sm: string;
		md: string;
		lg: string;
	};
	shadows: {
		sm: string;
		md: string;
		lg: string;
	};
}


