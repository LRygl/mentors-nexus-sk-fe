<script lang="ts">
	import { onMount } from 'svelte';
	import { ChevronLeft, ChevronRight, Clock, Users, Star, BookOpen, TrendingUp } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';
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

	// Derived - group course into rotations
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

	// Formatters
	const formatPrice = (price: number) =>
		new Intl.NumberFormat('cs-CZ', { style: 'currency', currency: 'CZK', minimumFractionDigits: 0 }).format(price);

	const formatCount = (count: number) => (count >= 1000 ? `${(count / 1000).toFixed(1)}k` : String(count));

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

<section class="relative w-full py-24 bg-gradient-to-b from-slate-50 via-blue-50/30 to-white overflow-hidden">
	<!-- Background -->
	<div class="absolute inset-0 pointer-events-none">
		<div class="absolute top-20 left-10 w-72 h-72 bg-blue-200/20 rounded-full blur-3xl"></div>
		<div class="absolute bottom-20 right-10 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl"></div>
	</div>

	<div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<!-- Header -->
		<div class="text-center mb-16">
			<div class="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full text-blue-700 text-sm font-semibold mb-4">
				<TrendingUp class="w-4 h-4" />
				<span>{messages.course.featured.pill}</span>
			</div>

			<h2 class="text-4xl sm:text-5xl font-black text-gray-900 mb-4">
				{messages.course.featured.heading}
				<span class="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{messages.course.featured.headingHighlight}</span>
			</h2>

			<p class="text-xl text-gray-600 max-w-2xl mx-auto">
				{messages.course.featured.description}
			</p>
		</div>

		<!-- Carousel -->
		<div class="relative">
			<!-- Navigation -->
			{#if totalGroups > 1}
				<button
					onclick={prevGroup}
					onmouseenter={() => (isAutoPlaying = false)}
					class="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-20 w-12 h-12 bg-white hover:bg-gray-50 shadow-xl rounded-full flex items-center justify-center text-gray-800 hover:text-blue-600 transition-all duration-300 hover:scale-110 group"
					aria-label="Previous group"
				>
					<ChevronLeft class="w-6 h-6 group-hover:scale-110 transition-transform" />
				</button>

				<button
					onclick={nextGroup}
					onmouseenter={() => (isAutoPlaying = false)}
					class="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-20 w-12 h-12 bg-white hover:bg-gray-50 shadow-xl rounded-full flex items-center justify-center text-gray-800 hover:text-blue-600 transition-all duration-300 hover:scale-110 group"
					aria-label="Next group"
				>
					<ChevronRight class="w-6 h-6 group-hover:scale-110 transition-transform" />
				</button>
			{/if}

			<!-- Track -->
			<div class="overflow-hidden">
				<div class="flex transition-transform duration-700 ease-out" style="transform: translateX(-{currentGroupIndex * 100}%)">
					{#each courseGroups as group, groupIndex (groupIndex)}
						<div class="w-full flex-shrink-0">
							<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
								{#each group as course (course.id)}
									<!-- Course Card -->
									<CourseCard course={course} />
								{/each}
							</div>
						</div>
					{/each}
				</div>
			</div>

		</div>

		<!-- Pagination -->
		{#if totalGroups > 1}
			<div class="flex items-center justify-center gap-2 mt-8">
				{#each Array(totalGroups) as _, index}
					<button
						onclick={() => goToGroup(index)}
						class="transition-all duration-300 rounded-full {currentGroupIndex === index ? 'w-8 h-3 bg-blue-600' : 'w-3 h-3 bg-gray-300 hover:bg-gray-400'}"
						aria-label="Go to group {index + 1}"
					></button>
				{/each}
			</div>
		{/if}

		<!-- View All CTA -->
		<div class="text-center mt-12">
			<Button class="group px-8 py-4 bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-blue-600 text-gray-900 font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
				<span class="flex items-center gap-2">
					<BookOpen class="w-5 h-5 text-blue-600" />
					<a href="{ROUTES.PUBLIC.STORE}">{messages.course.featured.showAllCourses}</a>
					<ChevronRight class="w-5 h-5 group-hover:translate-x-1 transition-transform" />
				</span>
			</Button>
		</div>
	</div>
</section>