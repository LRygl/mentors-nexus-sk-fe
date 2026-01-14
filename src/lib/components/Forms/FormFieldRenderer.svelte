<script lang="ts">
	import { FormDependencyHandler } from '$lib/components/Forms/FormDependencyHandler';
	import type { FormField, FormState } from '$lib/types/entities/forms';
	import FormInputLabel from '$lib/components/Forms/FormInputLabel.svelte';
	import FormFieldError from '$lib/components/Forms/FormFieldError.svelte';
	import FormInput from '$lib/components/Forms/FormInput.svelte';

	interface Props {
		field: FormField;
		formState: FormState;
		disabled?: boolean;
		onChange: (fieldName: string, value: any) => void;
		shouldShowError: (fieldName: string) => boolean;
		imageBaseUrl: string;
	}

	let {
		field,
		formState,
		disabled = false,
		onChange,
		shouldShowError,
		imageBaseUrl,
	}: Props = $props();

	// Cache field data reference for better performance
	const fieldValue = $derived(formState.data[field.name]);
	const fieldError = $derived(formState.errors[field.name]);
	const showError = $derived(shouldShowError(field.name));

	/**
	 * Determine if field is required (either always or conditionally)
	 * Memoized to avoid recalculation on every render
	 */
	const isRequired = $derived.by(() => {
		// If field is always required, return true immediately
		if (field.required) return true;

		// Fast path: no conditional validation
		if (!field.conditionalValidation?.length) return false;

		// Check conditional requirements
		return field.conditionalValidation.some(cv =>
			FormDependencyHandler.evaluateDependency(cv.when, formState.data)
		);
	});

	/**
	 * Check if field has conditional dependencies for badge display
	 */
	const hasConditionalRules = $derived(
		!!field.conditionalValidation?.length
	);

	/**
	 * Animation classes for fields with dependencies
	 * Only apply animation to conditionally visible fields
	 */
	const animationClasses = $derived(
		field.dependencies?.length
			? 'animate-in slide-in-from-top-2 duration-200'
			: ''
	);
</script>

<div class="space-y-1.5 transition-all {animationClasses}">
	<!-- Field Label -->
	<FormInputLabel
		{field}
		showRequired={isRequired}
		showConditionalBadge={hasConditionalRules}
	/>

	<!-- Field Input -->
	<FormInput
		{field}
		value={fieldValue}
		error={fieldError}
		{showError}
		checked={fieldValue}
		{disabled}
		{onChange}
		{imageBaseUrl}
	/>

	<!-- Field Error/Help Text -->
	<FormFieldError
		{field}
		error={formState.errors[field.name]}
		showError={shouldShowError(field.name)}
	/>
</div>