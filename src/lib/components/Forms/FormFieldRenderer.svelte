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
	}

	let {
		field,
		formState,
		disabled = false,
		onChange,
		shouldShowError
	}: Props = $props();

	// Determine if field is conditionally required
	const isConditionallyRequired = $derived(() => {
		if (field.required) return true;
		if (field.conditionalValidation) {
			return field.conditionalValidation.some(cv =>
				FormDependencyHandler.evaluateDependency(cv.when, formState.data)
			);
		}
		return false;
	});
</script>

<div class="transition-all duration-200 {field.dependencies ? 'animate-in slide-in-from-top-2' : ''}">
	<!-- Field Label -->
	<FormInputLabel
		{field}
		showRequired={isConditionallyRequired()}
		showConditionalBadge={true}
	/>

	<!-- Field Input -->
	<FormInput
		{field}
		value={formState.data[field.name]}
		error={formState.errors[field.name]}
		showError={shouldShowError(field.name)}
		{disabled}
		{onChange}
	/>

	<!-- Field Error/Help Text -->
	<FormFieldError
		{field}
		error={formState.errors[field.name]}
		showError={shouldShowError(field.name)}
	/>
</div>