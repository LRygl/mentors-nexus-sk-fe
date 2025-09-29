<script lang="ts">
	import { AlertCircle, Check } from 'lucide-svelte';

	interface Props {
		hasValue: boolean;
		hasError: boolean;
		showError: boolean;
		position?: 'right-3' | 'right-8';
	}

	let {
		hasValue,
		hasError,
		showError,
		position = 'right-3'
	}: Props = $props();
</script>

<!-- Success indicator - only show when field has value and NO error -->
{#if hasValue && !hasError}
	<Check class="absolute {position} top-2.5 w-4 h-4 text-green-500" />
{/if}

<!-- Error indicator - only show when shouldShowError is true -->
{#if showError}
	<AlertCircle class="absolute {position} top-2.5 w-4 h-4 text-red-500" />
{/if}