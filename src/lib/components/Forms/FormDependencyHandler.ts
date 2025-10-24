import type { FormField, FormFieldDependency, ValidationRule } from '$lib/types/entities/forms';

/**
 * FormDependencyHandler
 *
 * Handles field visibility and conditional validation rules based on dependencies.
 * This is a pure utility class with no side effects - all methods are static.
 *
 * Key Concepts:
 * - Field Visibility: Determines if a field should be shown based on other field values
 * - Conditional Validation: Adds validation rules when certain conditions are met
 * - Dependency Evaluation: Checks if a dependency condition is satisfied
 *
 * Example Usage:
 * ```typescript
 * // Check if a field should be visible
 * const isVisible = FormDependencyHandler.isFieldVisible(field, formData);
 *
 * // Get all validation rules (base + conditional)
 * const rules = FormDependencyHandler.getConditionalValidationRules(field, formData);
 * ```
 */
export class FormDependencyHandler {
	/**
	 * Check if a field should be visible based on its dependencies
	 *
	 * @param field - The field to check
	 * @param formData - Current form data
	 * @returns true if field should be visible, false otherwise
	 *
	 * Logic:
	 * - If no dependencies exist, field is always visible
	 * - ALL dependencies must be satisfied (AND logic)
	 * - This ensures strict control over field visibility
	 */
	static isFieldVisible(field: FormField, formData: Record<string, any>): boolean {
		// No dependencies = always visible
		if (!field.dependencies || field.dependencies.length === 0) {
			return true;
		}

		// All dependencies must be satisfied (AND logic)
		return field.dependencies.every(dep =>
			this.evaluateDependency(dep, formData)
		);
	}

	/**
	 * Get all validation rules for a field (base + conditional)
	 *
	 * @param field - The field to get rules for
	 * @param formData - Current form data
	 * @returns Combined array of base and conditional validation rules
	 *
	 * Process:
	 * 1. Start with base validation rules (always apply)
	 * 2. Evaluate each conditional validation
	 * 3. Add rules when their conditions are met
	 * 4. Return combined array
	 */
	static getConditionalValidationRules(
		field: FormField,
		formData: Record<string, any>
	): ValidationRule[] {
		const baseRules = field.validationRules || [];

		// If no conditional validation, return base rules only
		if (!field.conditionalValidation || field.conditionalValidation.length === 0) {
			return baseRules;
		}

		// Collect all applicable conditional rules
		const conditionalRules: ValidationRule[] = [];

		for (const conditional of field.conditionalValidation) {
			// Only add rules if the condition is met
			if (this.evaluateDependency(conditional.when, formData)) {
				conditionalRules.push(...conditional.rules);
			}
		}

		// Return combined array (base rules + applicable conditional rules)
		return [...baseRules, ...conditionalRules];
	}

	/**
	 * Evaluate a single dependency condition
	 *
	 * @param dependency - The dependency to evaluate
	 * @param formData - Current form data
	 * @returns true if dependency condition is satisfied
	 *
	 * Supported Conditions:
	 * - equals: Field value exactly matches dependency value
	 * - not-equals: Field value does not match dependency value
	 * - truthy: Field value is truthy (!!value)
	 * - falsy: Field value is falsy (!value)
	 * - in: Field value is in the provided array of values
	 * - not-in: Field value is not in the provided array of values
	 * - greater-than: Field value is greater than dependency value
	 * - less-than: Field value is less than dependency value
	 */
	static evaluateDependency(
		dependency: FormFieldDependency,
		formData: Record<string, any>
	): boolean {
		// Get the value of the field this dependency is watching
		const fieldValue = formData[dependency.field];

		switch (dependency.condition) {
			case 'equals':
				return fieldValue === dependency.value;

			case 'not-equals':
				return fieldValue !== dependency.value;

			case 'truthy':
				return !!fieldValue;

			case 'falsy':
				return !fieldValue;

			case 'in':
				// Check if field value is in the array of allowed values
				if (!dependency.values || !Array.isArray(dependency.values)) {
					console.warn(
						`[FormDependencyHandler] 'in' condition requires 'values' array for field: ${dependency.field}`
					);
					return false;
				}
				return dependency.values.includes(fieldValue);

			case 'not-in':
				// Check if field value is NOT in the array of disallowed values
				if (!dependency.values || !Array.isArray(dependency.values)) {
					console.warn(
						`[FormDependencyHandler] 'not-in' condition requires 'values' array for field: ${dependency.field}`
					);
					return false;
				}
				return !dependency.values.includes(fieldValue);

			case 'greater-than':
				// Numeric comparison - ensure both values are numbers
				if (dependency.value === undefined) {
					console.warn(
						`[FormDependencyHandler] 'greater-than' condition requires 'value' for field: ${dependency.field}`
					);
					return false;
				}
				return Number(fieldValue) > Number(dependency.value);

			case 'less-than':
				// Numeric comparison - ensure both values are numbers
				if (dependency.value === undefined) {
					console.warn(
						`[FormDependencyHandler] 'less-than' condition requires 'value' for field: ${dependency.field}`
					);
					return false;
				}
				return Number(fieldValue) < Number(dependency.value);

			default:
				// Unknown condition - log warning and return true to avoid hiding fields
				console.warn(
					`[FormDependencyHandler] Unknown dependency condition: ${dependency.condition}`
				);
				return true;
		}
	}

	/**
	 * Get all fields that depend on a given field
	 * Useful for determining which fields need re-validation when a field changes
	 *
	 * @param fieldName - The field to find dependents for
	 * @param allFields - All fields in the form
	 * @returns Array of fields that depend on the given field
	 */
	static getDependentFields(
		fieldName: string,
		allFields: FormField[]
	): FormField[] {
		return allFields.filter(field =>
			field.dependencies?.some(dep => dep.field === fieldName) ||
			field.conditionalValidation?.some(cv => cv.when.field === fieldName)
		);
	}

	/**
	 * Check if a field has any dependencies (visibility or validation)
	 *
	 * @param field - The field to check
	 * @returns true if field has any dependencies
	 */
	static hasDependencies(field: FormField): boolean {
		return (
			(field.dependencies && field.dependencies.length > 0) ||
			(field.conditionalValidation && field.conditionalValidation.length > 0)
		);
	}
}