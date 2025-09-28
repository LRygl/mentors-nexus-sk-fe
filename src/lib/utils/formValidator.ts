import type { FormField, FormValidationResult, ValidationRule } from '$lib/types/entities/forms';

export class FormValidator {

	/**
 	* Validates a single field value against its validation rules
	*/
	static validateField(value: any, field: FormField, formData?: Record<string, any>): string | null {
		if (!field.validationRules) return null;

		for (const rule of field.validationRules) {
			// Handle both old and new rule formats
			const ruleType = typeof rule === 'object' && rule.type ? rule.type : rule.name || rule;
			const ruleMessage = typeof rule === 'object' && rule.message ? rule.message : undefined;

			switch (ruleType) {
				case 'required':
					if (!value || (typeof value === 'string' && value.trim() === '')) {
						return ruleMessage || `${field.label} is required`;
					}
					break;

				// Add other validation cases as needed
				default:
					// Handle existing validation rules
					const result = this.executeRule(rule, value, field, formData);
					if (result) return result;
			}
		}

		return null;
	}

	private static executeRule(rule: any, value: any, field: FormField, formData?: Record<string, any>): string | null {
		// Handle your existing validation rules here
		if (typeof rule === 'function') {
			return rule(value, formData);
		}

		// Handle object-based rules
		if (typeof rule === 'object' && rule.validate) {
			return rule.validate(value, formData);
		}

		return null;
	}

	/**
	 * Validates entire form data against schema
	 */
	static validateForm<T extends Record<string, any>>(
		data: T,
		fields: FormField[]
	): FormValidationResult {
		const errors: Record<string, string> = {};
		let isValid = true;

		for (const field of fields) {
			const fieldError = this.validateField(data[field.name], field, data);
			if (fieldError) {
				errors[field.name] = fieldError;
				isValid = false;
			}
		}

		return { isValid, errors };
	}

	/**
	 * Apply individual validation rule
	 */
	private static applyValidationRule(
		value: any,
		rule: ValidationRule,
		formData?: Record<string, any>
	): string {
		switch (rule.type) {
			case 'required':
				if (this.isEmpty(value)) {
					return rule.message;
				}
				break;

			case 'minLength':
				if (typeof value === 'string' && value.length < (rule.value as number)) {
					return rule.message;
				}
				break;

			case 'maxLength':
				if (typeof value === 'string' && value.length > (rule.value as number)) {
					return rule.message;
				}
				break;

			case 'min':
				if (typeof value === 'number' && value < (rule.value as number)) {
					return rule.message;
				}
				break;

			case 'max':
				if (typeof value === 'number' && value > (rule.value as number)) {
					return rule.message;
				}
				break;

			case 'pattern':
				if (typeof value === 'string' && !(rule.value as RegExp).test(value)) {
					return rule.message;
				}
				break;

			case 'custom':
				if (rule.validator && !rule.validator(value, formData)) {
					return rule.message;
				}
				break;

			default:
				console.warn(`Unknown validation rule type: ${rule.type}`);
		}

		return '';
	}

	/**
	 * Check if value is empty (null, undefined, empty string, etc.)
	 */
	private static isEmpty(value: any): boolean {
		return value === null ||
			value === undefined ||
			(typeof value === 'string' && value.trim() === '') ||
			(Array.isArray(value) && value.length === 0);
	}

	/**
	 * Get default validation rules for common field types
	 */
	static getDefaultRules(fieldType: string, required: boolean = false): ValidationRule[] {
		const rules: ValidationRule[] = [];

		if (required) {
			rules.push({
				type: 'required',
				message: 'This field is required'
			});
		}

		switch (fieldType) {
			case 'text':
				rules.push({
					type: 'maxLength',
					value: 255,
					message: 'Must be less than 255 characters'
				});
				break;

			case 'textarea':
				rules.push({
					type: 'maxLength',
					value: 1000,
					message: 'Must be less than 1000 characters'
				});
				break;

			case 'number':
				rules.push({
					type: 'min',
					value: 0,
					message: 'Must be a positive number'
				});
				break;

			case 'color':
				rules.push({
					type: 'pattern',
					value: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
					message: 'Must be a valid hex color'
				});
				break;
		}

		return rules;
	}

	/**
	 * Common validation rules factory
	 */
	static rules = {
		required: (message: string = 'This field is required'): ValidationRule => ({
			type: 'required',
			message
		}),

		minLength: (length: number, message?: string): ValidationRule => ({
			type: 'minLength',
			value: length,
			message: message || `Must be at least ${length} characters`
		}),

		maxLength: (length: number, message?: string): ValidationRule => ({
			type: 'maxLength',
			value: length,
			message: message || `Must be less than ${length} characters`
		}),

		min: (value: number, message?: string): ValidationRule => ({
			type: 'min',
			value,
			message: message || `Must be at least ${value}`
		}),

		max: (value: number, message?: string): ValidationRule => ({
			type: 'max',
			value,
			message: message || `Must be less than ${value}`
		}),

		pattern: (regex: RegExp, message: string): ValidationRule => ({
			type: 'pattern',
			value: regex,
			message
		}),

		hexColor: (message: string = 'Must be a valid hex color'): ValidationRule => ({
			type: 'pattern',
			value: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
			message
		}),

		email: (message: string = 'Must be a valid email address'): ValidationRule => ({
			type: 'pattern',
			value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
			message
		}),

		custom: (validator: (value: any, formData?: Record<string, any>) => boolean, message: string): ValidationRule => ({
			type: 'custom',
			validator,
			message
		})
	};
}