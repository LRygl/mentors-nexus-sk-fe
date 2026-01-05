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
	import { prepareEntityDataForSubmit } from '$lib/utils/ImageUtils';

	// Props
	interface Props<T extends Record<string, any> = Record<string, any>> {
		schema: FormSchema<T>;
		initialData?: Partial<T>;
		callbacks?: FormCallbacks<T>;
		className?: string;
		disabled?: boolean;
		showValidationSummary?: boolean;
		mode?: 'standard' | 'embedded'; // embedded = inline editing with change tracking
		onDirtyChange?: (isDirty: boolean) => void; // Callback when dirty state changes
		imageBaseUrl?: string;
		extractImageFile?: boolean;
	}

	let {
		schema,
		initialData = {},
		callbacks = {},
		className = '',
		disabled = false,
		showValidationSummary = true,
		mode = 'standard',
		onDirtyChange,
		imageBaseUrl,
		extractImageFile = true,
	}: Props = $props();

	// Form element reference for external access
	let formElement = $state<HTMLFormElement>();

	// Store original data for change detection (embedded mode)
	let originalData = $state<Record<string, any>>({});

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

	// Check if form has unsaved changes (embedded mode only)
	const hasChanges = $derived(() => {
		if (mode !== 'embedded') return false;
		const currentData = JSON.stringify(formState.data);
		const original = JSON.stringify(originalData);
		const isDifferent = currentData !== original;
		return isDifferent;
	});

	// Update isDirty when hasChanges updates (embedded mode)
	$effect(() => {
		if (mode === 'embedded') {
			const dirty = hasChanges();
			if (formState.isDirty !== dirty) {
				formState.isDirty = dirty;
				onDirtyChange?.(dirty);
			}
		}
	});

	// Watch validation state and trigger callback when it changes
	$effect(() => {
		const isValid = formState.isValid;
		const errors = formState.errors;

		// Trigger validation callback whenever validation state changes
		callbacks.onValidate?.({ isValid, errors });
	});

	// Helper function to check if we should show error for a field
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

		// Store original data for embedded mode
		if (mode === 'embedded') {
			originalData = JSON.parse(JSON.stringify(defaultData));
		}
		validateForm();
		// Don't validate on mount - form starts as valid
		// Validation will happen when user interacts with fields
		//formState.isValid = true;
		//formState.errors = {};
	});

	// Helper to check if field should be rendered
	const visibleFieldNames = $derived.by(() => {
		const fields = allFields();
		const visible = new Set<string>();

		fields.forEach(field => {
			if (FormDependencyHandler.isFieldVisible(field, formState.data)) {
				visible.add(field.name);
			}
		});

		return Array.from(visible);
	});

	function shouldRenderField(field: FormField): boolean {
		return visibleFieldNames.includes(field.name);
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
			case 'date':
			case 'datetime-local':
				return '';
			case 'number':
				return field.min ?? 0;
			case 'checkbox':
				return false;
			case 'select':
				return field.options?.[0]?.value ?? '';
			case 'tags':
				return [];
			case 'multiselect':
				return [];
			case 'image':
				return '';
			case 'stringList':
				return [];
			default:
				return '';
		}
	}

	// Validation
	function validateForm(): FormValidationResult {
		const fields = allFields();
		const errors: Record<string, string> = {};

		fields.forEach(field => {
			if (!FormDependencyHandler.isFieldVisible(field, formState.data)) {
				return;
			}

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

		// Note: Don't call callback here, let the $effect handle it to avoid double-calling
		return result;
	}

	function validateField(fieldName: string) {
		const fields = allFields();
		const field = fields.find(f => f.name === fieldName);
		if (!field) return;

		if (!FormDependencyHandler.isFieldVisible(field, formState.data)) {
			delete formState.errors[fieldName];
			formState.isValid = Object.keys(formState.errors).length === 0;
			return;
		}

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

		formState.isValid = Object.keys(formState.errors).length === 0;

	}

	function handleFieldChange(fieldName: string, value: any) {
		// Defensive parameter check
		let actualFieldName: string;
		let actualValue: any;

		if (Array.isArray(fieldName) && typeof value === 'string') {
			actualFieldName = value;
			actualValue = fieldName;
		} else {
			actualFieldName = fieldName;
			actualValue = value;
		}

		formState.data[actualFieldName] = actualValue;
		formState.touched[actualFieldName] = true;

		// Don't set isDirty here in embedded mode - let the effect handle it
		if (mode !== 'embedded') {
			formState.isDirty = true;
		}

		// Validate the changed field
		validateField(actualFieldName);

		// Re-validate dependent fields
		const fields = allFields();
		fields.forEach(field => {
			if (field.dependencies?.some(dep => dep.field === actualFieldName)) {
				validateField(field.name);
			}
		});

		callbacks.onChange?.(actualFieldName, actualValue, formState);
	}

	/**
	 * Public API - These methods can be called from parent components
	 */
	export function submit() {
		formElement?.requestSubmit();
	}

	export function reset(newData?: Partial<any>) {
		if (newData) {
			formState.data = { ...formState.data, ...newData };
			if (mode === 'embedded') {
				originalData = JSON.parse(JSON.stringify(formState.data));
			}
		}
		formState.errors = {};
		formState.touched = {};
		formState.isDirty = false;
		formState.submitCount = 0;
		validateForm();
	}

	// EMBEDDED MODE: Discard changes and revert to original
	export function discard() {
		if (mode === 'embedded') {
			formState.data = JSON.parse(JSON.stringify(originalData));
			formState.errors = {};
			formState.touched = {};
			formState.isDirty = false;
			formState.submitCount = 0;
			validateForm();
		}
	}

	// EMBEDDED MODE: Get current form data
	export function getFormData() {
		return { ...formState.data };
	}

	// EMBEDDED MODE: Get list of changed fields
	export function getChangedFields(): string[] {
		if (mode !== 'embedded') return [];
		const changed: string[] = [];
		Object.keys(formState.data).forEach(key => {
			if (JSON.stringify(formState.data[key]) !== JSON.stringify(originalData[key])) {
				changed.push(key);
			}
		});
		return changed;
	}

	// EMBEDDED MODE: Check if form is valid
	export function isFormValid(): boolean {
		return formState.isValid;
	}

	// EMBEDDED MODE: Check for unsaved changes
	export function hasUnsavedChanges(): boolean {
		return mode === 'embedded' ? hasChanges() : false;
	}

	// Handle form submission
	async function handleSubmit(event: Event) {
		event.preventDefault();

		if (formState.isSubmitting) {
			return;
		}

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
				// Extract image file if enabled
				let submitData = formState.data;
				let imageFile: File | undefined;

				if (extractImageFile) {
					const prepared = prepareEntityDataForSubmit(formState.data);
					submitData = prepared.data;
					imageFile = prepared.imageFile;

				}

				// Call onSubmit with both data and imageFile
				await callbacks.onSubmit?.(submitData, imageFile);

				// Update original data after successful submit (embedded mode)
				if (mode === 'embedded') {
					// Store the clean data (without File objects) as original
					originalData = JSON.parse(JSON.stringify(submitData));
					formState.submitCount = 0;
				}
			} catch (error) {
				console.error('[FORM] Submit error:', error);
			} finally {
				formState.isSubmitting = false;
			}
		} else {
			console.log('[FORM] Validation failed, not submitting');
		}
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

	// Adjust validation summary default based on mode
	const shouldShowSummary = $derived(
		mode === 'embedded' ? false : showValidationSummary
	);
</script>

<form bind:this={formElement} onsubmit={handleSubmit} class="space-y-6 {className}">
	<!-- Render Grouped Fields -->
	{#if schema.groups}
		{#each schema.groups as group}
			<FormGroupRenderer
				{group}
				{formState}
				layout={schema.layout}
				{disabled}
				onChange={handleFieldChange}
				visibleFields={visibleFieldNames}
				{shouldShowError}
			/>
		{/each}
	{:else if schema.fields}
		<!-- Render Direct Fields (No Groups) -->
		<div class="grid grid-cols-1 {schema.layout === 'two-column' ? 'lg:grid-cols-2' : ''} gap-4">
			{#each schema.fields as field}
				{#if visibleFieldNames.includes(field.name)}
					<div class="space-y-2 {field.colSpan === 2 ? 'lg:col-span-2' : ''} {field.className || ''}">
						<FormFieldRenderer
							{field}
							{formState}
							{disabled}
							onChange={handleFieldChange}
							{shouldShowError}
							{imageBaseUrl}
						/>
					</div>
				{/if}
			{/each}
		</div>
	{/if}

	<!-- Validation Error Summary (hidden by default in embedded mode) -->
	{#if shouldShowSummary && Object.keys(visibleValidationErrors()).length > 0}
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