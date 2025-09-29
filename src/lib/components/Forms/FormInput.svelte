<script lang="ts">
	import type { FormField } from '$lib/types/entities/forms';

	import TextInput from '$lib/components/Forms/Fields/TextInput.svelte';
	import TextareaInput from '$lib/components/Forms/Fields/TextareaInput.svelte';

	interface Props {
		field: FormField;
		value: any;
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

<!-- Route to the appropriate input component based on field type -->
{#if field.type === 'text'}
	<TextInput {field} {value} {error} {showError} {disabled} {onChange} />
{:else if field.type === 'textarea'}
	<TextareaInput {field} {value} {error} {showError} {disabled} {onChange} />
{:else}
	<div class="text-sm text-red-600 border border-red-500 bg-red-50 p-2 rounded">
		Unknown field type: {field.type}
	</div>
{/if}