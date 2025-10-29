<script lang="ts">
	import { AlertCircle, Check, ChevronDown, Eye, EyeOff, FileText, Hash, Type, PencilLine } from 'lucide-svelte';
	import { FormValidator } from '$lib/utils/formValidator';
	import type {
		FormCallbacks,
		FormField,
		FormSchema,
		FormState,
		FormValidationResult
	} from '$lib/types/entities/forms';
	import { onMount } from 'svelte';
	import IconSelector from '$lib/components/UI/IconSelector.svelte';
	import ImageUpload from '$lib/components/ui/ImageUpload.svelte';
	import DynamicIcon from '$lib/components/UI/DynamicIcon.svelte';
	import { FormDependencyHandler } from '$lib/components/Forms/FormDependencyHandler';

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

	// Get all fields from schema (either from groups or direct fields)
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
		isDirty: false
	});

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
			case 'image-upload':
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

		// Re-validate all fields that might depend on this field
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

		// Mark all fields as touched
		fields.forEach(field => {
			formState.touched[field.name] = true;
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

	<!-- Render grouped fields -->
	{#if schema.groups}
		{#each schema.groups as group}
			<div class="space-y-4 {group.className || ''}">
				{#if group.title || group.description}
					<div>
						{#if group.title}
							<h3 class="text-md font-medium text-slate-800 mb-1">{group.title}</h3>
						{/if}
						{#if group.description}
							<p class="text-sm text-slate-600">{group.description}</p>
						{/if}
					</div>
				{/if}

				<div class="grid grid-cols-1 {schema.layout === 'two-column' ? 'lg:grid-cols-2' : ''} gap-4">
					{#each group.fields as field}
						<!-- Only render field if it should be visible based on dependencies -->
						{#if shouldRenderField(field)}
							<div class="space-y-2 {field.colSpan === 2 ? 'lg:col-span-2' : ''} {field.className || ''}">
								{@render fieldRenderer(field)}
							</div>
						{/if}
					{/each}
				</div>
			</div>
		{/each}
	{:else if schema.fields}
		<!-- Render direct fields -->
		<div class="grid grid-cols-1 {schema.layout === 'two-column' ? 'lg:grid-cols-2' : ''} gap-4">
			{#each schema.fields as field}
				{#if shouldRenderField(field)}
					<div class="space-y-2 {field.colSpan === 2 ? 'lg:col-span-2' : ''} {field.className || ''}">
						{@render fieldRenderer(field)}
					</div>
				{/if}
			{/each}
		</div>
	{/if}
</form>

<!-- Add visual feedback for conditional fields -->
{#snippet fieldRenderer(field: FormField)}
	<!-- Add conditional styling for dependent fields -->
	<div class="transition-all duration-200 {field.dependencies ? 'animate-in slide-in-from-top-2' : ''}">
		<!-- Field Label -->
		{#if field.type !== 'checkbox'}
			<label class="flex items-center gap-2 text-sm font-medium text-slate-700">
				<DynamicIcon iconName={getFieldIconName(field.type)} class="w-4 h-4" size={16} />
				{field.label}
				{#if field.required || (field.conditionalValidation && field.conditionalValidation.some(cv => FormDependencyHandler.evaluateDependency(cv.when, formState.data)))}
					<span class="text-red-500">*</span>
				{/if}
				<!-- Add dependency indicator -->
				{#if field.dependencies}
					<span class="text-xs text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">conditional</span>
				{/if}
			</label>
		{/if}

		<!-- Field Input -->
		{#if field.type === 'text'}
			<div class="relative">
				<input
					type="text"
					bind:value={formState.data[field.name]}
					oninput={(e) => {
						const target = e.currentTarget;
						handleFieldChange(field.name, target.value);
					}}
					placeholder={field.placeholder}
					disabled={disabled}
					min={field.min}
					max={field.max}
					class="w-full px-3 py-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors {formState.errors[field.name] ? 'border-red-300 bg-red-50' : 'border-slate-300'}"
				/>
				{#if formState.data[field.name] && !formState.errors[field.name]}
					<Check class="absolute right-3 top-2.5 w-4 h-4 text-green-500" />
				{/if}
				{#if formState.errors[field.name]}
					<AlertCircle class="absolute right-3 top-2.5 w-4 h-4 text-red-500" />
				{/if}
			</div>

		{:else if field.type === 'textarea'}
			<textarea
				bind:value={formState.data[field.name]}
				oninput={(e) => {
					const target = e.currentTarget;
					handleFieldChange(field.name, target.value);
				}}
				placeholder={field.placeholder}
				disabled={disabled}
				rows={field.rows || 3}
				class="w-full px-3 py-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors resize-none {formState.errors[field.name] ? 'border-red-300 bg-red-50' : 'border-slate-300'}"
			></textarea>

		{:else if field.type === 'number'}
			<input
				type="number"
				bind:value={formState.data[field.name]}
				oninput={(e) => {
					const target = e.currentTarget;
					handleFieldChange(field.name, parseInt(target.value) || field.min || 0);
				}}
				placeholder={field.placeholder}
				disabled={disabled}
				min={field.min}
				max={field.max}
				class="w-full px-3 py-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors {formState.errors[field.name] ? 'border-red-300 bg-red-50' : 'border-slate-300'}"
			/>

		{:else if field.type === 'color'}
			<div class="flex gap-2">
				<input
					type="color"
					bind:value={formState.data[field.name]}
					onchange={(e) => {
						const target = e.currentTarget;
						handleFieldChange(field.name, target.value);
					}}
					disabled={disabled}
					class="w-10 h-10 rounded border border-slate-300 cursor-pointer"
				/>
				<input
					type="text"
					bind:value={formState.data[field.name]}
					oninput={(e) => {
						const target = e.currentTarget;
						handleFieldChange(field.name, target.value);
					}}
					placeholder={field.placeholder || '#3B82F6'}
					disabled={disabled}
					class="flex-1 px-3 py-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors {formState.errors[field.name] ? 'border-red-300 bg-red-50' : 'border-slate-300'}"
				/>
			</div>

		{:else if field.type === 'select'}
			<div class="relative">
				<select
					bind:value={formState.data[field.name]}
					onchange={(e) => {
					const target = e.currentTarget;
					handleFieldChange(field.name, target.value);
				}}
					disabled={disabled}
					class="w-full px-3 py-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors appearance-none {formState.errors[field.name] ? 'border-red-300 bg-red-50' : 'border-slate-300'}"
				>
					{#each field.options || [] as option}
						<option
							value={option.value}
							disabled={option.value === '' && field.placeholder}
							selected={formState.data[field.name] === option.value}
						>
							{option.label}
						</option>
					{/each}
				</select>
				<ChevronDown class="absolute right-3 top-2.5 w-4 h-4 text-slate-400 pointer-events-none" />

				<!-- Success indicator -->
				{#if formState.data[field.name] && !formState.errors[field.name]}
					<Check class="absolute right-8 top-2.5 w-4 h-4 text-green-500" />
				{/if}
				{#if formState.errors[field.name]}
					<AlertCircle class="absolute right-8 top-2.5 w-4 h-4 text-red-500" />
				{/if}
		</div>

	{:else if field.type === 'checkbox'}
		<div class="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
			<div class="flex items-center gap-3">
				{#if formState.data[field.name]}
					<Eye class="w-4 h-4 text-slate-600" />
				{:else}
					<EyeOff class="w-4 h-4 text-slate-400" />
				{/if}
				<div>
					<span class="text-sm font-medium text-slate-800">{field.label}</span>
					{#if field.helpText}
						<p class="text-xs text-slate-500">{field.helpText}</p>
					{/if}
				</div>
			</div>
			<input
				type="checkbox"
				bind:checked={formState.data[field.name]}
				onchange={(e) => {
          const target = e.currentTarget;
          handleFieldChange(field.name, target.checked);
        }}
				disabled={disabled}
				class="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
			/>
		</div>

	{:else if field.type === 'icon-selector'}
		<IconSelector
			selectedIcon={formState.data[field.name]}
			onselect={(iconName) => handleFieldChange(field.name, iconName)}
			label={field.label}
			placeholder={field.placeholder}
			previewColor={field.previewColor}
			required={field.required}
		/>

	{:else if field.type === 'image-upload'}
		<ImageUpload
			field={field}
			value={formState.data[field.name]}
			error={formState.errors[field.name]}
			showError={!!formState.errors[field.name] && formState.touched[field.name]}
			disabled={disabled}
			onChange={handleFieldChange}
		/>

	{:else if field.type === 'custom' && field.component}
		{#if field.component}
			{@const Component = field.component}
			<Component
				bind:value={formState.data[field.name]}
				onchange={createCustomChangeHandler(field.name)}
				{disabled}
				{...(field.componentProps || {})}
			/>
		{/if}
	{/if}

		<!-- Field Error/Help Text with enhanced messaging for conditional fields -->
		{#if formState.errors[field.name] && formState.touched[field.name]}
			<p class="text-xs text-red-600">{formState.errors[field.name]}</p>
		{:else if field.helpText}
			<p class="text-xs text-slate-500">
				{field.helpText}
				{#if field.dependencies}
					<span class="text-amber-600">
						• Shown when {field.dependencies[0].field} is {field.dependencies[0].condition === 'truthy' ? 'enabled' : 'disabled'}
					</span>
				{/if}
			</p>
		{/if}
	</div>
{/snippet}