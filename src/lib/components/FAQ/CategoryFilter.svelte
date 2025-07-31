<script lang="ts">
	import { X, Filter } from 'lucide-svelte';
	import type { FAQCategory } from '$lib/types/faq.js';

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

<div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-gray-700/30 p-8 sticky top-8 shadow-xl hover:shadow-2xl transition-all duration-500">
	<!-- Header with icon -->
	<div class="flex items-center gap-3 mb-8">
		<div class="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
			<Filter class="w-5 h-5 text-white" />
		</div>
		<h3 class="text-xl font-bold text-gray-900 dark:text-gray-100">Categories</h3>
	</div>

	<!-- Categories list -->
	<div class="space-y-3">
		{#each categories as category, index}
			<button
				onclick={() => onCategoryChange(category.id)}
				class="group w-full flex items-center justify-between p-4 rounded-2xl text-left transition-all duration-300 transform hover:scale-[1.02] animate-fade-in-up {selectedCategory === category.id ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-700 dark:text-blue-300 shadow-lg scale-[1.02]' : 'hover:bg-gray-100/80 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-300'}"
				style="animation-delay: {index * 50}ms;"
			>
				<div class="flex items-center gap-4">
					<!-- Icon with animation -->
					<div class="w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300 {selectedCategory === category.id ? 'bg-blue-500/20 text-blue-600 dark:text-blue-400' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 group-hover:text-blue-500'}">
						<svelte:component this={category.icon} class="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
					</div>

					<!-- Label -->
					<span class="text-sm font-medium group-hover:translate-x-1 transition-transform duration-300">
            {category.label}
          </span>
				</div>

				<!-- Count badge -->
				<div class="relative">
          <span class="inline-flex items-center justify-center min-w-[2rem] h-7 px-2 text-xs font-bold rounded-full transition-all duration-300 {selectedCategory === category.id ? 'bg-blue-500 text-white shadow-lg' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 group-hover:text-blue-600 dark:group-hover:text-blue-400'}">
            {category.count}
          </span>

					<!-- Pulse effect for active category -->
					{#if selectedCategory === category.id}
						<span class="absolute inset-0 rounded-full bg-blue-500 animate-ping opacity-20"></span>
					{/if}
				</div>
			</button>
		{/each}
	</div>

	<!-- Enhanced Clear Filters Button -->
	{#if showClearButton}
		<div class="mt-8 animate-fade-in-up">
			<button
				onclick={onClearFilters}
				class="group w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 text-gray-700 dark:text-gray-200 font-medium rounded-2xl border border-gray-300 dark:border-gray-600 hover:from-red-50 hover:to-red-100 dark:hover:from-red-900/20 dark:hover:to-red-800/20 hover:text-red-600 dark:hover:text-red-400 hover:border-red-300 dark:hover:border-red-600 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 transform"
			>
				<!-- Rotating X icon -->
				<X class="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />

				<!-- Button text -->
				<span class="group-hover:translate-x-1 transition-transform duration-300">
          Clear Filters
        </span>

				<!-- Ripple effect -->
				<div class="absolute inset-0 rounded-2xl bg-gradient-to-r from-red-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
			</button>
		</div>
	{/if}
</div>