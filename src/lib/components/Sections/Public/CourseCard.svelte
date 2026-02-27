<script lang="ts">
	import { Clock, Users, Star, ArrowRight } from 'lucide-svelte';
	import type { Course } from '$lib/types/entities/Course';
	import { formatDuration } from '$lib/utils/DateTimeFormatter';
	import { ROUTES } from '$lib/Config/routes.config';
	import { messages } from '$lib/i18n/messages';
	import DificultyIndicator from '$lib/components/DificultyIndicator.svelte';

	// Props
	let { course }: { course: Course } = $props();

	let imageUrl = $derived(`/api/v1/files${course.imageUrl}`);

	// Derived values
	let firstCategory = $derived(Array.isArray(course.categories) ? course.categories[0] : undefined);
	let ratingFloor = $derived(Math.floor(course.rating ?? 0));

	// Formatters
	const formatPrice = (price: number) =>
		new Intl.NumberFormat('cs-CZ', { style: 'currency', currency: 'CZK', minimumFractionDigits: 0 }).format(price);

	const formatCount = (count: number) => (count >= 1000 ? `${(count / 1000).toFixed(1)}k` : String(count));
</script>

<a
	href="{ROUTES.PUBLIC.COURSE}/{course.id}"
	class="group block bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 overflow-hidden h-full flex flex-col"
>
	<!-- Image -->
	<div class="relative h-48 overflow-hidden bg-slate-100 dark:bg-slate-700 flex-shrink-0">
		<img
			src={imageUrl}
			alt={course.name}
			class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
		/>

		<!-- Badges -->
		<div class="absolute top-3 left-3">
			<div class="px-2.5 py-1 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-lg text-xs font-semibold text-gray-700 dark:text-slate-200 border border-white/50 dark:border-slate-600/50">
				<DificultyIndicator level={course.level} size="sm" showLabel={false} />
			</div>
		</div>

		{#if firstCategory}
			<div class="absolute top-3 right-3 px-2.5 py-1 bg-indigo-600/90 backdrop-blur-sm rounded-lg text-xs font-semibold text-white">
				{firstCategory}
			</div>
		{/if}

		{#if course.featured}
			<div class="absolute bottom-3 left-3 flex items-center gap-1 px-2.5 py-1 bg-amber-400/95 backdrop-blur-sm rounded-lg text-xs font-bold text-amber-900">
				<Star class="w-3 h-3 fill-current" />
				<span>{messages.course.courseFeatured}</span>
			</div>
		{/if}
	</div>

	<!-- Content -->
	<div class="flex-1 p-5 flex flex-col">

		<!-- Title -->
		<h3 class="text-base font-bold text-gray-900 dark:text-white mb-1.5 line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-snug">
			{course.name}
		</h3>

		<!-- Description -->
		<p class="text-sm text-gray-500 dark:text-slate-400 mb-4 line-clamp-2 flex-1 leading-relaxed">
			{course.description}
		</p>

		<!-- Author -->
		<div class="flex items-center gap-2 mb-4 pb-4 border-b border-gray-100 dark:border-slate-700">
			<!-- Avatar placeholder -->
			<div class="w-7 h-7 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center flex-shrink-0">
				<span class="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
					{course.owner ? course.owner.firstName?.[0] ?? '?' : '?'}
				</span>
			</div>
			<div class="min-w-0">
				<p class="text-xs text-gray-500 dark:text-slate-400">{messages.course.courseAuthor}</p>
				<p class="text-xs font-semibold text-gray-700 dark:text-slate-300 truncate">
					{course.owner ? `${course.owner.firstName} ${course.owner.lastName}` : 'Unknown Author'}
				</p>
			</div>
		</div>

		<!-- Meta row -->
		<div class="flex items-center gap-4 mb-4 text-xs text-gray-500 dark:text-slate-400">
			<div class="flex items-center gap-1.5">
				<Clock class="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />
				<span>{formatDuration(course.duration ?? 0, 'short')}</span>
			</div>
			<div class="flex items-center gap-1.5">
				<Users class="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />
				<span>{formatCount(course.students ?? 0)} {messages.course.courseStudentCout}</span>
			</div>
		</div>

		<!-- Rating -->
		<div class="flex items-center gap-2 mb-4">
			<div class="flex items-center gap-0.5">
				{#each Array(5) as _, i}
					<Star
						class="w-3.5 h-3.5 {i < ratingFloor
							? 'text-amber-400 fill-amber-400'
							: 'text-gray-200 dark:text-slate-600 fill-gray-200 dark:fill-slate-600'}"
					/>
				{/each}
			</div>
			{#if course.rating}
				<span class="text-xs font-semibold text-gray-700 dark:text-slate-300">{course.rating.toFixed(1)}</span>
			{/if}
		</div>

		<!-- Price & CTA -->
		<div class="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-slate-700">
			<span class="text-xl font-black text-gray-900 dark:text-white">
				{formatPrice(course.price)}
			</span>
			<span class="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 dark:text-indigo-400 group-hover:gap-2.5 transition-all duration-200">
				{messages.course.viewCourseDetail}
				<ArrowRight class="w-4 h-4" />
			</span>
		</div>
	</div>
</a>
