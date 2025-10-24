<script lang="ts">
	import type { FormField } from '$lib/types/entities/forms';
	import type { Component, ComponentType } from 'svelte';

	// Import all field components
	import TextInput from '$lib/components/Forms/Fields/TextInput.svelte';
	import TextareaInput from '$lib/components/Forms/Fields/TextareaInput.svelte';
	import CheckboxInput from '$lib/components/Forms/Fields/CheckboxInput.svelte';
	import IconSelectInput from '$lib/components/Forms/Fields/IconSelectInput.svelte';
	import NumberInput from '$lib/components/Forms/Fields/NumberInput.svelte';
	import ColorInput from '$lib/components/Forms/Fields/ColorInput.svelte';
	import SelectInput from '$lib/components/Forms/Fields/SelectInput.svelte';
	import DateInput from '$lib/components/Forms/Fields/DateInput.svelte';
	import DateTimeInput from '$lib/components/Forms/Fields/DateTImeInput.svelte';
	import TagInput from '$lib/components/Forms/Fields/TagInput.svelte';
	import MultiSelect from '$lib/components/Forms/Fields/MultiSelect.svelte';

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

	/**
	 * Component Registry Pattern
	 * Uses ComponentType to avoid strict prop type checking
	 */
	const FIELD_COMPONENT_MAP: Record<string, Component> = {
		text: TextInput as any,
		number: NumberInput as any,
		textarea: TextareaInput as any,
		date: DateInput as any,
		'datetime-local': DateTimeInput as any,
		select: SelectInput as any,
		checkbox: CheckboxInput as any,
		'icon-selector': IconSelectInput as any,
		color: ColorInput as any,
		tags: TagInput as any,
		multiselect: MultiSelect as any
	};

	/**
	 * Get the component to render based on field type
	 * Note: Capitalized to use as component in template (Svelte 5 requirement)
	 */
	const FieldComponent = $derived(FIELD_COMPONENT_MAP[field.type]);

	/**
	 * Prepare props to pass to the field component
	 */
	const componentProps = $derived({
		field,
		value,
		error,
		showError,
		disabled,
		onChange,
		// Only pass checked for checkbox fields
		...(field.type === 'checkbox' && { checked })
	});
</script>

<!-- Svelte 5 Runes Mode: Components are dynamic by default, no <svelte:component> needed -->
{#if FieldComponent}
	<FieldComponent {...componentProps} />
{:else}
	<!-- Fallback for unknown field types -->
	<div
		class="text-sm text-red-600 border border-red-500 bg-red-50 p-3 rounded-md flex items-start gap-2"
		role="alert"
	>
		<svg
			class="w-5 h-5 flex-shrink-0"
			fill="none"
			stroke="currentColor"
			viewBox="0 0 24 24"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
			/>
		</svg>
		<div>
			<p class="font-medium">Unknown field type</p>
			<p class="text-xs mt-1">Field type "{field.type}" is not supported. Please check your form schema.</p>
		</div>
	</div>
{/if}