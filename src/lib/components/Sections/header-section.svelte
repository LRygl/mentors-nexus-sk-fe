<script lang="ts">

	import { Sparkles, Star } from 'lucide-svelte';

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
			<div class="group inline-flex items-center gap-2 px-6 py-3 mb-6 relative overflow-hidden rounded-full transition-all duration-500 hover:scale-105">
				<!-- Glassmorphism background -->
				<div class="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-cyan-500/10 backdrop-blur-sm border border-white/20 dark:border-gray-700/30 rounded-full"></div>

				<!-- Animated border gradient -->
				<div class="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-full opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
				<div class="absolute inset-[1px] bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-full"></div>

				<!-- Content -->
				<div class="relative flex items-center gap-2">
					<Sparkles class="w-4 h-4 text-blue-600 dark:text-blue-400 animate-pulse" />
					<span class="text-sm font-semibold bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
            {badgeText}
          </span>
				</div>
			</div>
		{/if}

		<!-- Main heading with gradient text -->
		<h2
			id="testimonials-heading"
			class="text-5xl md:text-6xl lg:text-7xl font-black mb-8 leading-tight"
		>
      <span class="bg-gradient-to-r from-gray-900 via-blue-800 to-gray-900 dark:from-white dark:via-blue-200 dark:to-white bg-clip-text text-transparent">
        {heading}
      </span>
		</h2>

		<!-- Subtitle with enhanced styling -->
		<p class="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed font-light">
			{subHeading}
		</p>

		<!-- Decorative elements -->
		<div class="flex justify-center mt-12">
			<div class="flex space-x-2">
				<div class="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
				<div class="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-100"></div>
				<div class="w-2 h-2 bg-cyan-500 rounded-full animate-bounce delay-200"></div>
			</div>
		</div>
	</div>
</div>