<!-- components/FAQ/FAQCard.svelte -->
<script lang="ts">
	import { ChevronDown, ChevronUp } from 'lucide-svelte';
	import type { FAQItem } from '../../types/faq.js';

	interface Props {
		faq: FAQItem;
		isExpanded: boolean;
		onToggle: (id: string) => void;
	}

	let { faq, isExpanded, onToggle }: Props = $props();
</script>

<div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden transition-all duration-300 hover:shadow-lg">
	<button
		onclick={() => onToggle(faq.id)}
		class="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50/50 dark:hover:bg-gray-700/20 transition-colors duration-200"
	>
		<h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 pr-4">
			{faq.question}
		</h3>
		<div class="flex-shrink-0">
			{#if isExpanded}
				<ChevronUp class="w-5 h-5 text-gray-500" />
			{:else}
				<ChevronDown class="w-5 h-5 text-gray-500" />
			{/if}
		</div>
	</button>

	{#if isExpanded}
		<div class="px-6 pb-6 border-t border-gray-200/50 dark:border-gray-700/50">
			<div class="pt-4">
				<p class="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
					{faq.answer}
				</p>

				<!-- Tags -->
				{#if faq.tags.length > 0}
					<div class="flex flex-wrap gap-2">
						{#each faq.tags as tag}
              <span class="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full">
                {tag}
              </span>
						{/each}
					</div>
				{/if}
			</div>
		</div>
	{/if}
</div>