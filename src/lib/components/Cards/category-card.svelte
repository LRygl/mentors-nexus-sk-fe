<!-- CategoryCard.svelte -->
<script lang="ts">
	import { ArrowUpRight, ChevronRight } from 'lucide-svelte';

	export let category;

	// No need to import mode - we'll use Tailwind's dark: classes
</script>

<div
	class="group relative p-8 rounded-3xl cursor-pointer transition-all duration-700 hover:scale-[1.02] overflow-hidden"
	role="button"
	tabindex="0"
	on:mouseenter
	on:mouseleave
	on:click
	on:keydown
>
	<!-- Glassmorphism background with animated gradient -->
	<div class="absolute inset-0 bg-gradient-to-br from-white/80 via-white/60 to-white/40 dark:from-gray-800/80 dark:via-gray-800/60 dark:to-gray-800/40 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 rounded-3xl transition-all duration-700 group-hover:border-white/40 dark:group-hover:border-gray-600/50"></div>

	<!-- Animated gradient overlay -->
	<div class="absolute inset-0 bg-gradient-to-br from-transparent via-blue-500/5 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-3xl"></div>

	<!-- Floating particles effect -->
	<div class="absolute top-4 right-4 w-2 h-2 bg-blue-400 rounded-full opacity-0 group-hover:opacity-60 transition-all duration-500 group-hover:animate-ping"></div>
	<div class="absolute bottom-8 left-6 w-1 h-1 bg-purple-400 rounded-full opacity-0 group-hover:opacity-40 transition-all duration-700 delay-200 group-hover:animate-pulse"></div>

	<!-- Content -->
	<div class="relative z-10">
		<!-- Icon container with enhanced styling -->
		<div class="relative mb-6">
			<div class="w-16 h-16 rounded-2xl bg-gradient-to-br {category.color} flex items-center justify-center shadow-lg group-hover:shadow-2xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
				<svelte:component this={category.icon} class="w-8 h-8 text-white drop-shadow-sm" />
			</div>

			<!-- Floating ring animation -->
			<div class="absolute inset-0 w-16 h-16 rounded-2xl border-2 border-blue-400/0 group-hover:border-blue-400/30 group-hover:scale-125 transition-all duration-700"></div>
		</div>

		<!-- Title with enhanced typography -->
		<h3 class="text-2xl md:text-3xl font-bold mb-3 text-gray-900 dark:text-white group-hover:text-blue-900 dark:group-hover:text-blue-100 transition-colors duration-500">
			{category.name}
		</h3>

		<!-- Subtitle with improved styling -->
		<p class="text-gray-600 dark:text-gray-300 mb-6 font-medium">
			<span class="text-blue-600 dark:text-blue-400 font-semibold">{category.courses}</span> courses available
		</p>

		<!-- CTA with modern design -->
		<div class="flex items-center justify-between">
			<div class="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
				<span>Explore services</span>
				<ArrowUpRight class="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
			</div>

			<!-- Animated progress indicator -->
			<div class="w-8 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
				<div class="w-0 h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full group-hover:w-full transition-all duration-700 delay-200"></div>
			</div>
		</div>
	</div>

	<!-- Enhanced hover effects -->
	<div class="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
		<!-- Subtle glow -->
		<div class="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-400/5 via-transparent to-purple-400/5 blur-xl"></div>

		<!-- Border shimmer -->
		<div class="absolute inset-0 rounded-3xl bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 animate-pulse"></div>
	</div>
</div>