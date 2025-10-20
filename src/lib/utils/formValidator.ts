import type { FormField, FormValidationResult, ValidationRule } from '$lib/types/entities/forms';

export class FormValidator {

	/**
	 * Validate entire form
	 */
	static validateForm(data: Record<string, any>, fields: FormField[]): FormValidationResult {
		const errors: Record<string, string> = {};
		let firstErrorField: string | undefined;

		fields.forEach(field => {
			const error = this.validateField(data[field.name], field, data);
			if (error) {
				errors[field.name] = error;
				if (!firstErrorField) {
					firstErrorField = field.name;
				}
			}
		});

		return {
			isValid: Object.keys(errors).length === 0,
			errors,
			firstErrorField
		};
	}

	/**
	 * Validate single field
	 */
	static validateField(value: any, field: FormField, formData?: Record<string, any>): string | null {
		// 🔍 DEBUG
		console.log(`[VALIDATOR] 🔍 Validating field: ${field.name}`, {
			type: field.type,
			value: value,
			isArray: Array.isArray(value),
			length: Array.isArray(value) ? value.length : 'N/A'
		});

		// ✅ Handle multiselect/tags BEFORE general validation
		if (field.type === 'multiselect') {
			const error = this.validateMultiSelect(value, field);
			console.log(`  ✓ MultiSelect validation result:`, error || 'VALID');
			return error;
		}

		if (field.type === 'tags') {
			const error = this.validateTagInput(value, field);
			console.log(`  ✓ Tags validation result:`, error || 'VALID');
			return error;
		}

		if (!field.validationRules || field.validationRules.length === 0) {
			return null;
		}

		for (const rule of field.validationRules) {
			const error = this.validateRule(value, rule, field, formData);
			if (error) {
				return error;
			}
		}

		return null;
	}

	/**
	 * Validate individual rule
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
				// ⚠️ Skip max validation for arrays (multiselect/tags)
				if (Array.isArray(value)) {
					return null;
				}
				return this.validateMin(value, rule, field);

			case 'max':
				// ⚠️ Skip max validation for arrays (multiselect/tags)
				if (Array.isArray(value)) {
					return null;
				}
				return this.validateMax(value, rule, field);

			case 'minLength':
				return this.validateMinLength(value, rule, field);

			case 'maxLength':
				return this.validateMaxLength(value, rule, field);

			case 'pattern':
				return this.validatePattern(value, rule, field);

			case 'custom':
				return this.validateCustom(value, rule, field, formData);

			case 'tags':
				return this.validateTagInput(value, field);

			case 'multiselect':
				return this.validateMultiSelect(value, field);

			default:
				return null;
		}
	}

	// Individual validation methods
	private static validateRequired(value: any, rule: ValidationRule, field: FormField): string | null {
		const isEmpty = value === null ||
			value === undefined ||
			(typeof value === 'string' && value.trim() === '') ||
			(Array.isArray(value) && value.length === 0);

		if (isEmpty) {
			return rule.message || `${field.label} is required`;
		}
		return null;
	}

	private static validateEmail(value: any, rule: ValidationRule, field: FormField): string | null {
		if (!value) return null; // Skip if empty (use required rule for that)

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(value)) {
			return rule.message || 'Please enter a valid email address';
		}
		return null;
	}

	private static validateUrl(value: any, rule: ValidationRule, field: FormField): string | null {
		if (!value) return null;

		try {
			new URL(value);
			return null;
		} catch {
			return rule.message || 'Please enter a valid URL';
		}
	}

	private static validateMin(value: any, rule: ValidationRule, field: FormField): string | null {
		if (value === null || value === undefined || value === '') return null;

		const numValue = Number(value);
		if (isNaN(numValue) || numValue < rule.value!) {
			return rule.message || `${field.label} must be at least ${rule.value}`;
		}
		return null;
	}

	private static validateMax(value: any, rule: ValidationRule, field: FormField): string | null {
		if (value === null || value === undefined || value === '') return null;

		const numValue = Number(value);
		if (isNaN(numValue) || numValue > rule.value!) {
			return rule.message || `${field.label} must be no more than ${rule.value}`;
		}
		return null;
	}

	private static validateMinLength(value: any, rule: ValidationRule, field: FormField): string | null {
		if (!value) return null;

		const length = typeof value === 'string' ? value.length : String(value).length;
		if (length < rule.value!) {
			return rule.message || `${field.label} must be at least ${rule.value} characters`;
		}
		return null;
	}

	private static validateMaxLength(value: any, rule: ValidationRule, field: FormField): string | null {
		if (!value) return null;

		const length = typeof value === 'string' ? value.length : String(value).length;
		if (length > rule.value!) {
			return rule.message || `${field.label} must be no more than ${rule.value} characters`;
		}
		return null;
	}

	private static validatePattern(value: any, rule: ValidationRule, field: FormField): string | null {
		if (!value) return null;

		const regex = new RegExp(rule.value as string);
		if (!regex.test(String(value))) {
			return rule.message || `${field.label} format is invalid`;
		}
		return null;
	}

	/**
	 * Validates tag input fields
	 */
	private static validateTagInput(value: any, field: FormField): string | null {
		const tags = Array.isArray(value) ? value : [];

		// Required validation
		if (field.required && tags.length === 0) {
			return field.validationRules?.find(r => r.type === 'required')?.message
				|| `${field.label} is required`;
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
				return field.validationRules?.find(r => r.type === 'pattern')?.message
					|| `Tag "${invalidTag}" contains invalid characters`;
			}
		}

		return null;
	}

	/**
	 * Validates multiselect fields
	 */
	private static validateMultiSelect(value: any, field: FormField): string | null {
		const items = Array.isArray(value) ? value : [];

		console.log(`  📊 MultiSelect validation for ${field.name}:`, {
			items: items,
			count: items.length,
			required: field.required,
			minItems: field.minItems,
			maxItems: field.maxItems
		});

		// Required validation
		if (field.required && items.length === 0) {
			const message = field.validationRules?.find(r => r.type === 'required')?.message
				|| `${field.label} is required`;
			console.log(`    ✗ Required check failed`);
			return message;
		}

		// Minimum items validation
		if (field.minItems !== undefined && items.length < field.minItems) {
			const message = `${field.label} must have at least ${field.minItems} item${field.minItems !== 1 ? 's' : ''}`;
			console.log(`    ✗ Min items check failed: ${items.length} < ${field.minItems}`);
			return message;
		}

		// Maximum items validation
		if (field.maxItems !== undefined && items.length > field.maxItems) {
			const message = `${field.label} cannot have more than ${field.maxItems} item${field.maxItems !== 1 ? 's' : ''}`;
			console.log(`    ✗ Max items check failed: ${items.length} > ${field.maxItems}`);
			return message;
		}

		console.log(`    ✓ All checks passed`);
		return null;
	}

	private static validateCustom(
		value: any,
		rule: ValidationRule,
		field: FormField,
		formData?: Record<string, any>
	): string | null {
		if (rule.validator) {
			return rule.validator(value, formData || {});
		}
		return null;
	}

	// Utility validation rules that can be used in FormBuilder
	static rules = {
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

		// Common pattern shortcuts
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

		// Conditional validation
		requiredIf: (
			dependentField: string,
			dependentValue: any,
			message?: string
		): ValidationRule => ({
			type: 'custom',
			validator: (value, formData) => {
				if (!formData) return null;
				if (formData[dependentField] === dependentValue) {
					return !value ? (message || 'This field is required') : null;
				}
				return null;
			}
		}),

		mustMatch: (otherField: string, message?: string): ValidationRule => ({
			type: 'custom',
			validator: (value, formData) => {
				if (!formData) return null;
				if (value !== formData[otherField]) {
					return message || 'Fields must match';
				}
				return null;
			}
		}),

		// File validation
		fileSize: (maxSizeInMB: number, message?: string): ValidationRule => ({
			type: 'custom',
			validator: (files) => {
				if (!files || files.length === 0) return null;

				for (const file of Array.from(files) as File[]) { // Type assertion
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
				if (!files || files.length === 0) return null;

				for (const file of Array.from(files) as File[]) { // Type assertion
					if (!allowedTypes.includes(file.type)) {
						return message || `File type not allowed. Allowed types: ${allowedTypes.join(', ')}`;
					}
				}
				return null;
			}
		})
	};

	// Form-level validation utilities
	static async validateFormAsync(
		data: Record<string, any>,
		fields: FormField[]
	): Promise<FormValidationResult> {
		// For future async validation support
		return this.validateForm(data, fields);
	}

	static getFieldError(
		fieldName: string,
		errors: Record<string, string>
	): string | null {
		return errors[fieldName] || null;
	}

	static hasFieldError(
		fieldName: string,
		errors: Record<string, string>
	): boolean {
		return Boolean(errors[fieldName]);
	}

	static clearFieldError(
		fieldName: string,
		errors: Record<string, string>
	): Record<string, string> {
		const newErrors = { ...errors };
		delete newErrors[fieldName];
		return newErrors;
	}

	static setFieldError(
		fieldName: string,
		error: string,
		errors: Record<string, string>
	): Record<string, string> {
		return { ...errors, [fieldName]: error };
	}
}