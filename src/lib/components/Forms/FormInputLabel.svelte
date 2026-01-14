<script lang="ts">

	import type { FormField } from '$lib/types/entities/forms';
	import DynamicIcon from '$lib/components/UI/DynamicIcon.svelte';

	interface Props {
		field: FormField;
		showRequired?: boolean;
		showConditionalBadge?: boolean;
	}

	let {
		field,
		showRequired = false,
		showConditionalBadge = false
	}: Props = $props();

	// ✨ NEW: Derived computations for better performance
	const shouldRenderLabel = $derived(field.type !== 'checkbox');

	const hasConditionalDependencies = $derived(
		showConditionalBadge && field.dependencies && field.dependencies.length > 0
	);

</script>

{#if shouldRenderLabel}
	<label
		for={field.name}
	class="flex items-center gap-1.5 text-sm font-medium text-slate-700 mb-1.5"
	>
	<span>{field.label}</span>

	{#if showRequired}
		<span class="text-red-500 text-base" aria-label="required">*</span>
	{/if}

	{#if hasConditionalDependencies}
		<span
			class="text-xs font-normal text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded"
			title="This field has conditional requirements"
		>
		Conditional field
		</span>
	{/if}
	</label>
{/if}