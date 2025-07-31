<!-- TestimonialCard.svelte -->
<script lang="ts">
	import { Star, Quote } from 'lucide-svelte';
	import type { Testimonial } from '$lib/types/testimonials';

	export let testimonial: Testimonial;
	export let featured: boolean = false;

	// Generate star rating display
	function generateStars(rating: number): { filled: number; empty: number } {
		return {
			filled: Math.floor(rating),
			empty: 5 - Math.floor(rating)
		};
	}

	$: stars = generateStars(testimonial.rating);
</script>

<div
	class="group relative p-6 rounded-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-1 bg-white dark:bg-gray-800 shadow-lg hover:shadow-2xl border border-gray-100 dark:border-gray-700 {featured ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}"
	role="article"
	aria-label="Testimonial from {testimonial.name}"
>
	<!-- Quote icon -->
	<div class="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity">
		<Quote class="w-8 h-8 text-blue-500" />
	</div>

	<!-- Featured badge -->
	{#if featured || testimonial.featured}
		<div class="absolute -top-3 left-6 px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs font-semibold rounded-full">
			Featured Review
		</div>
	{/if}

	<!-- Rating -->
	<div class="flex items-center gap-1 mb-4">
		{#each Array(stars.filled) as _}
			<Star class="w-4 h-4 fill-yellow-400 text-yellow-400" />
		{/each}
		{#each Array(stars.empty) as _}
			<Star class="w-4 h-4 text-gray-300 dark:text-gray-600" />
		{/each}
		<span class="ml-2 text-sm font-medium text-gray-600 dark:text-gray-400">
      {testimonial.rating}.0
    </span>
	</div>

	<!-- Testimonial content -->
	<blockquote class="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
		"{testimonial.content}"
	</blockquote>

	<!-- Course info (if applicable) -->
	{#if testimonial.course}
		<div class="mb-4 px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-sm rounded-lg inline-block">
			Course: {testimonial.course}
		</div>
	{/if}

	<!-- Author info -->
	<div class="flex items-center gap-4">
		<div class="relative">
			<img
				src={testimonial.avatar}
				alt="{testimonial.name}'s avatar"
				class="w-12 h-12 rounded-full object-cover ring-2 ring-gray-100 dark:ring-gray-700"
			/>
			<!-- Online indicator for featured testimonials -->
			{#if featured || testimonial.featured}
				<div class="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
			{/if}
		</div>

		<div class="flex-1">
			<h4 class="font-semibold text-gray-900 dark:text-white">
				{testimonial.name}
			</h4>
			<p class="text-sm text-gray-600 dark:text-gray-400">
				{testimonial.role}
				{#if testimonial.company}
					<span class="text-blue-600 dark:text-blue-400">@ {testimonial.company}</span>
				{/if}
			</p>
		</div>
	</div>

	<!-- Hover effect border -->
	<div class="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
</div>