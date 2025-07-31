<!-- src/lib/components/FAQ/CategoryFilter.svelte -->
<script lang="ts">
	import { Filter, X } from 'lucide-svelte';
	import type { FAQCategory } from '$lib/types/faqCategory';

	interface Props {
		categories: FAQCategory[];
		selectedCategorySlug: string;
		onCategoryChange: (categorySlug: string) => void;
		onClearFilters: () => void;
		showClearButton: boolean;
	}

	let { categories, selectedCategorySlug, onCategoryChange, onClearFilters, showClearButton }: Props = $props();

	function handleCategoryClick(categorySlug: string) {
		onCategoryChange(categorySlug);
	}
</script>

<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-8">
	<div class="flex items-center justify-between mb-6">
		<div class="flex items-center gap-2">
			<Filter class="w-5 h-5 text-nexus-primary" />
			<h3 class="text-lg font-semibold text-gray-900">Categories</h3>
		</div>

		{#if showClearButton}
			<button
				onclick={onClearFilters}
				class="flex items-center gap-1 text-sm text-nexus-primary hover:text-nexus-primary-600 transition-colors duration-200"
			>
				<X class="w-4 h-4" />
				Clear
			</button>
		{/if}
	</div>

	<div class="space-y-2">
		<!-- All Categories Option -->
		<button
			onclick={() => handleCategoryClick('all')}
			class={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${
        selectedCategorySlug === 'all'
          ? 'bg-nexus-primary text-white shadow-sm'
          : 'hover:bg-gray-50 text-gray-700'
      }`}
		>
			<div class="font-medium">All Categories</div>
		</button>

		<!-- Category Options -->
		{#each categories.filter(cat => cat.isVisible && cat.isActive).sort((a, b) => a.displayOrder - b.displayOrder) as category}
			<button
				onclick={() => handleCategoryClick(category.slug)}
				class={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${
          selectedCategorySlug === category.slug
            ? 'bg-nexus-primary text-white shadow-sm'
            : 'hover:bg-gray-50 text-gray-700'
        }`}
				style={category.colorCode ? `border-left: 4px solid ${category.colorCode}` : ''}
			>
				<div class="flex items-center gap-3">
					<!-- Category Icon -->
					{#if category.iconClass}
						<i class={`${category.iconClass} ${
              selectedCategorySlug === category.slug ? 'text-white' : 'text-gray-500'
            }`}></i>
					{/if}

					<div class="flex-1">
						<div class="font-medium">{category.name}</div>
						{#if category.description}
							<div class={`text-sm mt-1 ${
                selectedCategorySlug === category.slug ? 'text-nexus-primary-100' : 'text-gray-500'
              }`}>
								{category.description}
							</div>
						{/if}

						<!-- FAQ Count -->
						{#if category.publishedFaqCount !== undefined}
							<div class={`text-xs mt-1 ${
                selectedCategorySlug === category.slug ? 'text-nexus-primary-200' : 'text-gray-400'
              }`}>
								{category.publishedFaqCount} FAQ{category.publishedFaqCount !== 1 ? 's' : ''}
							</div>
						{/if}
					</div>
				</div>
			</button>
		{/each}
	</div>

	{#if categories.length === 0}
		<div class="text-center py-8 text-gray-500">
			<p class="text-sm">No categories available</p>
		</div>
	{/if}
</div>