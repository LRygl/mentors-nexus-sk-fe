<script lang="ts">
	import { onMount } from 'svelte';
	import HeaderSection from '$lib/components/Sections/header-section.svelte';
	import SearchBar from '$lib/components/FAQ/SearchBar.svelte';
	import CategoryFilter from '$lib/components/FAQ/CategoryFilter.svelte';
	import FAQCard from '$lib/components/FAQ/FAQCard.svelte';
	import EmptyState from '$lib/components/FAQ/EmptyState.svelte';
	import {
		searchQuery,
		selectedCategory,
		expandedItems,
		filteredFAQs,
		categories,
		showClearButton,
		popularSearches,
		faqActions
	} from '$lib/stores/faq-store';
	import { loadFAQData } from '$lib/utils/faq-loader.js';

	// Load FAQ data on mount
	onMount(async () => {
		await loadFAQData();
	});

	// Event handlers
	function handleSearchChange(query: string) {
		faqActions.setSearchQuery(query);
	}

	function handlePopularSearchClick(search: string) {
		faqActions.setSearchQuery(search);
	}

	function handleCategoryChange(categoryId: string) {
		faqActions.setSelectedCategory(categoryId);
	}

	function handleToggleExpanded(id: string) {
		faqActions.toggleExpanded(id);
	}

	function handleClearFilters() {
		faqActions.clearFilters();
	}
</script>

	<!-- Header Section -->
	<section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-18 text-gray-800 dark:text-gray-100">
		<div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<HeaderSection
				heading="Frequently Asked Questions"
				subHeading="Find quick answers to common questions about our learning platform"
				showBadge={true}
				badgeText="Help Center"
			/>
		</div>
	</section>

	<!-- Main Content -->
	<section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
		<!-- Search Bar -->
		<div class="mb-12">
			<SearchBar
				searchQuery={$searchQuery}
				popularSearches={$popularSearches}
				onSearchChange={handleSearchChange}
				onPopularSearchClick={handlePopularSearchClick}
			/>
		</div>

		<div class="grid lg:grid-cols-4 gap-8">
			<!-- Category Filter Sidebar -->
			<div class="lg:col-span-1">
				<CategoryFilter
					categories={$categories}
					selectedCategory={$selectedCategory}
					onCategoryChange={handleCategoryChange}
					onClearFilters={handleClearFilters}
					showClearButton={$showClearButton}
				/>
			</div>

			<!-- FAQ Content -->
			<div class="lg:col-span-3">
				{#if $filteredFAQs.length === 0}
					<EmptyState onClearFilters={handleClearFilters} />
				{:else}
					<div class="space-y-4">
						{#each $filteredFAQs as faq}
							<FAQCard
								{faq}
								isExpanded={$expandedItems.has(faq.id)}
								onToggle={handleToggleExpanded}
							/>
						{/each}
					</div>
				{/if}
			</div>
		</div>
	</section>
