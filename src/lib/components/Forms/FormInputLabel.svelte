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

	// Get icon name based on field type
	function getFieldIconName(fieldType: string): string {
		switch (fieldType) {
			case 'text': return 'PencilLine';
			case 'textarea': return 'PencilLine';
			case 'number': return 'Hash';
			case 'email': return 'Mail';
			case 'password': return 'Lock';
			case 'select': return 'ChevronDown';
			case 'checkbox': return 'CheckSquare';
			case 'color': return 'Palette';
			default: return 'Type';
		}
	}
</script>

{#if field.type !== 'checkbox'}
	<label class="flex items-center gap-1 text-sm font-medium text-slate-700 mb-1">
		<DynamicIcon
			iconName={getFieldIconName(field.type)}
			class="w-4 h-4"
			size={16}
		/>
		<span>
			{field.label}
		</span>
		{#if showRequired}
			<span class="text-red-500">*</span>
		{/if}
		{#if showConditionalBadge && field.dependencies}
			<span class="text-xs text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">
				conditional
			</span>
		{/if}
	</label>
{/if}