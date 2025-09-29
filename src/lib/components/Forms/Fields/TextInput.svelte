<script lang="ts">
	import type { FormField } from '$lib/types/entities/forms';
	import FormValidationIndicator from '$lib/components/Forms/FormValidationIndicator.svelte';

	interface Props {
		field: FormField;
		value: string;
		error?: string;
		showError?: boolean;
		disabled?: boolean;
		onChange: (fieldName: string, value: any) => void;
	}

	let {
		field,
		value,
		error,
		showError = false,
		disabled = false,
		onChange
	}: Props = $props();
</script>

<div class="relative">
	<input
		type="text"
		bind:value
		oninput={(e) => {
			const target = e.currentTarget;
			onChange(field.name, target.value);
		}}
		placeholder={field.placeholder}
		{disabled}
		minlength={field.minLength}
		maxlength={field.maxLength}
		pattern={field.pattern}
		class="w-full px-3 py-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors {showError ? 'border-red-300 bg-red-50' : 'border-slate-300'}"
	/>
	<FormValidationIndicator
		hasValue={!!value}
		hasError={!!error}
		{showError}
	/>
</div>