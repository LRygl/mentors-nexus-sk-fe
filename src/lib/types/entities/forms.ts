export interface ValidationRule<T = any> {
	type: 'required' | 'minLength' | 'maxLength' | 'min' | 'max' | 'pattern' | 'custom';
	value?: T;
	message: string;
	validator?: (value: any, formData?: Record<string, any>) => boolean;
}

export interface FormField<T = any> {
	name: string;
	label: string;
	type: 'text' | 'textarea' | 'number' | 'color' | 'checkbox' | 'select' | 'icon-selector' | 'image-upload' | 'date' | 'tags' | 'multiselect' | 'custom';
	placeholder?: string;
	helpText?: string;
	required?: boolean;
	defaultValue?: T;
	validationRules?: ValidationRule[];

	// Image upload specific
	accept?: string; // e.g., 'image/*' or 'image/png,image/jpeg'
	maxSize?: number; // Max file size in bytes
	previewWidth?: number;
	previewHeight?: number;

	// Dependency and conditional validation
	dependencies?: FormFieldDependency[];
	conditionalValidation?: {
		when: FormFieldDependency;
		rules: any[];
	}[];

	// Field-specific option
	options?: Array<{
		label: string;
		value: any;
		searchText?: string;
		metadata?: Record<string, any>;
	}>; // For Select and Multiselect fields
	min?: number;
	max?: number;
	minLength?: number;
	maxLength?: number;
	minItems?: number; // For multiselect and tags
	maxItems?: number; // For multiselect and tags
	rows?: number; // For Textarea
	component?: any; // For custom components
	componentProps?: Record<string, any>;
	onChangeType?: (value: T) => void; // Optional type hint for the onChange callback

	// Select/Multiselect specific
	searchable?: boolean;

	// Date specific
	minDate?: string | Date;
	maxDate?: string | Date;

	// Layout options
	colSpan?: 1 | 2; // Grid Column span
	className?: string;

	// Icon selector specific
	previewColor?: string;

 }


export interface FormFieldDependency {
	field: string;
	condition: 'equals' | 'not-equals' | 'truthy' | 'falsy';
	value?: any;
}

export interface FormFieldGroup {
	title?: string;
	description?: string;
	fields: FormField[];
	className?: string;
}

export interface FormSchema<T = Record<string, any>> {
	title?: string;
	description?: string;
	groups?: FormFieldGroup[];
	fields?: FormField[]; // For simple forms without groups
	submitLabel?: string;
	cancelLabel?: string;
	layout?: 'single' | 'two-column';
}

export interface FormState<T = Record<string, any>> {
	data: T;
	errors: Record<string, string>;
	touched: Record<string, boolean>;
	isValid: boolean;
	isDirty: boolean;
}

export interface FormValidationResult {
	isValid: boolean;
	errors: Record<string, string>;
}

export interface ConditionalValidation {
	when: FormFieldDependency;
	rules: any[];
}

export interface FormCallbacks<T = Record<string, any>> {
	onSubmit?: (data: T) => Promise<void> | void;
	onCancel?: () => void;
	onValidate?: (result: FormValidationResult) => void;
	onChange?: (field: string, value: any, formState: FormState<T>) => void;
}

