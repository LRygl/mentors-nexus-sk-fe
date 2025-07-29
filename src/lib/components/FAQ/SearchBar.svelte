<!-- components/FAQ/SearchBar.svelte -->
<script lang="ts">
	import { Search } from 'lucide-svelte';

	interface Props {
		searchQuery: string;
		popularSearches?: string[];
		onSearchChange: (query: string) => void;
		onPopularSearchClick: (search: string) => void;
	}

	let {
		searchQuery = $bindable(),
		popularSearches = [],
		onSearchChange,
		onPopularSearchClick
	}: Props = $props();

	function handleInput(event: Event) {
		const target = event.target as HTMLInputElement;
		onSearchChange(target.value);
	}
</script>

<div class="max-w-2xl mx-auto">
	<div class="relative">
		<Search class="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
		<input
			type="text"
			value={searchQuery}
			oninput={handleInput}
			placeholder="Search frequently asked questions..."
			class="w-full pl-12 pr-4 py-4 text-lg border border-gray-300 dark:border-gray-600 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
		/>
	</div>

	{#if popularSearches.length > 0}
		<div class="mt-4 text-center">
			<p class="text-sm text-gray-600 dark:text-gray-400 mb-3">Popular searches:</p>
			<div class="flex flex-wrap justify-center gap-2">
				{#each popularSearches as search}
					<button
						onclick={() => onPopularSearchClick(search)}
						class="px-3 py-1 text-xs bg-white/60 dark:bg-gray-700/60 text-gray-700 dark:text-gray-300 rounded-full border border-gray-200 dark:border-gray-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200"
					>
						{search}
					</button>
				{/each}
			</div>
		</div>
	{/if}
</div>