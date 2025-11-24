<script lang="ts">
	import { Clock, Users, Star, ArrowRight } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';
	import type { Course } from '$lib/types/entities/Course';
	import { formatDuration } from '$lib/utils/DateTimeFormatter';
	import { ROUTES } from '$lib/Config/routes.config';
	import { messages } from '$lib/i18n/messages';

	// Props
	let { course }: { course: Course } = $props();

	// Formatters
	const formatPrice = (price: number) =>
		new Intl.NumberFormat('cs-CZ', { style: 'currency', currency: 'CZK', minimumFractionDigits: 0 }).format(price);

	const formatCount = (count: number) => (count >= 1000 ? `${(count / 1000).toFixed(1)}k` : String(count));
</script>

<div class="bg-white rounded-3xl shadow-lg hover:shadow-2xl border border-gray-200 hover:border-blue-300 transition-all duration-500 overflow-hidden group">
	<div class="flex flex-col md:flex-row h-full">
		<!-- Image Section -->
		<div class="relative md:w-80 h-56 md:h-auto flex-shrink-0 overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100">
			<img
				src={course.imageUrl}
				alt={course.name}
				class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
			/>

			<!-- Badges -->
			<div class="absolute top-4 left-4 flex flex-wrap gap-2">
				<div class="px-3 py-1 bg-white/95 backdrop-blur-sm rounded-full text-xs font-bold text-gray-800 shadow-md">
					{course.level}
				</div>
				<div class="px-3 py-1 bg-gradient-to-r from-blue-600 to-purple-600 backdrop-blur-sm rounded-full text-xs font-bold text-white shadow-md">
					{course.categories}
				</div>
			</div>

			{#if course.featured}
				<div class="absolute bottom-4 left-4 flex items-center gap-1 px-3 py-1 bg-yellow-400 backdrop-blur-sm rounded-full text-xs font-bold text-gray-900 shadow-md">
					<Star class="w-3 h-3 fill-current" />
					<span>{messages.course.courseFeatured}</span>
				</div>
			{/if}
		</div>

		<!-- Content Section -->
		<div class="flex-1 p-6 flex flex-col justify-between">
			<div>
				<!-- Title & Description -->
				<div class="mb-4">
					<h3 class="text-2xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-1">
						{course.name}
					</h3>
					<p class="text-gray-600 text-sm line-clamp-2">{course.description}</p>
				</div>

				<!-- Author -->
				<div class="flex items-center gap-3 mb-4 pb-4 border-b border-gray-200">
					<div class="flex-1 min-w-0">
						<p class="text-sm font-semibold text-gray-900">{messages.course.courseAuthor}</p>
						<p class="text-xs text-gray-600">
							{course.owner ? `${course.owner.lastName} ${course.owner.firstName}` : 'Unknown Author'}
						</p>
					</div>
				</div>

				<!-- Meta Information Grid -->
				<div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
					<div class="flex flex-col gap-1">
						<div class="flex items-center gap-2 text-blue-600">
							<Clock class="w-4 h-4" />
							<span class="text-xs font-medium text-gray-600">Duration</span>
						</div>
						<span class="text-sm font-semibold text-gray-900">{formatDuration(course.duration ?? 0, 'short')}</span>
					</div>

					<div class="flex flex-col gap-1">
						<div class="flex items-center gap-2 text-purple-600">
							<Users class="w-4 h-4" />
							<span class="text-xs font-medium text-gray-600">Students</span>
						</div>
						<span class="text-sm font-semibold text-gray-900">350 {messages.course.courseStudentCout}</span>
					</div>

					<div class="flex flex-col gap-1">
						<div class="flex items-center gap-2 text-yellow-500">
							<Star class="w-4 h-4 fill-current" />
							<span class="text-xs font-medium text-gray-600">Rating</span>
						</div>
						<div class="flex items-center gap-2">
							<span class="text-sm font-semibold text-gray-900">{course.rating}</span>
							<span class="text-xs text-gray-500">(50 reviews)</span>
						</div>
					</div>

					<div class="flex flex-col gap-1">
						<span class="text-xs font-medium text-gray-600">Price</span>
						<span class="text-2xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{formatPrice(course.price)}</span>
					</div>
				</div>
			</div>

			<!-- Action Section -->
			<div class="flex items-center justify-between pt-4 border-t border-gray-200">
				<!-- Star Rating Visual -->
				<div class="flex items-center gap-1">
					{#each Array(5) as _, i}
						<Star class="w-4 h-4 {i < Math.floor(course.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}" />
					{/each}
				</div>

				<!-- CTA Button -->
				<Button class="group/btn bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-6 py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
					<a href="{ROUTES.PUBLIC.COURSE}/{course.id}" class="flex items-center gap-2">
						{messages.course.viewCourseDetail}
						<ArrowRight class="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
					</a>
				</Button>
			</div>
		</div>
	</div>
</div>

<style>
    .line-clamp-1 {
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }

    .line-clamp-2 {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }
</style>