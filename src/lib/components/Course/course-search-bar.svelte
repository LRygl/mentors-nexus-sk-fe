<!-- lib/components/CourseSearchBar.svelte -->
<script lang="ts">
	import type { SortOption, ViewMode } from '$lib/types/course-filters';
	import { courseFilterStore } from '$lib/stores/course-filter-store';

	interface Props {
		searchQuery: string;
		sortBy: SortOption;
		viewMode: ViewMode;
		showFilters: boolean;
	}

	let { searchQuery, sortBy, viewMode, showFilters }: Props = $props();

	function handleSortChange(event: Event) {
		const target = event.target as HTMLSelectElement;
		courseFilterStore.updateSort(target.value as SortOption);
	}
</script>

<div class="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 rounded-3xl p-6 mb-8">
	<div class="flex flex-col lg:flex-row gap-4 items-center justify-between">
		<!-- Search Bar -->
		<div class="relative flex-1 max-w-md">
			<svg class="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
			</svg>
			<input
				type="text"
				value={searchQuery}
				oninput={(e) => courseFilterStore.updateSearchQuery((e.target as HTMLInputElement).value)}
				placeholder="Search courses..."
				class="w-full pl-12 pr-4 py-3 bg-white/80 dark:bg-gray-700/80 border border-gray-200/50 dark:border-gray-600/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300"
			/>
		</div>

		<!-- Controls -->
		<div class="flex items-center gap-3">
			<!-- Sort Dropdown -->
			<select
				value={sortBy}
				onchange={handleSortChange}
				class="px-4 py-3 bg-white/80 dark:bg-gray-700/80 border border-gray-200/50 dark:border-gray-600/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm font-medium"
			>
				<option value="popular">Most Popular</option>
				<option value="newest">Newest</option>
				<option value="rating">Highest Rated</option>
				<option value="price-low">Price: Low to High</option>
				<option value="price-high">Price: High to Low</option>
				<option value="students">Most Students</option>
			</select>

			<!-- View Toggle -->
			<div class="flex items-center gap-1 p-1 bg-white/80 dark:bg-gray-700/80 rounded-2xl border border-gray-200/50 dark:border-gray-600/50">
				<button
					onclick={() => courseFilterStore.updateViewMode('grid')}
					class="p-2 rounded-xl transition-all duration-300 {viewMode === 'grid' ? 'bg-blue-500 text-white shadow-lg' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'}"
				>
					<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
					</svg>
				</button>
				<button
					onclick={() => courseFilterStore.updateViewMode('list')}
					class="p-2 rounded-xl transition-all duration-300 {viewMode === 'list' ? 'bg-blue-500 text-white shadow-lg' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'}"
				>
					<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path>
					</svg>
				</button>
			</div>

			<!-- Filter Toggle -->
			<button
				onclick={() => courseFilterStore.toggleFilters()}
				class="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
			>
				<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z"></path>
				</svg>
				Filters
			</button>
		</div>
	</div>
</div>