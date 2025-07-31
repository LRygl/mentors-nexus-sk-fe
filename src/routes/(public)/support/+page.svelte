<!-- src/routes/(public)/support/+page.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import HeaderSection from '$lib/components/Sections/header-section.svelte';
	import SearchBar from '$lib/components/FAQ/SearchBar.svelte';
	import CategoryFilter from '$lib/components/FAQ/CategoryFilter.svelte';
	import FAQCard from '$lib/components/FAQ/FAQCard.svelte';
	import EmptyState from '$lib/components/FAQ/EmptyState.svelte';
	import {
		faqStore,
		faqActions,
		filteredFAQs,
		visibleCategories,
		showClearButton
	} from '$lib/stores/faq-store';
	import { Loader2, TrendingUp, Star } from 'lucide-svelte';

	// Load FAQ data on mount
	onMount(async () => {
		await faqActions.loadAllData();
	});

	// Event handlers
	function handleSearchChange(query: string) {
		faqActions.setSearchQuery(query);
	}

	function handlePopularSearchClick(search: string) {
		faqActions.setSearchQuery(search);
	}

	function handleCategoryChange(categorySlug: string) {
		faqActions.setSelectedCategory(categorySlug);
	}

	function handleToggleExpanded(id: string) {
		faqActions.toggleExpanded(id);
	}

	function handleClearFilters() {
		faqActions.clearFilters();
	}
</script>

<svelte:head>
	<title>FAQ - Frequently Asked Questions | Your LMS</title>
	<meta name="description" content="Find quick answers to common questions about our learning platform, courses, payments, and more." />
</svelte:head>

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
	<!-- Loading State -->
	{#if $faqStore.loading}
		<div class="flex items-center justify-center py-16">
			<div class="flex items-center gap-3 text-nexus-primary">
				<Loader2 class="w-6 h-6 animate-spin" />
				<span class="text-lg font-medium">Loading FAQs...</span>
			</div>
		</div>

		<!-- Error State -->
	{:else if $faqStore.error}
		<div class="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
			<div class="flex items-center gap-3">
				<div class="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
					<svg class="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
						<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
					</svg>
				</div>
				<div>
					<h3 class="text-lg font-semibold text-red-900">Failed to load FAQs</h3>
					<p class="text-red-700 mt-1">{$faqStore.error}</p>
					<button
						onclick={() => faqActions.loadAllData()}
						class="mt-3 text-red-600 hover:text-red-500 font-medium"
					>
						Try again
					</button>
				</div>
			</div>
		</div>

		<!-- Content -->
	{:else}
		<!-- Featured FAQs Section (if any) -->
		{#if $faqStore.featuredFAQs.length > 0 && $faqStore.selectedCategorySlug === 'all' && !$faqStore.searchQuery}
			<div class="mb-12">
				<div class="flex items-center gap-2 mb-6">
					<Star class="w-5 h-5 text-yellow-500" />
					<h2 class="text-xl font-semibold text-gray-900">Featured Questions</h2>
				</div>
				<div class="grid gap-4 md:grid-cols-2">
					{#each $faqStore.featuredFAQs.slice(0, 4) as faq}
						<FAQCard
							{faq}
							isExpanded={$faqStore.expandedItems.has(faq.id.toString())}
							onToggle={handleToggleExpanded}
							showAnalytics={false}
						/>
					{/each}
				</div>
			</div>
		{/if}

		<!-- Popular FAQs Section (if any) -->
		{#if $faqStore.popularFAQs.length > 0 && $faqStore.selectedCategorySlug === 'all' && !$faqStore.searchQuery}
			<div class="mb-12">
				<div class="flex items-center gap-2 mb-6">
					<TrendingUp class="w-5 h-5 text-green-500" />
					<h2 class="text-xl font-semibold text-gray-900">Most Popular</h2>
				</div>
				<div class="grid gap-4 md:grid-cols-2">
					{#each $faqStore.popularFAQs.slice(0, 4) as faq}
						<FAQCard
							{faq}
							isExpanded={$faqStore.expandedItems.has(faq.id.toString())}
							onToggle={handleToggleExpanded}
							showAnalytics={true}
						/>
					{/each}
				</div>
			</div>
		{/if}

		<!-- Search Bar -->
		<div class="mb-12">
			<SearchBar
				searchQuery={$faqStore.searchQuery}
				popularSearches={$faqStore.popularSearches}
				onSearchChange={handleSearchChange}
				onPopularSearchClick={handlePopularSearchClick}
			/>
		</div>

		<div class="grid lg:grid-cols-4 gap-8">
			<!-- Category Filter Sidebar -->
			<div class="lg:col-span-1">
				<CategoryFilter
					categories={$visibleCategories}
					selectedCategorySlug={$faqStore.selectedCategorySlug}
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
					<!-- Results Header -->
					<div class="flex items-center justify-between mb-6">
						<div class="text-sm text-gray-600">
							Showing {$filteredFAQs.length} FAQ{$filteredFAQs.length !== 1 ? 's' : ''}
							{#if $faqStore.searchQuery}
								for "{$faqStore.searchQuery}"
							{/if}
							{#if $faqStore.selectedCategorySlug !== 'all'}
								{@const selectedCat = $visibleCategories.find(cat => cat.slug === $faqStore.selectedCategorySlug)}
								{#if selectedCat}
									in {selectedCat.name}
								{/if}
							{/if}
						</div>

						<!-- Expand/Collapse All -->
						<div class="flex items-center gap-2">
							<button
								onclick={() => faqActions.expandAll()}
								class="text-sm text-nexus-primary hover:text-nexus-primary-600 transition-colors duration-200"
							>
								Expand all
							</button>
							<span class="text-gray-300">|</span>
							<button
								onclick={() => faqActions.collapseAll()}
								class="text-sm text-nexus-primary hover:text-nexus-primary-600 transition-colors duration-200"
							>
								Collapse all
							</button>
						</div>
					</div>

					<!-- FAQ List -->
					<div class="space-y-4">
						{#each $filteredFAQs as faq}
							<FAQCard
								{faq}
								isExpanded={$faqStore.expandedItems.has(faq.id.toString())}
								onToggle={handleToggleExpanded}
								showAnalytics={false}
							/>
						{/each}
					</div>

					<!-- Load More (if needed for pagination) -->
					{#if $filteredFAQs.length >= 20}
						<div class="mt-8 text-center">
							<button class="px-6 py-3 bg-nexus-primary text-white rounded-xl hover:bg-nexus-primary-600 transition-colors duration-200">
								Load More FAQs
							</button>
						</div>
					{/if}
				{/if}
			</div>
		</div>
	{/if}
</section>

<!-- Additional Help Section -->
<section class="bg-gray-50 py-16">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
		<h2 class="text-2xl font-bold text-gray-900 mb-4">Still need help?</h2>
		<p class="text-gray-600 mb-8 max-w-2xl mx-auto">
			Can't find the answer you're looking for? Our support team is here to help you get the most out of our platform.
		</p>
		<div class="flex flex-col sm:flex-row gap-4 justify-center">
			<a
				href="/contact"
				class="inline-flex items-center px-6 py-3 bg-nexus-primary text-white rounded-xl hover:bg-nexus-primary-600 transition-colors duration-200 font-medium"
			>
				Contact Support
			</a>
			<a
				href="/help/getting-started"
				class="inline-flex items-center px-6 py-3 bg-white text-nexus-primary border border-nexus-primary rounded-xl hover:bg-nexus-primary-50 transition-colors duration-200 font-medium"
			>
				Getting Started Guide
			</a>
		</div>
	</div>
</section>