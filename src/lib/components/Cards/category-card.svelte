<!-- CategoryCard.svelte -->
<script lang="ts">
	import { ChevronRight } from 'lucide-svelte';

	export let category;

	// No need to import mode - we'll use Tailwind's dark: classes
</script>

<div
	class="group relative p-8 rounded-3xl cursor-pointer transition-all duration-500 hover:scale-105 hover:-translate-y-2 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:hover:bg-gray-600 shadow-lg hover:shadow-2xl"
	role="button"
	tabindex="0"
	on:mouseenter
	on:mouseleave
	on:click
	on:keydown
>
	<div class="w-14 h-14 rounded-xl bg-gradient-to-br {category.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
		<svelte:component this={category.icon} class="w-8 h-8 text-white" />
	</div>

	<h3 class="text-2xl font-bold mb-0 text-gray-900 dark:text-white">
		{category.name}
	</h3>

	<p class="text-gray-600 dark:text-gray-300 text-muted-foreground mb-2">
		{category.courses} courses available
	</p>

	<div class="flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 group-hover:text-opacity-80 transition-colors">
		Explore services
		<ChevronRight class="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
	</div>

	<!-- Animated border -->
	<div class="absolute inset-0 rounded-3xl bg-gradient-to-r from-transparent via-blue-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
</div>