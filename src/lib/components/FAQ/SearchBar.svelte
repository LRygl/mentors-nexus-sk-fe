<!-- src/lib/components/FAQ/SearchBar.svelte -->
<script lang="ts">
	import { Search, X } from 'lucide-svelte';

	interface Props {
		searchQuery: string;
		popularSearches: string[];
		onSearchChange: (query: string) => void;
		onPopularSearchClick: (search: string) => void;
	}

	let { searchQuery, popularSearches, onSearchChange, onPopularSearchClick }: Props = $props();

	let inputElement: HTMLInputElement;

	function handleInput(event: Event) {
		const target = event.target as HTMLInputElement;
		onSearchChange(target.value);
	}

	function handleClear() {
		onSearchChange('');
		inputElement?.focus();
	}

	function handlePopularClick(search: string) {
		onPopularSearchClick(search);
		inputElement?.focus();
	}
</script>

<div class="space-y-6">
	<!-- Search Input -->
	<div class="relative max-w-2xl mx-auto">
		<div class="relative">
			<Search class="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
			<input
				bind:this={inputElement}
				type="text"
				value={searchQuery}
				oninput={handleInput}
				placeholder="Search FAQs..."
				class="w-full pl-12 pr-12 py-4 text-lg border border-gray-300 rounded-2xl focus:ring-2 focus:ring-nexus-primary focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md"
			/>
			{#if searchQuery}
				<button
					onclick={handleClear}
					class="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
					aria-label="Clear search"
				>
					<X class="w-5 h-5" />
				</button>
			{/if}
		</div>
	</div>

	<!-- Popular Searches -->
	{#if popularSearches.length > 0 && !searchQuery}
		<div class="text-center space-y-3">
			<p class="text-sm text-gray-600 font-medium">Popular searches:</p>
			<div class="flex flex-wrap justify-center gap-2">
				{#each popularSearches as search}
					<button
						onclick={() => handlePopularClick(search)}
						class="px-4 py-2 text-sm bg-gray-100 hover:bg-nexus-primary hover:text-white rounded-full transition-all duration-200 font-medium"
					>
						{search}
					</button>
				{/each}
			</div>
		</div>
	{/if}
</div>