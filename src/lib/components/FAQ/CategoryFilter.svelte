<!-- components/FAQ/CategoryFilter.svelte -->
<script lang="ts">
	import type { FAQCategory } from '../../types/faq.js';

	interface Props {
		categories: FAQCategory[];
		selectedCategory: string;
		onCategoryChange: (categoryId: string) => void;
		onClearFilters: () => void;
		showClearButton?: boolean;
	}

	let {
		categories,
		selectedCategory,
		onCategoryChange,
		onClearFilters,
		showClearButton = false
	}: Props = $props();
</script>

<div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-6 sticky top-8">
	<h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">Categories</h3>

	<div class="space-y-2">
		{#each categories as category}
			<button
				onclick={() => onCategoryChange(category.id)}
				class="w-full flex items-center justify-between p-3 rounded-xl text-left transition-all duration-200 {selectedCategory === category.id ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' : 'hover:bg-gray-100 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-300'}"
			>
				<div class="flex items-center gap-3">
					<svelte:component this={category.icon} class="w-4 h-4" />
					<span class="text-sm font-medium">{category.label}</span>
				</div>
				<span class="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-full">
          {category.count}
        </span>
			</button>
		{/each}
	</div>

	{#if showClearButton}
		<button
			onclick={onClearFilters}
			class="w-full mt-6 px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200"
		>
			Clear Filters
		</button>
	{/if}
</div>