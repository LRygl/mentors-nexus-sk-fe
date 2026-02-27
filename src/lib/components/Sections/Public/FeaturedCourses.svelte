<script lang="ts">
	import { onMount } from 'svelte';
	import { ChevronLeft, ChevronRight, BookOpen, TrendingUp } from 'lucide-svelte';
	import type { Course } from '$lib/types/entities/Course';
	import CourseCard from '$lib/components/Sections/Public/CourseCard.svelte';
	import { messages } from '$lib/i18n/messages';
	import { ROUTES } from '$lib/Config/routes.config';

	// Props
	let { courses = [], coursesPerGroup = 3 }: { courses: Course[]; coursesPerGroup?: number } = $props();

	// State
	let currentGroupIndex = $state(0);
	let isAutoPlaying = $state(true);
	let autoPlayInterval: ReturnType<typeof setInterval>;

	// Derived — group courses into pages
	let courseGroups = $derived(
		Array.from({ length: Math.ceil(courses.length / coursesPerGroup) }, (_, i) =>
			courses.slice(i * coursesPerGroup, (i + 1) * coursesPerGroup)
		)
	);

	let totalGroups = $derived(courseGroups.length);

	// Navigation
	const nextGroup = () => {
		if (totalGroups > 0) currentGroupIndex = (currentGroupIndex + 1) % totalGroups;
	};

	const prevGroup = () => {
		if (totalGroups > 0) currentGroupIndex = currentGroupIndex === 0 ? totalGroups - 1 : currentGroupIndex - 1;
	};

	const goToGroup = (index: number) => {
		currentGroupIndex = index;
		isAutoPlaying = false;
	};

	// Auto-play
	const startAutoPlay = () => {
		clearInterval(autoPlayInterval);
		if (isAutoPlaying && totalGroups > 1) autoPlayInterval = setInterval(nextGroup, 5000);
	};

	const stopAutoPlay = () => clearInterval(autoPlayInterval);

	// Lifecycle
	onMount(() => {
		startAutoPlay();
		return stopAutoPlay;
	});

	$effect(() => {
		stopAutoPlay();
		if (isAutoPlaying) startAutoPlay();
	});
</script>

<section class="relative w-full py-24 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-900 overflow-hidden">
	<!-- Subtle background accents -->
	<div class="absolute inset-0 pointer-events-none">
		<div class="absolute top-20 left-10 w-72 h-72 bg-indigo-100/40 dark:bg-indigo-900/10 rounded-full blur-3xl"></div>
		<div class="absolute bottom-20 right-10 w-96 h-96 bg-violet-100/30 dark:bg-violet-900/10 rounded-full blur-3xl"></div>
	</div>

	<div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

		<!-- Header -->
		<div class="text-center mb-16">
			<div class="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800/50 rounded-full text-indigo-700 dark:text-indigo-400 text-sm font-semibold mb-6">
				<TrendingUp class="w-4 h-4" />
				<span>{messages.course.featured.pill}</span>
			</div>

			<h2 class="text-4xl sm:text-5xl font-black text-gray-900 dark:text-white mb-4 tracking-tight">
				{messages.course.featured.heading}
				<span class="text-indigo-600 dark:text-indigo-400">{messages.course.featured.headingHighlight}</span>
			</h2>

			<p class="text-lg text-gray-500 dark:text-slate-400 max-w-2xl mx-auto">
				{messages.course.featured.description}
			</p>
		</div>

		<!-- Carousel -->
		<div class="relative">
			<!-- Prev / Next buttons -->
			{#if totalGroups > 1}
				<button
					onclick={prevGroup}
					onmouseenter={() => (isAutoPlaying = false)}
					class="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-5 z-20 w-10 h-10 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-600 shadow-sm hover:shadow-md rounded-xl flex items-center justify-center text-gray-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-200"
					aria-label="Previous group"
				>
					<ChevronLeft class="w-5 h-5" />
				</button>

				<button
					onclick={nextGroup}
					onmouseenter={() => (isAutoPlaying = false)}
					class="absolute right-0 top-1/2 -translate-y-1/2 translate-x-5 z-20 w-10 h-10 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-600 shadow-sm hover:shadow-md rounded-xl flex items-center justify-center text-gray-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-200"
					aria-label="Next group"
				>
					<ChevronRight class="w-5 h-5" />
				</button>
			{/if}

			<!-- Track -->
			<div class="overflow-hidden">
				<div
					class="flex transition-transform duration-700 ease-out"
					style="transform: translateX(-{currentGroupIndex * 100}%)"
				>
					{#each courseGroups as group, groupIndex (groupIndex)}
						<div class="w-full flex-shrink-0">
							<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
								{#each group as course (course.id)}
									<CourseCard {course} />
								{/each}
							</div>
						</div>
					{/each}
				</div>
			</div>
		</div>

		<!-- Pagination dots -->
		{#if totalGroups > 1}
			<div class="flex items-center justify-center gap-1.5 mt-8">
				{#each Array(totalGroups) as _, index}
					<button
						onclick={() => goToGroup(index)}
						class="rounded-full transition-all duration-300 {currentGroupIndex === index
							? 'w-6 h-2 bg-indigo-600 dark:bg-indigo-500'
							: 'w-2 h-2 bg-gray-300 dark:bg-slate-600 hover:bg-gray-400 dark:hover:bg-slate-500'}"
						aria-label="Go to group {index + 1}"
					></button>
				{/each}
			</div>
		{/if}

		<!-- View All CTA -->
		<div class="text-center mt-12">
			<a
				href={ROUTES.PUBLIC.STORE}
				class="inline-flex items-center gap-2 px-8 py-3.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-600 text-gray-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-semibold rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 group"
			>
				<BookOpen class="w-4 h-4 text-indigo-500" />
				{messages.course.featured.showAllCourses}
				<ChevronRight class="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
			</a>
		</div>

	</div>
</section>
