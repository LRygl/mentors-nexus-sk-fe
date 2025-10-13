<script lang="ts">
	import { toastService } from '$lib/services/ToastService.svelte';
	import ToastItem from './ToastItem.svelte';
	import type { ToastPosition } from '$lib/types/entities/ToastTypes';

	// Get reactive state from service
	const toasts = $derived(toastService.toasts);
	const position = $derived(toastService.settings.position);

	// Position class mapping
	const positionClasses: Record<ToastPosition, string> = {
		'top-left': 'top-4 left-4 items-start',
		'top-center': 'top-4 left-1/2 -translate-x-1/2 items-center',
		'top-right': 'top-4 right-4 items-end',
		'bottom-left': 'bottom-4 left-4 items-start',
		'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2 items-center',
		'bottom-right': 'bottom-4 right-4 items-end'
	};

	const positionClass = $derived(positionClasses[position]);
</script>

<!-- Toast Container -->
<div
	class="fixed z-50 flex flex-col gap-3 pointer-events-none {positionClass}"
	aria-live="polite"
	aria-atomic="false"
>
	{#each toasts as toast (toast.id)}
		<div class="pointer-events-auto">
			<ToastItem {toast} />
		</div>
	{/each}
</div>