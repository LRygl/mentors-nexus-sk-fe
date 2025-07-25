<!-- lib/components/Pagination.svelte -->
<script lang="ts">
	import { courseFilterStore } from '$lib/stores/course-filter-store';

	interface Props {
		currentPage: number;
		totalPages: number;
	}

	let { currentPage, totalPages }: Props = $props();

	function goToPage(page: number) {
		if (page >= 1 && page <= totalPages) {
			courseFilterStore.goToPage(page);
		}
	}

	function previousPage() {
		goToPage(currentPage - 1);
	}

	function nextPage() {
		goToPage(currentPage + 1);
	}

	// Calculate visible page numbers
	let visiblePages = $derived(() => {
		const pages = [];
		const startPage = Math.max(1, Math.min(totalPages - 4, currentPage - 2));
		const endPage = Math.min(totalPages, startPage + 4);

		for (let i = startPage; i <= endPage; i++) {
			pages.push(i);
		}
		return pages;
	});
</script>

{#if totalPages > 1}
	<div class="flex items-center justify-center mt-12 gap-2">
		<button
			onclick={previousPage}
			disabled={currentPage === 1}
			class="flex items-center justify-center w-12 h-12 rounded-2xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg border border-white/20 dark:border-gray-700/30 text-gray-600 dark:text-gray-300 hover:bg-white/80 dark:hover:bg-gray-700/80 hover:scale-110 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
		>
			<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
			</svg>
		</button>

		{#each visiblePages as page}
			<button
				onclick={() => goToPage(page)}
				class="flex items-center justify-center w-12 h-12 rounded-2xl text-sm font-semibold transition-all duration-300 hover:scale-110 {page === currentPage ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg' : 'bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg border border-white/20 dark:border-gray-700/30 text-gray-600 dark:text-gray-300 hover:bg-white/80 dark:hover:bg-gray-700/80'}"
			>
				{page}
			</button>
		{/each}

		<button
			onclick={nextPage}
			disabled={currentPage === totalPages}
			class="flex items-center justify-center w-12 h-12 rounded-2xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg border border-white/20 dark:border-gray-700/30 text-gray-600 dark:text-gray-300 hover:bg-white/80 dark:hover:bg-gray-700/80 hover:scale-110 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
		>
			<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
			</svg>
		</button>
	</div>
{/if}