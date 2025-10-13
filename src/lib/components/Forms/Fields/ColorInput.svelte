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
	<div class="flex gap-2">
		<input
			type="color"
			bind:value
			onchange={(e) => {
        const target = e.currentTarget;
        onChange(field.name, target.value);
      }}
			{disabled}
			class="w-10 h-10 rounded border border-slate-300 cursor-pointer"
		/>
		<input
			type="text"
			bind:value
			oninput={(e) => {
        const target = e.currentTarget;
        onChange(field.name, target.value);
      }}
			placeholder={field.placeholder || '#3B82F6'}
			{disabled}
			class="flex-1 px-3 py-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors {showError ? 'border-red-300 bg-red-50' : 'border-slate-300'}"
		/>
	</div>
	<FormValidationIndicator
		hasValue={!!value}
		hasError={!!error}
		{showError}
	/>
</div>