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
		showValidationSummary?: boolean;
	}

	let {
		schema,
		initialData = {},
		callbacks = {},
		className = '',
		disabled = false,
		showValidationSummary = true
	}: Props = $props();

	// Form element reference for external access
	let formElement = $state<HTMLFormElement>();

	// Get all Fields from schema (either from groups or direct Fields)
	const allFields = $derived(() => {
		if (schema.groups) {
			return schema.groups.flatMap(group => group.fields);
		}
		return schema.fields || [];
	});

	// Form state
	let formState = $state<FormState>({
		data: {} as any,
		errors: {},
		touched: {},
		isValid: false,
		isDirty: false,
		loading: {},
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
	function validateForm(): FormValidationResult {
		const fields = allFields();
		const errors: Record<string, string> = {};

		fields.forEach(field => {
			// Skip validation for invisible fields
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

		// Re-validate all fields that might depend on this field
		const fields = allFields();
		fields.forEach(field => {
			if (field.dependencies?.some(dep => dep.field === fieldName)) {
				validateField(field.name);
			}
		});

		callbacks.onChange?.(fieldName, value, formState);
	}

	export function submit() {
		formElement?.requestSubmit();
	}

	// Handle form submission
	async function handleSubmit(event: Event) {
		event.preventDefault();

		// Prevent double submission
		if (formState.isSubmitting) return;

		const fields = allFields();
		formState.submitCount++;

		// Mark all visible fields as touched
		fields.forEach(field => {
			if (shouldRenderField(field)) {
				formState.touched[field.name] = true;
			}
		});

		// Validate before submitting
		const validationResult = validateForm();
		if (validationResult.isValid) {
			formState.isSubmitting = true;
			try {
				await callbacks.onSubmit?.(formState.data);
			} finally {
				formState.isSubmitting = false;
			}
		}
	}

	export function reset(newData?: Partial<any>) {
		if (newData) {
			formState.data = { ...formState.data, ...newData };
		}
		formState.errors = {};
		formState.touched = {};
		formState.isDirty = false;
		formState.submitCount = 0; // Reset submit count
		validateForm(); //Remove?
	}

	// Helper to get field label for error display
	function getFieldLabel(fieldName: string): string {
		const fields = allFields();
		const field = fields.find(f => f.name === fieldName);
		return field?.label || fieldName;
	}

	// Scroll to field with error
	function scrollToField(fieldName: string) {
		const fieldElement = formElement?.querySelector(`[name="${fieldName}"]`);
		if (fieldElement) {
			fieldElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
			if (fieldElement instanceof HTMLElement) {
				fieldElement.focus();
			}
		}
	}

	// Get validation errors that should be shown
	const visibleValidationErrors = $derived(() => {
		if (!showValidationSummary || formState.submitCount === 0) return {};
		return formState.errors;
	});

</script>

<form bind:this={formElement}  onsubmit={handleSubmit} class="space-y-6 {className}">

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


	<!-- Validation Error Summary -->
	{#if showValidationSummary && Object.keys(visibleValidationErrors()).length > 0}
		<div class="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
			<div class="flex items-start gap-2">
				<div class="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<circle cx="12" cy="12" r="10"></circle>
						<line x1="12" y1="8" x2="12" y2="12"></line>
						<line x1="12" y1="16" x2="12.01" y2="16"></line>
					</svg>
				</div>
				<div class="flex-1">
					<h4 class="text-sm font-semibold text-red-900 mb-2">
						Please fix the following errors:
					</h4>
					<ul class="space-y-1">
						{#each Object.entries(visibleValidationErrors()) as [fieldName, error]}
							<li class="text-sm text-red-700">
								<button
									type="button"
									onclick={() => scrollToField(fieldName)}
									class="hover:underline text-left"
								>
									<strong>{getFieldLabel(fieldName)}:</strong> {error}
								</button>
							</li>
						{/each}
					</ul>
				</div>
			</div>
		</div>
	{/if}
</form>
