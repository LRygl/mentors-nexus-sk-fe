<script lang="ts">
	import { authStore } from '$lib/stores/Auth.svelte';

	let isLoading = $derived(authStore.isLoading);
</script>

{#if isLoading}
	<div class="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center">
		<div class="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-xl">
			<div class="flex items-center gap-4">
				<div class="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
				<span class="text-lg font-medium text-slate-900 dark:text-white">
					Logging out...
				</span>
			</div>
		</div>
	</div>
{/if}

<style>
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }

    div[class*="fixed"] {
        animation: fadeIn 0.15s ease-out;
    }
</style>