<script lang="ts">
	import type { FormField } from '$lib/types/entities/forms';

	interface Props {
		field: FormField;
		error?: string;
		showError?: boolean;
	}

	let {
		field,
		error,
		showError = false
	}: Props = $props();
</script>

{#if showError && error}
	<p class="text-xs text-red-600">{error}</p>
{:else if field.helpText}
	<p class="text-xs text-slate-500">
		{field.helpText}
		{#if field.dependencies}
			<span class="text-amber-600">
				• Shown when {field.dependencies[0].field} is {field.dependencies[0].condition === 'truthy' ? 'enabled' : 'disabled'}
			</span>
		{/if}
	</p>
{/if}