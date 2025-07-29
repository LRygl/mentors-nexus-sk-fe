<!-- components/FAQ/EmptyState.svelte -->
<script lang="ts">
	import { HelpCircle } from 'lucide-svelte';

	interface Props {
		onClearFilters: () => void;
	}

	let { onClearFilters }: Props = $props();
</script>

<div class="text-center py-16">
	<HelpCircle class="w-16 h-16 text-gray-400 mx-auto mb-4" />
	<h3 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">No questions found</h3>
	<p class="text-gray-600 dark:text-gray-400 mb-6">
		Try adjusting your search terms or browse different categories.
	</p>
	<button
		onclick={onClearFilters}
		class="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
	>
		Show All Questions
	</button>
</div>