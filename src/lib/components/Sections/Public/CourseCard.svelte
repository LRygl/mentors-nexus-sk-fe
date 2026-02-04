<script lang="ts">
	import { Clock, Users, Star } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';
	import type { Course } from '$lib/types/entities/Course';
	import { formatDuration } from '$lib/utils/DateTimeFormatter';
	import { ROUTES } from '$lib/Config/routes.config';
	import { messages } from '$lib/i18n/messages';
	import { API_CONFIG } from '$lib/API/APIConfiguration';
	import DificultyIndicator from '$lib/components/DificultyIndicator.svelte';

	// Props
	let { course }: { course: Course } = $props();


console.log("Course IMAGE URL: ", course.imageUrl)

	let imageUrl = $derived(`/api/v1/files/${course.imageUrl}`);

	// Formatters
	const formatPrice = (price: number) =>
		new Intl.NumberFormat('cs-CZ', { style: 'currency', currency: 'CZK', minimumFractionDigits: 0 }).format(price);

	const formatCount = (count: number) => (count >= 1000 ? `${(count / 1000).toFixed(1)}k` : String(count));
</script>

<div class="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden h-full flex flex-col group">
	<!-- Image -->
	<div class="relative h-48 overflow-hidden bg-linear-to-br from-blue-100 to-purple-100">
		<img src={imageUrl} alt={course.name} class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />

		<!-- Badges -->
		<div class="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-bold text-gray-800">
			<DificultyIndicator level={course.level} size="sm" showLabel={false} />
		</div>
		<div class="absolute top-4 right-4 px-3 py-1 bg-blue-600/90 backdrop-blur-sm rounded-full text-xs font-bold text-white">
			{course.categories} Test
		</div>
		{#if course.featured}
			<div class="absolute bottom-4 left-4 flex items-center gap-1 px-3 py-1 bg-yellow-400/90 backdrop-blur-sm rounded-full text-xs font-bold text-gray-900">
				<Star class="w-3 h-3 fill-current" />
				<span>{messages.course.courseFeatured}</span>
			</div>
		{/if}
	</div>

	<!-- Content -->
	<div class="flex-1 p-6 flex flex-col">
		<h3 class="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
			{course.name}
		</h3>

		<p class="text-sm text-gray-600 mb-4 line-clamp-2 flex-1">{course.description}</p>

		<!-- Author -->
		<div class="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">

			<div class="flex-1 min-w-0">
				<p class="text-sm font-semibold text-gray-900 truncate">{messages.course.courseAuthor}</p>
				<p class="text-xs text-gray-500">
					{course.owner ? `${course.owner.lastName} ${course.owner.firstName}` : 'Unknown Author'}
				</p>
			</div>
		</div>

		<!-- Meta -->
		<div class="grid grid-cols-2 gap-3 mb-4">
			<div class="flex items-center gap-2 text-sm text-gray-600">
				<Clock class="w-4 h-4 text-blue-600" />
				<span>{formatDuration(course.duration ?? 0, 'short')}</span>
			</div>
			<div class="flex items-center gap-2 text-sm text-gray-600">
				<Users class="w-4 h-4 text-purple-600" />
				<span>{course.students} {messages.course.courseStudentCout}</span>
			</div>
		</div>

		<!-- Rating -->
		<div class="flex items-center gap-2 mb-4">
			<div class="flex items-center">
				{#each Array(5) as _, i}
					<Star class="w-4 h-4 {i < Math.floor(4) ? 'text-yellow-400 fill-current' : 'text-gray-300'}" />
				{/each}
			</div>
			<span class="text-sm font-semibold text-gray-900">{course.rating}</span>
			<span class="text-sm text-gray-500">(50 {messages.course.courseReviews})</span>
		</div>

		<!-- Price & CTA -->
		<div class="flex items-center justify-between pt-4 border-t border-gray-100">
			<div class="text-2xl font-black text-gray-900">{formatPrice(course.price)}</div>
			<Button class="bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-6 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105">
				<a href="{ROUTES.PUBLIC.COURSE}/{course.id}">{messages.course.viewCourseDetail}</a>
			</Button>
		</div>
	</div>
</div>

<style>
    .line-clamp-2 {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }
</style>