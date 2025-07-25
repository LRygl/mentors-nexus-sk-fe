<!-- src/routes/courses/+page.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { courses } from '$lib/stores/course-store';
	import {
		courseFilterStore,
		filteredAndSortedCourses,
		paginatedCourses,
		totalPages
	} from '$lib/stores/course-filter-store';

	import CourseCard from '$lib/components/Course/course-card.svelte';
	import CourseFilters from '$lib/components/Course/course-filters.svelte';
	import CourseSearchBar from '$lib/components/Course/course-search-bar.svelte';
	import Pagination from '$lib/components/Pagination.svelte';

	// Reactive state from stores
	let courseData = $state($courses);
	let filters = $state(courseFilterStore.filters);
	let displaySettings = $state(courseFilterStore.displaySettings);

	// Derived values
	let filteredCourses = $derived($filteredAndSortedCourses(courseData.data));
	let currentPageCourses = $derived($paginatedCourses(filteredCourses));
	let totalPagesCount = $derived($totalPages(filteredCourses));

	// Load courses on mount
	onMount(async () => {
		try {
			await courses.load();
		} catch (error) {
			console.error('Failed to load courses:', error);
		}
	});
</script>

<svelte:head>
	<title>Courses - Premium Learning Platform</title>
	<meta name="description" content="Discover world-class courses from industry experts and advance your career with hands-on learning" />
</svelte:head>

<main class="min-h-screen w-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50 dark:from-slate-900 dark:via-blue-950/30 dark:to-indigo-950">
	<!-- Floating background elements -->
	<div class="fixed top-20 right-20 w-64 h-64 bg-gradient-to-br from-blue-400/5 to-purple-500/5 rounded-full blur-3xl animate-pulse"></div>
	<div class="fixed bottom-20 left-20 w-48 h-48 bg-gradient-to-tr from-indigo-400/5 to-cyan-500/5 rounded-full blur-2xl animate-pulse" style="animation-delay: 2s;"></div>

	<div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
		<!-- Header Section -->
		<header class="text-center mb-12">
			<div class="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm border border-blue-200/30 dark:border-blue-700/30 rounded-full text-sm font-medium text-blue-700 dark:text-blue-300 mb-6">
				<span class="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
				Premium Learning Platform
			</div>
			<h1 class="text-4xl md:text-6xl font-bold bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-900 dark:from-white dark:via-blue-200 dark:to-indigo-200 bg-clip-text text-transparent mb-4">
				Master New Skills
			</h1>
			<p class="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
				Discover world-class courses from industry experts and advance your career with hands-on learning
			</p>
		</header>

		<!-- Search and Controls -->
		<CourseSearchBar
			searchQuery={filters.searchQuery}
			sortBy={filters.sortBy}
			viewMode={displaySettings.viewMode}
			showFilters={displaySettings.showFilters}
		/>

		<div class="flex gap-8">
			<!-- Filters Sidebar -->
			<CourseFilters
				filters={filters}
				showFilters={displaySettings.showFilters}
			/>

			<!-- Main Content -->
			<div class="flex-1">
				<!-- Loading State -->
				{#if courseData.loading}
					<div class="flex items-center justify-center py-16">
						<div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
					</div>
					<!-- Error State -->
				{:else if courseData.error}
					<div class="text-center py-16">
						<div class="w-24 h-24 mx-auto bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-800/30 rounded-3xl flex items-center justify-center mb-6">
							<svg class="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.732 15c-.77.833.192 2.5 1.732 2.5z"></path>
							</svg>
						</div>
						<h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Error loading courses</h3>
						<p class="text-gray-600 dark:text-gray-300 mb-6">{courseData.error}</p>
						<button
							onclick={() => courses.load(true)}
							class="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg"
						>
							Try Again
						</button>
					</div>
				{:else}
					<!-- Results Info -->
					<div class="flex items-center justify-between mb-6">
						<p class="text-gray-600 dark:text-gray-300">
							Showing {currentPageCourses.length} of {filteredCourses.length} courses
						</p>
					</div>

					<!-- Courses Grid/List -->
					<div class="courses-container {displaySettings.viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8' : 'space-y-6'}">
						{#each currentPageCourses as course, index}
							<CourseCard
								{course}
								viewMode={displaySettings.viewMode}
								{index}
							/>
						{/each}
					</div>

					<!-- Empty State -->
					{#if filteredCourses.length === 0 && courseData.data.length > 0}
						<div class="text-center py-16">
							<div class="w-24 h-24 mx-auto bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-3xl flex items-center justify-center mb-6">
								<svg class="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.137 0-4.146-.832-5.657-2.343m0-3.314C7.832 8.146 9.863 7.314 12 7.314s4.168.832 5.657 2.343M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
								</svg>
							</div>
							<h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">No courses found</h3>
							<p class="text-gray-600 dark:text-gray-300 mb-6">Try adjusting your filters or search terms</p>
							<button
								onclick={() => courseFilterStore.filters.reset()}
								class="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg"
							>
								Clear All Filters
							</button>
						</div>
					{/if}

					<!-- Pagination -->
					<Pagination
						currentPage={displaySettings.currentPage}
						totalPages={totalPagesCount}
					/>
				{/if}
			</div>
		</div>
	</div>
</main>

<style>
    @keyframes fade-in-up {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .course-card {
        opacity: 0;
        animation: fade-in-up 0.6s ease-out forwards;
    }

    .course-card.list-view {
        display: flex;
        flex-direction: column;
    }

    @media (min-width: 768px) {
        .course-card.list-view {
            flex-direction: row;
        }
    }

    .courses-container:hover :global(.course-card:not(:hover)) {
        opacity: 0.7;
        transform: scale(0.98);
    }

    /* Custom scrollbar */
    ::-webkit-scrollbar {
        width: 8px;
    }

    ::-webkit-scrollbar-track {
        background: rgba(0, 0, 0, 0.1);
        border-radius: 10px;
    }

    ::-webkit-scrollbar-thumb {
        background: linear-gradient(to bottom, #3b82f6, #8b5cf6);
        border-radius: 10px;
    }

    ::-webkit-scrollbar-thumb:hover {
        background: linear-gradient(to bottom, #2563eb, #7c3aed);
    }
</style>