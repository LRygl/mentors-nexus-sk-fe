<script lang="ts">
	import { FormValidator } from '$lib/utils/formValidator';
	import type {
		FormCallbacks,
		FormField,
		FormSchema,
		FormState,
		FormValidationResult
	} from '$lib/types/entities/forms';
	import { onMount } from 'svelte';
	import { FormDependencyHandler } from '$lib/components/Forms/FormDependencyHandler';
	import FormGroupRenderer from '$lib/components/Forms/FormGroupRenderer.svelte';
	import FormFieldRenderer from '$lib/components/Forms/FormFieldRenderer.svelte';

	// Props
	interface Props<T extends Record<string, any> = Record<string, any>> {
		schema: FormSchema<T>;
		initialData?: Partial<T>;
		callbacks?: FormCallbacks<T>;
		className?: string;
		disabled?: boolean;
	}

	let {
		schema,
		initialData = {},
		callbacks = {},
		className = '',
		disabled = false
	}: Props = $props();

	// Get all Fields from schema (either from groups or direct Fields)
	const allFields = $derived(() => {
		if (schema.groups) {
			return schema.groups.flatMap(group => group.fields);
		}
		return schema.fields || [];
	});

	// Add this derived value to check field visibility
	const visibleFields = $derived(() => {
		const fields = allFields();
		return fields.filter(field =>
			FormDependencyHandler.isFieldVisible(field, formState.data)
		);
	});

	// Form state
	let formState = $state<FormState>({
		data: {} as any,
		errors: {},
		touched: {},
		isValid: false,
		isDirty: false,
		loading: false,
		isSubmitting: false,
		submitCount: 0
	});

	// Helper function to check if we should show error for a field
	// This is the KEY fix - only show errors after field is touched OR form submitted
	function shouldShowError(fieldName: string): boolean {
		return !!(
			formState.errors[fieldName] &&
			(formState.touched[fieldName] || formState.submitCount > 0)
		);
	}

	// Initialize form data
	onMount(() => {
		const defaultData: Record<string, any> = {};
		const fields = allFields();
		fields.forEach(field => {
			const initialValue = initialData[field.name] ?? field.defaultValue;
			defaultData[field.name] = getDefaultValueForField(field, initialValue);
		});

		formState.data = defaultData;
		validateForm();
	});

	// Helper function to check if field should be rendered
	function shouldRenderField(field: FormField): boolean {
		return FormDependencyHandler.isFieldVisible(field, formState.data);
	}

	// Get appropriate default value for field type
	function getDefaultValueForField(field: FormField, providedDefault?: any): any {
		if (providedDefault !== undefined) {
			return providedDefault;
		}

		switch (field.type) {
			case 'text':
			case 'textarea':
			case 'color':
			case 'icon-selector':
				return '';
			case 'number':
				return field.min ?? 0;
			case 'checkbox':
				return false;
			case 'select':
				return field.options?.[0]?.value ?? '';
			default:
				return '';
		}
	}

	// Validation
	// Enhanced validateForm function
	function validateForm(): FormValidationResult {
		const fields = allFields();
		const errors: Record<string, string> = {};

		fields.forEach(field => {
			// Skip validation for invisible Fields
			if (!FormDependencyHandler.isFieldVisible(field, formState.data)) {
				return;
			}

			// Get current validation rules
			const currentRules = FormDependencyHandler.getConditionalValidationRules(field, formState.data);
			const fieldWithCurrentRules = { ...field, validationRules: currentRules };

			const error = FormValidator.validateField(
				formState.data[field.name],
				fieldWithCurrentRules,
				formState.data
			);

			if (error) {
				errors[field.name] = error;
			}
		});

		formState.errors = errors;
		formState.isValid = Object.keys(errors).length === 0;

		const result = { isValid: formState.isValid, errors };
		callbacks.onValidate?.(result);
		return result;
	}

	function validateField(fieldName: string) {
		const fields = allFields();
		const field = fields.find(f => f.name === fieldName);
		if (!field) return;

		// Skip validation if field is not visible
		if (!FormDependencyHandler.isFieldVisible(field, formState.data)) {
			delete formState.errors[fieldName];
			return;
		}

		// Get current validation rules (including conditional ones)
		const currentRules = FormDependencyHandler.getConditionalValidationRules(field, formState.data);

		// Create a temporary field with current rules for validation
		const fieldWithCurrentRules = { ...field, validationRules: currentRules };

		const error = FormValidator.validateField(
			formState.data[fieldName],
			fieldWithCurrentRules,
			formState.data
		);

		if (error) {
			formState.errors[fieldName] = error;
		} else {
			delete formState.errors[fieldName];
		}

		formState.isValid = Object.values(formState.errors).every(err => !err);
	}


	// Handle field changes
	function handleFieldChange(fieldName: string, value: any) {
		formState.data[fieldName] = value;
		formState.touched[fieldName] = true;
		formState.isDirty = true;

		// Validate the changed field
		validateField(fieldName);

		// Re-validate all Fields that might depend on this field
		const fields = allFields();
		fields.forEach(field => {
			if (field.dependencies?.some(dep => dep.field === fieldName)) {
				validateField(field.name);
			}
		});

		callbacks.onChange?.(fieldName, value, formState);
	}

	// Handle form submission
	function handleSubmit(event: Event) {
		event.preventDefault();
		const fields = allFields();

		formState.submitCount++;

		// Mark all Fields as touched
		fields.forEach(field => {
			if (shouldRenderField(field)) {
				formState.touched[field.name] = true;
			}
		});

		const validationResult = validateForm();
		if (validationResult.isValid) {
			callbacks.onSubmit?.(formState.data);
		}
	}

	// Export functions for parent component
	export function getFormData() {
		return formState.data;
	}

	export function validateFormExternal(): boolean {
		const result = validateForm();
		return result.isValid;
	}

	export function reset(newData?: Partial<any>) {
		if (newData) {
			formState.data = { ...formState.data, ...newData };
		}
		formState.errors = {};
		formState.touched = {};
		formState.isDirty = false;
		formState.submitCount = 0; // Reset submit count
		validateForm();
	}

	// Field component getters
	function getFieldIconName(fieldType: string):string {
		switch (fieldType) {
			case 'text': return 'PencilLine';
			case 'textarea': return 'PencilLine';
			case 'number': return 'Hash';
			default: return 'Type';
		}
	}

	// Handle custom component changes
	function createCustomChangeHandler(fieldName: string) {
		return (value: unknown) => handleFieldChange(fieldName, value);
	}

</script>

<form onsubmit={handleSubmit} class="space-y-6 {className}">
	<!-- Form Header -->
	{#if schema.title || schema.description}
		<div class="mb-6">
			{#if schema.title}
				<h2 class="text-lg font-semibold text-slate-900 mb-2">{schema.title}</h2>
			{/if}
			{#if schema.description}
				<p class="text-sm text-slate-600">{schema.description}</p>
			{/if}
		</div>
	{/if}

	<!-- Render Grouped Fields -->
	{#if schema.groups}
		{#each schema.groups as group}
			<FormGroupRenderer
				{group}
				{formState}
				layout={schema.layout}
				{disabled}
				onChange={handleFieldChange}
				{shouldRenderField}
				{shouldShowError}
			/>
		{/each}
	{:else if schema.fields}
		<!-- Render Direct Fields (No Groups) -->
		<div class="grid grid-cols-1 {schema.layout === 'two-column' ? 'lg:grid-cols-2' : ''} gap-4">
			{#each schema.fields as field}
				{#if shouldRenderField(field)}
					<div class="space-y-2 {field.colSpan === 2 ? 'lg:col-span-2' : ''} {field.className || ''}">
						<FormFieldRenderer
							{field}
							{formState}
							{disabled}
							onChange={handleFieldChange}
							{shouldShowError}
						/>
					</div>
				{/if}
			{/each}
		</div>
	{/if}
</form>
