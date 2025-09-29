<script lang="ts">

	import type { FormFieldGroup, FormLayout, FormState } from '$lib/types/entities/forms';
	import FormFieldRenderer from '$lib/components/Forms/FormFieldRenderer.svelte';

	interface Props {
		group: FormFieldGroup;
		formState: FormState;
		layout?: FormLayout;
		disabled?: boolean;
		onChange: (fieldName: string, value: any) => void;
		shouldRenderField: (field: any) => boolean;
		shouldShowError: (fieldName: string) => boolean;
	}

	let {
		group,
		formState,
		layout = 'single',
		disabled = false,
		onChange,
		shouldRenderField,
		shouldShowError
	}: Props = $props();

	// Get grid class based on layout
	const gridClass = $derived(() => {
		switch (layout) {
			case 'two-column':
				return 'lg:grid-cols-2';
			case 'three-column':
				return 'lg:grid-cols-3';
			default:
				return '';
		}
	});
</script>

<div class="space-y-4 {group.className || ''}">
	<!-- Group Header -->
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

	<!-- Fields Grid -->
	<div class="grid grid-cols-1 {gridClass()} gap-4">
		{#each group.fields as field}
			{#if shouldRenderField(field)}
				<div class="space-y-2 {field.colSpan === 2 ? 'lg:col-span-2' : ''} {field.className || ''}">
					<FormFieldRenderer
						{field}
						{formState}
						{disabled}
						{onChange}
						{shouldShowError}
					/>
				</div>
			{/if}
		{/each}
	</div>
</div>