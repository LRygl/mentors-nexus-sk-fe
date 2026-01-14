import type { FormField, FormValidationResult, ValidationRule } from '$lib/types/entities/forms';

/**
 * FormValidator
 *
 * Comprehensive form and field validation system with support for:
 * - Type-specific validation (number, email, URL, tags, multiselect)
 * - Standard validation rules (required, min/max, length, pattern)
 * - Custom validation functions
 * - Conditional validation
 * - Async validation support
 *
 * @example
 * ```typescript
 * // Validate entire form
 * const result = FormValidator.validateForm(formData, fields);
 * if (!result.isValid) {
 *   console.log('Errors:', result.errors);
 * }
 *
 * // Validate single field
 * const error = FormValidator.validateField(value, field, formData);
 * if (error) {
 *   console.log('Field error:', error);
 * }
 * ```
 */
export class FormValidator {
	// Enable/disable debug logging
	private static DEBUG = false;

	/**
	 * Validate entire form
	 *
	 * @param data - Form data to validate
	 * @param fields - Field definitions with validation rules
	 * @returns Validation result with errors and first error field
	 */
	static validateForm(data: Record<string, any>, fields: FormField[]): FormValidationResult {
		const errors: Record<string, string> = {};
		let firstErrorField: string | undefined;

		for (const field of fields) {
			const error = this.validateField(data[field.name], field, data);
			if (error) {
				errors[field.name] = error;
				if (!firstErrorField) {
					firstErrorField = field.name;
				}
			}
		}

		return {
			isValid: Object.keys(errors).length === 0,
			errors,
			firstErrorField
		};
	}

	/**
	 * Validate single field based on its type and validation rules
	 *
	 * @param value - Field value to validate
	 * @param field - Field definition
	 * @param formData - Optional full form data for cross-field validation
	 * @returns Error message if invalid, null if valid
	 */
	static validateField(value: any, field: FormField, formData?: Record<string, any>): string | null {
		this.log(`Validating field: ${field.name}`, {
			type: field.type,
			value,
			isArray: Array.isArray(value),
			length: Array.isArray(value) ? value.length : 'N/A'
		});

		// Type-specific validation (handles all validation for these types)
		switch (field.type) {
			case 'number':
				return this.validateNumberInput(value, field);
			case 'multiselect':
				return this.validateMultiSelect(value, field);
			case 'tags':
				return this.validateTagInput(value, field);
		}

		// General validation rules
		if (!field.validationRules || field.validationRules.length === 0) {
			return null;
		}

		// Validate each rule in order, return first error
		for (const rule of field.validationRules) {
			const error = this.validateRule(value, rule, field, formData);
			if (error) {
				return error;
			}
		}

		return null;
	}

	/**
	 * Validate a single validation rule
	 *
	 * @private
	 */
	private static validateRule(
		value: any,
		rule: ValidationRule,
		field: FormField,
		formData?: Record<string, any>
	): string | null {
		switch (rule.type) {
			case 'required':
				return this.validateRequired(value, rule, field);
			case 'email':
				return this.validateEmail(value, rule, field);
			case 'url':
				return this.validateUrl(value, rule, field);
			case 'min':
				return Array.isArray(value) ? null : this.validateMin(value, rule, field);
			case 'max':
				return Array.isArray(value) ? null : this.validateMax(value, rule, field);
			case 'minLength':
				return this.validateMinLength(value, rule, field);
			case 'maxLength':
				return this.validateMaxLength(value, rule, field);
			case 'pattern':
				return this.validatePattern(value, rule, field);
			case 'custom':
				return this.validateCustom(value, rule, field, formData);
			default:
				return null;
		}
	}

	// ============================================================================
	// TYPE-SPECIFIC VALIDATORS
	// ============================================================================

	/**
	 * Validates number input fields
	 * Handles: required, min, max, step, integer, positive/negative patterns
	 *
	 * @private
	 */
	private static validateNumberInput(value: any, field: FormField): string | null {
		// Handle empty value
		if (this.isEmpty(value)) {
			return field.required
				? this.getValidationMessage(field, 'required', `${field.label} is required`)
				: null;
		}

		// Parse and validate number
		const numValue = Number(value);
		if (!Number.isFinite(numValue)) {
			return `${field.label} must be a valid number`;
		}

		// Min value validation
		if (field.min !== undefined && numValue < field.min) {
			return this.getValidationMessage(
				field,
				'min',
				`${field.label} must be at least ${field.min}`
			);
		}

		// Max value validation
		if (field.max !== undefined && numValue > field.max) {
			return this.getValidationMessage(
				field,
				'max',
				`${field.label} must be no more than ${field.max}`
			);
		}

		// Step validation
		if (field.step !== undefined && field.step > 0) {
			const error = this.validateStep(numValue, field);
			if (error) return error;
		}

		// Pattern-based validation
		if (field.pattern) {
			const error = this.validateNumberPattern(numValue, field);
			if (error) return error;
		}

		return null;
	}

	/**
	 * Validates multiselect fields
	 * Handles: required, minItems, maxItems
	 *
	 * @private
	 */
	private static validateMultiSelect(value: any, field: FormField): string | null {
		const items = Array.isArray(value) ? value : [];

		this.log(`MultiSelect validation for ${field.name}:`, {
			items,
			count: items.length,
			required: field.required,
			minItems: field.minItems,
			maxItems: field.maxItems
		});

		// Required validation
		if (field.required && items.length === 0) {
			return this.getValidationMessage(field, 'required', `${field.label} is required`);
		}

		// Minimum items validation
		if (field.minItems !== undefined && items.length < field.minItems) {
			return `${field.label} must have at least ${field.minItems} item${field.minItems !== 1 ? 's' : ''}`;
		}

		// Maximum items validation
		if (field.maxItems !== undefined && items.length > field.maxItems) {
			return `${field.label} cannot have more than ${field.maxItems} item${field.maxItems !== 1 ? 's' : ''}`;
		}

		return null;
	}

	/**
	 * Validates tag input fields
	 * Handles: required, minTags, maxTags, tagMaxLength, tagPattern
	 *
	 * @private
	 */
	private static validateTagInput(value: any, field: FormField): string | null {
		const tags = Array.isArray(value) ? value : [];

		// Required validation
		if (field.required && tags.length === 0) {
			return this.getValidationMessage(field, 'required', `${field.label} is required`);
		}

		// Minimum tags validation
		if (field.minTags !== undefined && tags.length < field.minTags) {
			return `${field.label} must have at least ${field.minTags} tag${field.minTags !== 1 ? 's' : ''}`;
		}

		// Maximum tags validation
		if (field.maxTags !== undefined && tags.length > field.maxTags) {
			return `${field.label} cannot have more than ${field.maxTags} tag${field.maxTags !== 1 ? 's' : ''}`;
		}

		// Individual tag length validation
		if (field.tagMaxLength) {
			const tooLongTag = tags.find(tag => tag.length > field.tagMaxLength!);
			if (tooLongTag) {
				return `Tag "${tooLongTag}" exceeds maximum length of ${field.tagMaxLength} characters`;
			}
		}

		// Pattern validation for tags
		if (field.tagPattern) {
			const invalidTag = tags.find(tag => !field.tagPattern!.test(tag));
			if (invalidTag) {
				return this.getValidationMessage(
					field,
					'pattern',
					`Tag "${invalidTag}" contains invalid characters`
				);
			}
		}

		return null;
	}

	// ============================================================================
	// STANDARD VALIDATORS
	// ============================================================================

	/**
	 * Validates required fields
	 *
	 * @private
	 */
	private static validateRequired(value: any, rule: ValidationRule, field: FormField): string | null {
		if (this.isEmpty(value)) {
			return rule.message || `${field.label} is required`;
		}
		return null;
	}

	/**
	 * Validates email format
	 *
	 * @private
	 */
	private static validateEmail(value: any, rule: ValidationRule, field: FormField): string | null {
		if (!value) return null;

		// RFC 5322 compliant email regex (simplified)
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(String(value))) {
			return rule.message || 'Please enter a valid email address';
		}
		return null;
	}

	/**
	 * Validates URL format
	 *
	 * @private
	 */
	private static validateUrl(value: any, rule: ValidationRule, field: FormField): string | null {
		if (!value) return null;

		try {
			new URL(String(value));
			return null;
		} catch {
			return rule.message || 'Please enter a valid URL';
		}
	}

	/**
	 * Validates minimum numeric value
	 *
	 * @private
	 */
	private static validateMin(value: any, rule: ValidationRule, field: FormField): string | null {
		if (this.isEmpty(value)) return null;

		const numValue = Number(value);
		if (!Number.isFinite(numValue) || numValue < rule.value!) {
			return rule.message || `${field.label} must be at least ${rule.value}`;
		}
		return null;
	}

	/**
	 * Validates maximum numeric value
	 *
	 * @private
	 */
	private static validateMax(value: any, rule: ValidationRule, field: FormField): string | null {
		if (this.isEmpty(value)) return null;

		const numValue = Number(value);
		if (!Number.isFinite(numValue) || numValue > rule.value!) {
			return rule.message || `${field.label} must be no more than ${rule.value}`;
		}
		return null;
	}

	/**
	 * Validates minimum string length
	 *
	 * @private
	 */
	private static validateMinLength(value: any, rule: ValidationRule, field: FormField): string | null {
		if (!value) return null;

		const length = String(value).length;
		if (length < rule.value!) {
			return rule.message || `${field.label} must be at least ${rule.value} characters`;
		}
		return null;
	}

	/**
	 * Validates maximum string length
	 *
	 * @private
	 */
	private static validateMaxLength(value: any, rule: ValidationRule, field: FormField): string | null {
		if (!value) return null;

		const length = String(value).length;
		if (length > rule.value!) {
			return rule.message || `${field.label} must be no more than ${rule.value} characters`;
		}
		return null;
	}

	/**
	 * Validates against regex pattern
	 *
	 * @private
	 */
	private static validatePattern(value: any, rule: ValidationRule, field: FormField): string | null {
		if (!value) return null;

		const regex = new RegExp(rule.value as string);
		if (!regex.test(String(value))) {
			return rule.message || `${field.label} format is invalid`;
		}
		return null;
	}

	/**
	 * Executes custom validation function
	 *
	 * @private
	 */
	private static validateCustom(
		value: any,
		rule: ValidationRule,
		field: FormField,
		formData?: Record<string, any>
	): string | null {
		return rule.validator ? rule.validator(value, formData || {}) : null;
	}

	// ============================================================================
	// HELPER METHODS
	// ============================================================================

	/**
	 * Validates step increment for number fields
	 *
	 * @private
	 */
	private static validateStep(numValue: number, field: FormField): string | null {
		const step = field.step!;
		const min = field.min ?? 0;

		// Check if value is a valid step from min
		const remainder = Math.abs((numValue - min) % step);
		const epsilon = 0.0001; // Tolerance for floating point comparison

		if (remainder > epsilon && remainder < step - epsilon) {
			return `${field.label} must be in increments of ${step}`;
		}

		// Special case: step of 1 should enforce integers
		if (step === 1 && !Number.isInteger(numValue)) {
			return `${field.label} must be a whole number`;
		}

		return null;
	}

	/**
	 * Validates number patterns (integer, positive, negative, etc.)
	 *
	 * @private
	 */
	private static validateNumberPattern(numValue: number, field: FormField): string | null {
		switch (field.pattern) {
			case 'integer':
				if (!Number.isInteger(numValue)) {
					return `${field.label} must be a whole number`;
				}
				break;

			case 'positive':
				if (numValue <= 0) {
					return `${field.label} must be a positive number`;
				}
				break;

			case 'negative':
				if (numValue >= 0) {
					return `${field.label} must be a negative number`;
				}
				break;

			case 'non-negative':
				if (numValue < 0) {
					return `${field.label} must be zero or greater`;
				}
				break;
		}

		return null;
	}

	/**
	 * Check if value is considered empty
	 *
	 * @private
	 */
	private static isEmpty(value: any): boolean {
		return (
			value === null ||
			value === undefined ||
			value === '' ||
			(typeof value === 'string' && value.trim() === '') ||
			(Array.isArray(value) && value.length === 0)
		);
	}

	/**
	 * Get validation message from field's validation rules or use default
	 *
	 * @private
	 */
	private static getValidationMessage(
		field: FormField,
		ruleType: string,
		defaultMessage: string
	): string {
		const rule = field.validationRules?.find(r => r.type === ruleType);
		return rule?.message || defaultMessage;
	}

	/**
	 * Debug logging helper
	 *
	 * @private
	 */
	private static log(message: string, data?: any): void {
		if (this.DEBUG) {
			console.log(`[VALIDATOR] ${message}`, data);
		}
	}

	// ============================================================================
	// VALIDATION RULE BUILDERS
	// ============================================================================

	/**
	 * Pre-built validation rules for common use cases
	 *
	 * @example
	 * ```typescript
	 * const field = {
	 *   name: 'email',
	 *   type: 'text',
	 *   validationRules: [
	 *     FormValidator.rules.required('Email is required'),
	 *     FormValidator.rules.email('Invalid email format')
	 *   ]
	 * };
	 * ```
	 */
	static rules = {
		// ===== Basic Rules =====

		required: (message?: string): ValidationRule => ({
			type: 'required',
			message
		}),

		email: (message?: string): ValidationRule => ({
			type: 'email',
			message
		}),

		url: (message?: string): ValidationRule => ({
			type: 'url',
			message
		}),

		min: (value: number, message?: string): ValidationRule => ({
			type: 'min',
			value,
			message
		}),

		max: (value: number, message?: string): ValidationRule => ({
			type: 'max',
			value,
			message
		}),

		minLength: (value: number, message?: string): ValidationRule => ({
			type: 'minLength',
			value,
			message
		}),

		maxLength: (value: number, message?: string): ValidationRule => ({
			type: 'maxLength',
			value,
			message
		}),

		pattern: (regex: string, message?: string): ValidationRule => ({
			type: 'pattern',
			value: regex,
			message
		}),

		custom: (validator: (value: any, formData?: Record<string, any>) => string | null): ValidationRule => ({
			type: 'custom',
			validator
		}),

		// ===== Number-Specific Rules =====

		integer: (message?: string): ValidationRule => ({
			type: 'custom',
			validator: (value) => {
				if (value === null || value === undefined || value === '') return null;
				const num = Number(value);
				if (!Number.isFinite(num)) return 'Must be a valid number';
				return !Number.isInteger(num) ? (message || 'Must be a whole number') : null;
			}
		}),

		positive: (message?: string): ValidationRule => ({
			type: 'custom',
			validator: (value) => {
				if (value === null || value === undefined || value === '') return null;
				const num = Number(value);
				if (!Number.isFinite(num)) return 'Must be a valid number';
				return num <= 0 ? (message || 'Must be a positive number') : null;
			}
		}),

		negative: (message?: string): ValidationRule => ({
			type: 'custom',
			validator: (value) => {
				if (value === null || value === undefined || value === '') return null;
				const num = Number(value);
				if (!Number.isFinite(num)) return 'Must be a valid number';
				return num >= 0 ? (message || 'Must be a negative number') : null;
			}
		}),

		nonNegative: (message?: string): ValidationRule => ({
			type: 'custom',
			validator: (value) => {
				if (value === null || value === undefined || value === '') return null;
				const num = Number(value);
				if (!Number.isFinite(num)) return 'Must be a valid number';
				return num < 0 ? (message || 'Must be zero or greater') : null;
			}
		}),

		range: (min: number, max: number, message?: string): ValidationRule => ({
			type: 'custom',
			validator: (value) => {
				if (value === null || value === undefined || value === '') return null;
				const num = Number(value);
				if (!Number.isFinite(num)) return 'Must be a valid number';
				return num < min || num > max
					? (message || `Must be between ${min} and ${max}`)
					: null;
			}
		}),

		multipleOf: (step: number, message?: string): ValidationRule => ({
			type: 'custom',
			validator: (value) => {
				if (value === null || value === undefined || value === '') return null;
				const num = Number(value);
				if (!Number.isFinite(num)) return 'Must be a valid number';
				const remainder = Math.abs(num % step);
				return remainder > 0.0001 && remainder < step - 0.0001
					? (message || `Must be a multiple of ${step}`)
					: null;
			}
		}),

		// ===== Pattern Shortcuts =====

		phone: (message?: string): ValidationRule => ({
			type: 'pattern',
			value: '^[+]?[1-9]?[0-9]{7,15}$',
			message: message || 'Please enter a valid phone number'
		}),

		alphanumeric: (message?: string): ValidationRule => ({
			type: 'pattern',
			value: '^[a-zA-Z0-9]+$',
			message: message || 'Only letters and numbers are allowed'
		}),

		noSpaces: (message?: string): ValidationRule => ({
			type: 'pattern',
			value: '^[^\\s]+$',
			message: message || 'Spaces are not allowed'
		}),

		hexColor: (message?: string): ValidationRule => ({
			type: 'pattern',
			value: '^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$',
			message: message || 'Please enter a valid hex color (e.g., #FF0000)'
		}),

		// ===== Conditional Rules =====

		requiredIf: (
			dependentField: string,
			dependentValue: any,
			message?: string
		): ValidationRule => ({
			type: 'custom',
			validator: (value, formData) => {
				if (!formData || formData[dependentField] !== dependentValue) {
					return null;
				}
				return value === null || value === undefined || value === ''
					? (message || 'This field is required')
					: null;
			}
		}),

		mustMatch: (otherField: string, otherFieldLabel?: string, message?: string): ValidationRule => ({
			type: 'custom',
			validator: (value, formData) => {
				if (!formData) return null;
				return value !== formData[otherField]
					? (message || `Must match ${otherFieldLabel || otherField}`)
					: null;
			}
		}),

		// ===== File Validation =====

		fileSize: (maxSizeInMB: number, message?: string): ValidationRule => ({
			type: 'custom',
			validator: (files) => {
				if (!files || !files.length) return null;

				for (const file of Array.from(files) as File[]) {
					if (file.size > maxSizeInMB * 1024 * 1024) {
						return message || `File size must be less than ${maxSizeInMB}MB`;
					}
				}
				return null;
			}
		}),

		fileType: (allowedTypes: string[], message?: string): ValidationRule => ({
			type: 'custom',
			validator: (files) => {
				if (!files || !files.length) return null;

				for (const file of Array.from(files) as File[]) {
					if (!allowedTypes.includes(file.type)) {
						return message || `File type not allowed. Allowed: ${allowedTypes.join(', ')}`;
					}
				}
				return null;
			}
		})
	};

	// ============================================================================
	// UTILITY METHODS
	// ============================================================================

	/**
	 * Async validation support (for future server-side validation)
	 *
	 * @param data - Form data
	 * @param fields - Field definitions
	 * @returns Promise resolving to validation result
	 */
	static async validateFormAsync(
		data: Record<string, any>,
		fields: FormField[]
	): Promise<FormValidationResult> {
		return this.validateForm(data, fields);
	}

	/**
	 * Get error message for a specific field
	 *
	 * @param fieldName - Field name
	 * @param errors - Error object
	 * @returns Error message or null
	 */
	static getFieldError(fieldName: string, errors: Record<string, string>): string | null {
		return errors[fieldName] || null;
	}

	/**
	 * Check if field has an error
	 *
	 * @param fieldName - Field name
	 * @param errors - Error object
	 * @returns True if field has error
	 */
	static hasFieldError(fieldName: string, errors: Record<string, string>): boolean {
		return Boolean(errors[fieldName]);
	}

	/**
	 * Clear error for specific field
	 *
	 * @param fieldName - Field name
	 * @param errors - Error object
	 * @returns New error object without specified field
	 */
	static clearFieldError(
		fieldName: string,
		errors: Record<string, string>
	): Record<string, string> {
		const { [fieldName]: _, ...rest } = errors;
		return rest;
	}

	/**
	 * Set error for specific field
	 *
	 * @param fieldName - Field name
	 * @param error - Error message
	 * @param errors - Error object
	 * @returns New error object with specified field error
	 */
	static setFieldError(
		fieldName: string,
		error: string,
		errors: Record<string, string>
	): Record<string, string> {
		return { ...errors, [fieldName]: error };
	}

	/**
	 * Enable debug logging
	 */
	static enableDebug(): void {
		this.DEBUG = true;
	}

	/**
	 * Disable debug logging
	 */
	static disableDebug(): void {
		this.DEBUG = false;
	}
}