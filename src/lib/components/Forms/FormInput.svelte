<script lang="ts">
	import type { FormField } from '$lib/types/entities/forms';

	import TextInput from '$lib/components/Forms/Fields/TextInput.svelte';
	import TextareaInput from '$lib/components/Forms/Fields/TextareaInput.svelte';
	import CheckboxInput from '$lib/components/Forms/Fields/CheckboxInput.svelte';
	import IconSelectInput from '$lib/components/Forms/Fields/IconSelectInput.svelte';
	import NumberInput from '$lib/components/Forms/Fields/NumberInput.svelte';
	import ColorInput from '$lib/components/Forms/Fields/ColorInput.svelte';
	import SelectInput from '$lib/components/Forms/Fields/SelectInput.svelte';
	import DateInput from '$lib/components/Forms/Fields/DateInput.svelte';
	import DateTImeInput from '$lib/components/Forms/Fields/DateTImeInput.svelte';

	interface Props {
		field: FormField;
		value: any;
		error?: string;
		showError?: boolean;
		checked?: boolean;
		disabled?: boolean;
		onChange: (fieldName: string, value: any) => void;
	}

	let {
		field,
		value,
		error,
		checked = false,
		showError = false,
		disabled = false,
		onChange
	}: Props = $props();
</script>

<!-- Route to the appropriate input component based on field type -->
{#if field.type === 'text'}
	<TextInput {field} {value} {error} {showError} {disabled} {onChange} />
{:else if field.type === 'number'}
	<NumberInput {field} {value} {error} {showError} {disabled} {onChange} />
{:else if field.type === 'textarea'}
	<TextareaInput {field} {value} {error} {showError} {disabled} {onChange} />
{:else if field.type === 'date'}
	<DateInput {field} {value} {error} {showError} {disabled} {onChange} />
{:else if field.type === 'datetime-local'}
	<DateTImeInput {field} {value} {error} {showError} {disabled} {onChange} />
{:else if field.type === 'select'}
	<SelectInput {field} {value} {error} {showError} {disabled} {onChange} />
{:else if field.type === 'checkbox'}
	<CheckboxInput {field} {checked} {disabled} {onChange} />
{:else if field.type === 'icon-selector'}
	<IconSelectInput {field} {value} {error} {showError} {disabled} {onChange} />
{:else if field.type === 'color'}
	<ColorInput {field} {value} {error} {showError} {disabled} {onChange} />
{:else}
	<div class="text-sm text-red-600 border border-red-500 bg-red-50 p-2 rounded">
		Unknown field type: {field.type}
	</div>
{/if}