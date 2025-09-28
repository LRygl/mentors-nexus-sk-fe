import type { FormField, FormFieldDependency } from '$lib/types/entities/forms';

export class FormDependencyHandler {
	/**
	 * Check if a field should be visible based on its dependencies
	 */
	static isFieldVisible(field: FormField, formData: Record<string, any>): boolean {
		if (!field.dependencies || field.dependencies.length === 0) {
			return true;
		}

		// All dependencies must be satisfied (AND logic)
		return field.dependencies.every(dep =>
			this.evaluateDependency(dep, formData)
		);
	}

	/**
	 * Get conditional validation rules for a field
	 */
	static getConditionalValidationRules(field: FormField, formData: Record<string, any>): any[] {
		const baseRules = field.validationRules || [];

		if (!field.conditionalValidation) {
			return baseRules;
		}

		const conditionalRules: any[] = [];

		field.conditionalValidation.forEach(conditional => {
			if (this.evaluateDependency(conditional.when, formData)) {
				conditionalRules.push(...conditional.rules);
			}
		});

		return [...baseRules, ...conditionalRules];
	}

	/**
	 * Evaluate a dependency condition
	 */
	private static evaluateDependency(dependency: FormFieldDependency, formData: Record<string, any>): boolean {
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
			default:
				return true;
		}
	}
}