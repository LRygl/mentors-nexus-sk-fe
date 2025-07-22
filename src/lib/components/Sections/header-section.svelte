<script lang="ts">

	import { Star } from 'lucide-svelte';

	let {
		showBadge = false,
		badgeText = '',
		heading = '',
		subHeading = ','
	} = $props();

</script>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">



	<!-- Section Header -->
	<div class="text-center mb-16">
		{#if showBadge}
		<div class="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium mb-4">
			<Star class="w-4 h-4 fill-current" />
			{badgeText}
		</div>
		{/if}
		<h2 id="testimonials-heading" class="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
			{heading}
		</h2>

		<p class="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
			{subHeading}
		</p>
	</div>

</div>