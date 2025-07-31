<script lang="ts">
	import { Search, Sparkles } from 'lucide-svelte';

	interface Props {
		searchQuery: string;
		popularSearches?: string[];
		onSearchChange: (query: string) => void;
		onPopularSearchClick: (search: string) => void;
	}

	let {
		searchQuery,
		popularSearches = [],
		onSearchChange,
		onPopularSearchClick
	}: Props = $props();

	// Local input value to ensure reactivity
	let inputValue = $state(searchQuery);

	// Sync with prop changes
	$effect(() => {
		inputValue = searchQuery;
	});

	function handleInput(event: Event) {
		const target = event.target as HTMLInputElement;
		inputValue = target.value;
		onSearchChange(target.value);
	}

	function handleKeydown(event: KeyboardEvent) {
		// Allow normal typing behavior
		if (event.key === 'Escape') {
			const target = event.target as HTMLInputElement;
			target.blur();
		}
	}
</script>

<div class="max-w-2xl mx-auto">
	<!-- Enhanced Search Input -->
	<div class="relative group">
		<!-- Background gradient border -->
		<div class="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-3xl opacity-20 group-hover:opacity-40 group-focus-within:opacity-60 transition-all duration-500 blur-sm"></div>

		<!-- Main search container -->
		<div class="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-gray-700/30 shadow-xl group-hover:shadow-2xl transition-all duration-500">
			<!-- Search icon with animation -->
			<div class="absolute left-6 top-1/2 transform -translate-y-1/2 pointer-events-none z-10">
				<Search class="w-6 h-6 text-gray-400 group-focus-within:text-blue-500 group-focus-within:scale-110 transition-all duration-300" />
			</div>

			<!-- Search input -->
			<input
				type="text"
				value={inputValue}
				oninput={handleInput}
				onkeydown={handleKeydown}
				placeholder="Search frequently asked questions..."
				class="relative z-20 w-full pl-16 pr-6 py-5 text-lg bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 rounded-2xl focus:outline-none focus:ring-0 border-0 transition-all duration-300"
				autocomplete="off"
				spellcheck="false"
			/>

			<!-- Animated search indicator -->
			{#if inputValue}
				<div class="absolute right-6 top-1/2 transform -translate-y-1/2 z-10">
					<div class="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
				</div>
			{/if}

			<!-- Shimmer effect on focus -->
			<div class="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-focus-within:opacity-100 group-focus-within:animate-shimmer transition-opacity duration-500 pointer-events-none"></div>
		</div>
	</div>

	<!-- Enhanced Popular Searches -->
	{#if popularSearches.length > 0}
		<div class="mt-8 text-center animate-fade-in-up" style="animation-delay: 200ms;">
			<!-- Header with sparkles -->
			<div class="flex items-center justify-center gap-2 mb-4">
				<Sparkles class="w-4 h-4 text-purple-500 animate-pulse" />
				<p class="text-sm font-medium text-gray-600 dark:text-gray-400">
					Popular searches
				</p>
				<Sparkles class="w-4 h-4 text-blue-500 animate-pulse" style="animation-delay: 500ms;" />
			</div>

			<!-- Popular search buttons -->
			<div class="flex flex-wrap justify-center gap-3">
				{#each popularSearches as search, index}
					<button
						onclick={() => onPopularSearchClick(search)}
						class="group relative px-4 py-2 text-sm font-medium bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm text-gray-700 dark:text-gray-300 rounded-full border border-gray-200/50 dark:border-gray-600/50 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-lg hover:scale-105 transition-all duration-300 animate-fade-in-up"
						style="animation-delay: {300 + index * 100}ms;"
					>
						<!-- Button background gradient on hover -->
						<div class="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

						<!-- Button text -->
						<span class="relative z-10">{search}</span>

						<!-- Shine effect -->
						<div class="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:animate-shine transition-opacity duration-300"></div>
					</button>
				{/each}
			</div>
		</div>
	{/if}
</div>