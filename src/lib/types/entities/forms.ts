// ============================================================================
// CORE FORM TYPE DEFINITIONS
// Runtime types used by UniversalForm component and form rendering
// These are the foundation - everything else builds on top of these
// ============================================================================

import type { Component } from 'svelte';

// ============================================================================
// ENUMS AND BASIC TYPES
// ============================================================================

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
	| 'upload'
	| 'icon-selector'
	| 'slider'
	| 'toggle'
	| 'tags'
	| 'custom'
	| 'stringList'
	| 'country'
	| 'address';

export type FormLayout = 'single' | 'two-column' | 'three-column' | 'grid' | 'compact';
export type FormVariant = 'default' | 'bordered' | 'floating' | 'minimal';
export type FieldSize = 'sm' | 'md' | 'lg';
export type FormFieldColSpan = 1 | 2 | 3 | 4;
export type FormFieldGroupVariant = 'default' | 'card' | 'minimal';
export type UploadFieldType = 'image' | 'video' | 'document' | 'any';
export type FormFieldDependencyCondition =
	| 'equals'
	| 'not-equals'
	| 'truthy'
	| 'falsy'
	| 'in'
	| 'not-in'
	| 'greater-than'
	| 'less-than';

export type FormFieldValidationRuleType =
	| 'required'
	| 'email'
	| 'url'
	| 'minLength'
	| 'maxLength'
	| 'min'
	| 'max'
	| 'pattern'
	| 'tags'
	| 'multiselect'
	| 'custom';


// ============================================================================
// FIELD CONFIGURATION
// ============================================================================

export interface FormFieldDependency {
	field: string;
	condition: FormFieldDependencyCondition;
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

export interface UploadConfig {
	type: UploadFieldType;
	maxFileSize?: number; // in bytes
	acceptedFileTypes?: string[];
	maxFiles?: number; // for multi-upload
	preview?: boolean; // show preview
	dragDrop?: boolean; // enable drag & drop
	showProgress?: boolean; // show upload progress
}

// Extend the existing FieldOption type
interface SelectOption extends FieldOption {
	description?: string;  // Add our optional property
}

// ============================================================================
// FORM FIELD DEFINITION
// The complete field definition used at runtime
// ============================================================================

export interface FormField {
	name: string;
	label: string;
	type: FormFieldType;

	// Basic properties
	placeholder?: string;
	helpText?: string;
	description?: string;
	required?: boolean;
	disabled?: boolean;
	readonly?: boolean;
	autoFocus?: boolean;

	// Layout
	colSpan?: FormFieldColSpan;
	size?: FieldSize;
	className?: string;
	variant?: FormVariant;

	/*
	 * Type-specific properties
	 */
	min?: number;
	max?: number;
	step?: number;
	minLength?: number;
	maxLength?: number;
	rows?: number;
	cols?: number;
	multiple?: boolean;
	accept?: string;
	pattern?: string;

	// Tag input specific (NEW)
	maxTags?: number; // Maximum number of tags allowed
	minTags?: number; // Minimum number of tags required
	allowDuplicates?: boolean; // Whether to allow duplicate tags
	tagPattern?: RegExp; // Optional regex pattern for tag validation
	tagMaxLength?: number; // Maximum length for individual tags
	tagValidator?: (tag: string) => boolean;

	// File upload
	uploadConfig?: UploadConfig;
	maxFileSize?: number;
	acceptedFileTypes?: string[];

	// Options for select, radio, etc.
	options?: FieldOption[];

	// Default value
	defaultValue?: any;

	// Validation
	validationRules?: ValidationRule[];

	// Dependencies and conditional validation
	dependencies?: FormFieldDependency[];
	conditionalValidation?: ConditionalValidation[];

	// Advanced features
	searchable?: boolean;
	clearable?: boolean;
	loading?: boolean;
	prefix?: string;
	suffix?: string;
	icon?: string;

	// Custom component
	component?: Component;
	componentProps?: Record<string, any>;

	// Tags-specific

	// File upload
	maxFilesize?: number;
	allowedFileTypes?: string[];
	uploadUrl?: string;

	// Slider
	marks?: Record<number, string>;
	tooltipFormatter?: (value: number) => string;

	// Rich text
	toolbar?: string[];

	// StringList specific options (add these)
	minItems?: number;
	maxItems?: number;
	maxItemLength?: number;
	numbered?: boolean;
	addButtonText?: string;

	// Address autocomplete (type: 'address') — names of sibling fields to fill
	// when the user picks a suggestion from the Mapy.cz dropdown.
	addressSiblings?: {
		/** Field name that receives the city value */
		city?: string;
		/** Field name that receives the postal / ZIP code */
		postalCode?: string;
		/** Field name that receives the ISO 3166-1 alpha-2 country code */
		country?: string;
	};
}

// ============================================================================
// FORM FIELD GROUP
// Groups organize related fields together
// ============================================================================

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

// ============================================================================
// FORM SCHEMA
// The complete form definition used by UniversalForm
// ============================================================================

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

	// Content structure
	groups?: FormFieldGroup[];
	fields?: FormField[];

	// Action buttons
	submitLabel?: string;
	cancelLabel?: string;
	resetLabel?: string;
	showCancel?: boolean;
	showReset?: boolean;

	// Advanced features
	autosave?: boolean;
	autosaveDelay?: number;
	confirmOnLeave?: boolean;

	// Lifecycle callbacks
	onBeforeSubmit?: (data: Partial<T>) => Promise<boolean> | boolean;
	onAfterSubmit?: (data: Partial<T>, result: any) => void;
	onFieldChange?: (field: string, value: any, formData: Partial<T>) => void;
}

// ============================================================================
// FORM STATE MANAGEMENT
// Runtime state for form components
// ============================================================================

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

// ============================================================================
// FORM CALLBACKS
// Event handlers for form interactions
// ============================================================================

export interface FormCallbacks<T = Record<string, any>> {
	onValidate?: (result: FormValidationResult) => void;
	onChange?: (field: string, value: any, formState: FormState<T>) => void;
	onSubmit?: (data: T, imageFile?: File) => Promise<void> | void;
	onReset?: () => void;
	onCancel?: () => void;
	onFieldFocus?: (field: string) => void;
	onFieldBlur?: (field: string) => void;
}

// ============================================================================
// VALIDATION RESULT
// ============================================================================

export interface FormValidationResult {
	isValid: boolean;
	errors: Record<string, string>;
	firstErrorField?: string;
}

// ============================================================================
// FORM CONTEXT
// Complete form context for advanced use cases
// ============================================================================

export interface FormContext<T = Record<string, any>> {
	schema: FormSchema<T>;
	state: FormState<T>;
	callbacks: FormCallbacks<T>;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export interface FormError {
	field: string;
	message: string;
	type: FormFieldValidationRuleType;
	value?: any;
}