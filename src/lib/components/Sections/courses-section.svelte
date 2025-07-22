<script lang="ts">
	import CourseCard from "../Cards/course-card.svelte";
	import HeaderSection from "./header-section.svelte";
	import { ChevronLeft, ChevronRight, Grid3X3, List } from 'lucide-svelte';

	let viewMode = 'grid'; // 'grid' or 'list'
	let currentPage = 1;
	let coursesPerPage = 8;

</script>

<section class="relative py-24 overflow-hidden" aria-labelledby="courses-heading">
	<!-- Premium background with animated elements -->
	<div class="absolute inset-0 bg-gradient-to-br from-slate-50 via-indigo-50/40 to-blue-50 dark:from-slate-900 dark:via-indigo-950/40 dark:to-blue-950"></div>

	<!-- Floating geometric shapes -->
	<div class="absolute top-20 right-20 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-purple-500/10 rounded-full blur-2xl animate-float"></div>
	<div class="absolute bottom-20 left-20 w-24 h-24 bg-gradient-to-tr from-indigo-400/10 to-cyan-500/10 rounded-full blur-xl animate-float-delayed"></div>

	<div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<HeaderSection
			heading="Featured Learning Stations"
			subHeading="Master cutting-edge skills with our premium courses designed by industry experts"
			showBadge={true}
			badgeText="Premium Learning Hub"
		/>

		<!-- Advanced Controls Bar -->
		<div class="flex flex-col sm:flex-row items-center justify-between mb-12 gap-4">
			<!-- View Toggle -->
			<div class="flex items-center gap-2 p-1 bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg rounded-2xl border border-white/20 dark:border-gray-700/30">
				<button
					class="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 {viewMode === 'grid' ? 'bg-blue-500 text-white shadow-lg' : 'text-gray-600 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-700/50'}"
					on:click={() => viewMode = 'grid'}
				>
					<Grid3X3 class="w-4 h-4" />
					Grid View
				</button>
				<button
					class="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 {viewMode === 'list' ? 'bg-blue-500 text-white shadow-lg' : 'text-gray-600 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-700/50'}"
					on:click={() => viewMode = 'list'}
				>
					<List class="w-4 h-4" />
					List View
				</button>
			</div>

			<!-- Filter Tags -->
			<div class="flex flex-wrap items-center gap-2">
				{#each ['All Courses', 'EV Technology', 'Infrastructure', 'Certification', 'Advanced'] as tag, index}
					<button class="px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 hover:scale-105 {index === 0 ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg' : 'bg-white/60 dark:bg-gray-800/60 text-gray-700 dark:text-gray-300 hover:bg-white/80 dark:hover:bg-gray-700/80'} backdrop-blur-sm border border-white/20 dark:border-gray-700/30">
						{tag}
					</button>
				{/each}
			</div>
		</div>

		<!-- Courses Grid/List -->
		<div class="courses-container {viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8' : 'space-y-6'}">
			{#each Array(8) as _, index}
				<div
					class="course-item opacity-0 animate-fade-in-up"
					style="animation-delay: {index * 100}ms"
				>
					<CourseCard {viewMode} />
				</div>
			{/each}
		</div>

		<!-- Pagination -->
		<div class="flex items-center justify-center mt-16 gap-2">
			<button class="flex items-center justify-center w-12 h-12 rounded-2xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg border border-white/20 dark:border-gray-700/30 text-gray-600 dark:text-gray-300 hover:bg-white/80 dark:hover:bg-gray-700/80 hover:scale-110 transition-all duration-300">
				<ChevronLeft class="w-5 h-5" />
			</button>

			{#each [1, 2, 3, 4] as page}
				<button class="flex items-center justify-center w-12 h-12 rounded-2xl text-sm font-semibold transition-all duration-300 hover:scale-110 {page === currentPage ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg' : 'bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg border border-white/20 dark:border-gray-700/30 text-gray-600 dark:text-gray-300 hover:bg-white/80 dark:hover:bg-gray-700/80'}">
					{page}
				</button>
			{/each}

			<button class="flex items-center justify-center w-12 h-12 rounded-2xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg border border-white/20 dark:border-gray-700/30 text-gray-600 dark:text-gray-300 hover:bg-white/80 dark:hover:bg-gray-700/80 hover:scale-110 transition-all duration-300">
				<ChevronRight class="w-5 h-5" />
			</button>
		</div>
	</div>
</section>

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

    @keyframes float {
        0%, 100% { transform: translateY(0px) rotate(0deg); }
        33% { transform: translateY(-10px) rotate(1deg); }
        66% { transform: translateY(5px) rotate(-1deg); }
    }

    @keyframes float-delayed {
        0%, 100% { transform: translateY(0px) rotate(0deg); }
        33% { transform: translateY(8px) rotate(-1deg); }
        66% { transform: translateY(-12px) rotate(1deg); }
    }

    .animate-fade-in-up {
        animation: fade-in-up 0.8s ease-out forwards;
    }

    .animate-float {
        animation: float 6s ease-in-out infinite;
    }

    .animate-float-delayed {
        animation: float-delayed 8s ease-in-out infinite;
    }

    .course-item {
        transition: all 0.3s ease;
    }

    .courses-container:hover .course-item:not(:hover) {
        opacity: 0.7;
        transform: scale(0.98);
    }
</style>