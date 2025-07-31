
<!-- src/lib/components/FAQ/SearchBar.svelte -->
<script lang="ts">
	import { Search } from 'lucide-svelte';

	interface Props {
		searchQuery: string;
		popularSearches: string[];
		onSearchChange: (query: string) => void;
		onPopularSearchClick: (search: string) => void;
	}

	let { searchQuery, popularSearches, onSearchChange, onPopularSearchClick }: Props = $props();

	function handleInput(event: Event) {
		const target = event.target as HTMLInputElement;
		onSearchChange(target.value);
	}
</script>

<div class="max-w-2xl mx-auto">
	<!-- Search Input -->
	<div class="relative mb-6">
		<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
			<Search class="w-5 h-5 text-gray-400" />
		</div>
		<input
			type="text"
			value={searchQuery}
			oninput={handleInput}
			placeholder="Search frequently asked questions..."
			class="block w-full pl-10 pr-4 py-4 border border-gray-300 rounded-xl text-lg placeholder-gray-500 focus:ring-2 focus:ring-nexus-primary focus:border-transparent transition-colors duration-200"
		/>
	</div>

	<!-- Popular Searches -->
	{#if popularSearches.length > 0 && !searchQuery}
		<div class="text-center">
			<p class="text-sm text-gray-600 mb-3">Popular searches:</p>
			<div class="flex flex-wrap justify-center gap-2">
				{#each popularSearches as search}
					<button
						onclick={() => onPopularSearchClick(search)}
						class="px-3 py-1 bg-gray-100 hover:bg-nexus-primary-50 text-gray-700 hover:text-nexus-primary text-sm rounded-full transition-colors duration-200"
					>
						{search}
					</button>
				{/each}
			</div>
		</div>
	{/if}
</div>