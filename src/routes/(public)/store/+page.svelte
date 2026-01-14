<script lang="ts">
	import { Search, SlidersHorizontal, Grid3x3, List, X, ChevronDown, Star } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';
	import type { Course } from '$lib/types/entities/Course';
	import CourseCard from '$lib/components/Sections/Public/CourseCard.svelte';
	import CourseListItem from '$lib/components/Sections/Public/CourseListItem.svelte';
	import { messages } from '$lib/i18n/messages';
	import { courseStore } from '$lib/stores/defaults/CourseStore.svelte';
	import { onMount } from 'svelte';

	// Props
	let courses = $derived(courseStore.data);

	onMount(async () => {
		await courseStore.fetchAll();
	})

	// State with Svelte 5 runes
	let searchQuery = $state('');
	let viewMode = $state<'grid' | 'list'>('grid');
	let showFilters = $state(true);
	let showSearchResults = $state(false);

	// Filter state
	let filters = $state({
		categories: [] as string[],
		levels: [] as string[],
		priceRange: { min: 0, max: 50000 },
		duration: { min: 0, max: 100 },
		rating: 0,
		featured: false
	});

	// Available filter options (in real app, fetch from API)
	const filterOptions = {
		categories: ['EV Technology', 'Smart Grid', 'Renewable Energy', 'Battery Systems', 'Infrastructure'],
		levels: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
		ratings: [5, 4, 3, 2, 1]
	};

	// Derived state - filtered courses
	let filteredCourses = $derived(() => {
		return courses.filter(course => {
			// Search filter
			if (searchQuery && !course.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
				!course.description.toLowerCase().includes(searchQuery.toLowerCase())) {
				return false;
			}

			// Price filter
			if (course.price < filters.priceRange.min || course.price > filters.priceRange.max) {
				return false;
			}

			// Featured filter
			if (filters.featured && !course.featured) {
				return false;
			}

			return true;
		});
	});

	// Search results (top 5 for preview)
	let searchResults = $derived(() => {
		if (!searchQuery) return [];
		return filteredCourses().slice(0, 5);
	});

	// Filter handlers
	const toggleCategory = (category: string) => {
		if (filters.categories.includes(category)) {
			filters.categories = filters.categories.filter(c => c !== category);
		} else {
			filters.categories = [...filters.categories, category];
		}
	};

	const toggleLevel = (level: string) => {
		if (filters.levels.includes(level)) {
			filters.levels = filters.levels.filter(l => l !== level);
		} else {
			filters.levels = [...filters.levels, level];
		}
	};

	const clearFilters = () => {
		filters = {
			categories: [],
			levels: [],
			priceRange: { min: 0, max: 50000 },
			duration: { min: 0, max: 100 },
			rating: 0,
			featured: false
		};
		searchQuery = '';
	};

	const activeFilterCount = $derived(() => {
		let count = 0;
		if (filters.categories.length > 0) count++;
		if (filters.levels.length > 0) count++;
		if (filters.priceRange.min > 0 || filters.priceRange.max < 50000) count++;
		if (filters.rating > 0) count++;
		if (filters.featured) count++;
		return count;
	});
</script>

<div class="min-h-screen">
	<!-- Subtle Pattern Background -->
	<div class="fixed inset-0 opacity-[0.03]">
		<div class="absolute inset-0" style="background-image: radial-gradient(circle at 2px 2px, rgb(0 0 0) 1px, transparent 0); background-size: 40px 40px;"></div>
	</div>

	<div class="relative z-10 max-w-[1600px] mx-auto px-4 lg:px-8 py-12">
		<!-- Header -->
		<div class="text-center mb-12 animate-fade-in">
			<h1 class="text-5xl lg:text-6xl font-black text-gray-900 mb-4">
				<span class="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
					Explore
				</span>
				<span class="text-gray-900"> Stations</span>
			</h1>
			<p class="text-xl text-gray-600 font-light">
				Discover your next learning adventure from our collection of expert-led courses
			</p>
		</div>

		<!-- Search Bar - Prominent -->
		<div class="mx-auto mb-12 animate-slide-up">
			<div class="relative group">
				<div class="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
				<div class="relative bg-white rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-300 overflow-hidden border border-gray-200">
					<div class="flex items-center p-6 gap-4">
						<Search class="w-8 h-8 text-blue-600 flex-shrink-0" />
						<input
							type="text"
							bind:value={searchQuery}
							onfocus={() => showSearchResults = true}
							onblur={() => setTimeout(() => showSearchResults = false, 200)}
							placeholder="Search for courses, topics, or skills..."
							class="flex-1 bg-transparent text-gray-900 text-lg placeholder-gray-400 outline-none"
						/>
						{#if searchQuery}
							<button
								onclick={() => { searchQuery = ''; showSearchResults = false; }}
								class="p-2 hover:bg-gray-100 rounded-full transition-colors"
							>
								<X class="w-5 h-5 text-gray-500" />
							</button>
						{/if}
						<Button class="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold px-8 py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
							Search
						</Button>
					</div>

					<!-- Search Results Preview -->
					{#if showSearchResults && searchQuery && searchResults().length > 0}
						<div class="border-t border-gray-100 bg-gray-50">
							<div class="p-4 space-y-2">
								{#each searchResults() as course}
									<a
										href="/course/{course.id}"
										class="block p-4 bg-white hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 rounded-2xl border border-gray-200 hover:border-blue-300 transition-all duration-300 group/item hover:shadow-md"
									>
										<div class="flex items-center gap-4">
											<img
												src={course.imageUrl}
												alt={course.name}
												class="w-20 h-20 rounded-xl object-cover shadow-sm"
											/>
											<div class="flex-1 min-w-0">
												<h4 class="text-gray-900 font-semibold truncate group-hover/item:text-blue-600 transition-colors">
													{course.name}
												</h4>
												<p class="text-gray-600 text-sm truncate">{course.description}</p>
												<div class="flex items-center gap-4 mt-2 text-xs text-gray-500">
													<span class="px-2 py-1 bg-blue-100 text-blue-700 rounded-lg font-medium">{course.level}</span>
													<span>•</span>
													<span>{course.categories}</span>
													<span>•</span>
													<span class="font-bold text-gray-900">{new Intl.NumberFormat('cs-CZ', { style: 'currency', currency: 'CZK', minimumFractionDigits: 0 }).format(course.price)}</span>
												</div>
											</div>
										</div>
									</a>
								{/each}
								{#if filteredCourses().length > 5}
									<div class="text-center pt-2">
										<button
											onclick={() => showSearchResults = false}
											class="text-blue-600 hover:text-blue-700 text-sm font-semibold"
										>
											View all {filteredCourses().length} results →
										</button>
									</div>
								{/if}
							</div>
						</div>
					{/if}
				</div>
			</div>
		</div>

		<!-- Main Content Area -->
		<div class="lg:grid lg:grid-cols-12 lg:gap-8">
			<!-- Filters Sidebar -->
			<div class="lg:col-span-3 mb-8 lg:mb-0">
				<div class="sticky top-8 space-y-6">
					<!-- Filter Header -->
					<div class="bg-white rounded-3xl shadow-lg border border-gray-200 p-6">
						<div class="flex items-center justify-between mb-6">
							<h2 class="text-xl font-bold text-gray-900 flex items-center gap-2">
								<div class="p-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl">
									<SlidersHorizontal class="w-5 h-5 text-white" />
								</div>
								Filters
								{#if activeFilterCount() > 0}
									<span class="px-2.5 py-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full text-xs font-bold shadow-md">
										{activeFilterCount()}
									</span>
								{/if}
							</h2>
							{#if activeFilterCount() > 0}
								<button
									onclick={clearFilters}
									class="text-sm text-blue-600 hover:text-blue-700 font-semibold transition-colors"
								>
									Clear all
								</button>
							{/if}
						</div>

						<!-- Categories -->
						<div class="mb-6">
							<h3 class="text-gray-900 font-semibold mb-3 flex items-center gap-2">
								<div class="w-1 h-5 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full"></div>
								Categories
							</h3>
							<div class="space-y-2">
								{#each filterOptions.categories as category}
									<label class="flex items-center gap-3 p-3 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 cursor-pointer transition-all duration-200 group border border-transparent hover:border-blue-200">
										<input
											type="checkbox"
											checked={filters.categories.includes(category)}
											onchange={() => toggleCategory(category)}
											class="w-5 h-5 rounded-lg border-2 border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer transition-all"
										/>
										<span class="text-gray-700 text-sm group-hover:text-gray-900 font-medium transition-colors">
											{category}
										</span>
									</label>
								{/each}
							</div>
						</div>

						<!-- Levels -->
						<div class="mb-6">
							<h3 class="text-gray-900 font-semibold mb-3 flex items-center gap-2">
								<div class="w-1 h-5 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full"></div>
								Skill Level
							</h3>
							<div class="space-y-2">
								{#each filterOptions.levels as level}
									<label class="flex items-center gap-3 p-3 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 cursor-pointer transition-all duration-200 group border border-transparent hover:border-blue-200">
										<input
											type="checkbox"
											checked={filters.levels.includes(level)}
											onchange={() => toggleLevel(level)}
											class="w-5 h-5 rounded-lg border-2 border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer transition-all"
										/>
										<span class="text-gray-700 text-sm group-hover:text-gray-900 font-medium transition-colors">
											{level}
										</span>
									</label>
								{/each}
							</div>
						</div>

						<!-- Price Range -->
						<div class="mb-6">
							<h3 class="text-gray-900 font-semibold mb-3 flex items-center gap-2">
								<div class="w-1 h-5 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full"></div>
								Price Range (CZK)
							</h3>
							<div class="space-y-4">
								<div>
									<label class="text-gray-600 text-sm mb-1 block font-medium">Min</label>
									<input
										type="number"
										bind:value={filters.priceRange.min}
										min="0"
										max={filters.priceRange.max}
										class="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-2.5 text-gray-900 outline-none focus:border-blue-500 focus:bg-white transition-all"
									/>
								</div>
								<div>
									<label class="text-gray-600 text-sm mb-1 block font-medium">Max</label>
									<input
										type="number"
										bind:value={filters.priceRange.max}
										min={filters.priceRange.min}
										max="50000"
										class="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-2.5 text-gray-900 outline-none focus:border-blue-500 focus:bg-white transition-all"
									/>
								</div>
							</div>
						</div>

						<!-- Rating -->
						<div class="mb-6">
							<h3 class="text-gray-900 font-semibold mb-3 flex items-center gap-2">
								<div class="w-1 h-5 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full"></div>
								Minimum Rating
							</h3>
							<div class="space-y-2">
								{#each filterOptions.ratings as rating}
									<button
										onclick={() => filters.rating = filters.rating === rating ? 0 : rating}
										class="w-full flex items-center gap-2 p-3 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200 border-2 {filters.rating === rating ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-purple-50 shadow-md' : 'border-transparent'}"
									>
										<div class="flex">
											{#each Array(rating) as _}
												<span class="text-yellow-400 text-lg">★</span>
											{/each}
											{#each Array(5 - rating) as _}
												<span class="text-gray-300 text-lg">★</span>
											{/each}
										</div>
										<span class="text-gray-700 text-sm font-medium">& up</span>
									</button>
								{/each}
							</div>
						</div>

						<!-- Featured Only -->
						<div>
							<label class="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300 cursor-pointer hover:border-yellow-400 transition-all duration-200 hover:shadow-md group">
								<input
									type="checkbox"
									bind:checked={filters.featured}
									class="w-5 h-5 rounded-lg border-2 border-yellow-500 text-yellow-600 focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 cursor-pointer"
								/>
								<div class="flex items-center gap-2">
									<Star class="w-5 h-5 text-yellow-600 fill-current" />
									<span class="text-gray-900 font-semibold text-sm">
										Featured Courses Only
									</span>
								</div>
							</label>
						</div>
					</div>
				</div>
			</div>

			<!-- Course List -->
			<div class="lg:col-span-9">
				<!-- Results Header -->
				<div class="bg-white rounded-3xl shadow-lg border border-gray-200 p-6 mb-6 flex items-center justify-between">
					<div>
						<h3 class="text-gray-900 font-bold text-lg">
							{filteredCourses().length} Course{filteredCourses().length !== 1 ? 's' : ''} Found
						</h3>
						<p class="text-gray-600 text-sm">
							{searchQuery ? `Results for "${searchQuery}"` : 'Showing all courses'}
						</p>
					</div>

					<!-- View Toggle -->
					<div class="flex items-center gap-2 bg-gray-100 rounded-2xl p-1.5">
						<button
							onclick={() => viewMode = 'grid'}
							class="p-3 rounded-xl transition-all {viewMode === 'grid' ? 'bg-white text-blue-600 shadow-md' : 'text-gray-600 hover:text-gray-900'}"
						>
							<Grid3x3 class="w-5 h-5" />
						</button>
						<button
							onclick={() => viewMode = 'list'}
							class="p-3 rounded-xl transition-all {viewMode === 'list' ? 'bg-white text-blue-600 shadow-md' : 'text-gray-600 hover:text-gray-900'}"
						>
							<List class="w-5 h-5" />
						</button>
					</div>
				</div>

				<!-- Course Grid/List -->
				{#if filteredCourses().length > 0}
					<div class="{viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6' : 'space-y-4'}">
						{#each filteredCourses() as course (course.id)}
							{#if viewMode === 'grid'}
								<div class="animate-fade-in">
									<CourseCard {course} />
								</div>
							{:else}
								<div class="animate-fade-in">
									<CourseListItem {course} />
								</div>
							{/if}
						{/each}
					</div>
				{:else}
					<div class="bg-white rounded-3xl shadow-lg border border-gray-200 p-12 text-center">
						<div class="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
							<Search class="w-10 h-10 text-blue-600" />
						</div>
						<h3 class="text-2xl font-bold text-gray-900 mb-2">{!messages.store.noCoursesFound}</h3>
						<p class="text-gray-600 mb-6">Try adjusting your filters or search query</p>
						<Button
							onclick={clearFilters}
							class="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold px-6 py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
						>
							{messages.store.clearFilters}
						</Button>
					</div>
				{/if}
			</div>
		</div>
	</div>
</div>

<style>
    @keyframes fade-in {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }

    @keyframes slide-up {
        from { opacity: 0; transform: translateY(40px); }
        to { opacity: 1; transform: translateY(0); }
    }

    .animate-fade-in {
        animation: fade-in 0.6s ease-out forwards;
    }

    .animate-slide-up {
        animation: slide-up 0.8s ease-out forwards;
    }

    /* Custom scrollbar for filter sidebar */
    .lg\:col-span-3 {
        scrollbar-width: thin;
        scrollbar-color: rgba(59, 130, 246, 0.3) rgba(229, 231, 235, 0.5);
    }

    .lg\:col-span-3::-webkit-scrollbar {
        width: 6px;
    }

    .lg\:col-span-3::-webkit-scrollbar-track {
        background: rgba(229, 231, 235, 0.5);
        border-radius: 10px;
    }

    .lg\:col-span-3::-webkit-scrollbar-thumb {
        background: rgba(59, 130, 246, 0.3);
        border-radius: 10px;
    }

    .lg\:col-span-3::-webkit-scrollbar-thumb:hover {
        background: rgba(59, 130, 246, 0.5);
    }
</style>