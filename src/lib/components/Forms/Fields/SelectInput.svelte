<script lang="ts">
	import type { FormField } from '$lib/types/entities/forms';
	import FormValidationIndicator from '$lib/components/Forms/FormValidationIndicator.svelte';
	import { ChevronDown } from 'lucide-svelte';

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
	<select
		value={value}
	onchange={(e) => {
	const target = e.currentTarget;
	onChange(field.name, target.value);
}}
	{disabled}
	class="w-full px-3 py-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors appearance-none {showError ? 'border-red-300 bg-red-50' : 'border-slate-300'}"
	>
	{#each field.options || [] as option}
		<option
			value={option.value}
			disabled={option.disabled}
		>
		{option.label}
		</option>
	{/each}
	</select>

	<ChevronDown class="absolute right-3 top-2.5 w-4 h-4 text-slate-400 pointer-events-none" />

	<FormValidationIndicator
		hasValue={!!value}
		hasError={!!error}
		{showError}
	/>
</div>