<!-- src/lib/components/FAQ/EmptyState.svelte -->
<script lang="ts">
	import { Search, RotateCcw, HelpCircle } from 'lucide-svelte';

	interface Props {
		onClearFilters: () => void;
	}

	let { onClearFilters }: Props = $props();
</script>

<div class="text-center py-16 px-6">
	<div class="max-w-md mx-auto">
		<!-- Icon -->
		<div class="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-6">
			<Search class="w-8 h-8 text-gray-400" />
		</div>

		<!-- Heading -->
		<h3 class="text-xl font-semibold text-gray-900 mb-4">
			No FAQs found
		</h3>

		<!-- Description -->
		<p class="text-gray-600 mb-8 leading-relaxed">
			We couldn't find any FAQs matching your current search criteria. Try adjusting your search terms or clearing the filters.
		</p>

		<!-- Actions -->
		<div class="space-y-4">
			<button
				onclick={onClearFilters}
				class="inline-flex items-center gap-2 px-6 py-3 bg-nexus-primary text-white rounded-xl hover:bg-nexus-primary-600 transition-colors duration-200 font-medium"
			>
				<RotateCcw class="w-4 h-4" />
				Clear all filters
			</button>

			<div class="text-sm text-gray-500">
				<p>Still need help?</p>
				<a
					href="/contact"
					class="inline-flex items-center gap-1 text-nexus-primary hover:text-nexus-primary-600 transition-colors duration-200 mt-2"
				>
					<HelpCircle class="w-4 h-4" />
					Contact our support team
				</a>
			</div>
		</div>
	</div>
</div>